from flask import Flask, request, jsonify
import atexit
from ssh_tunnel import SSHTunnelManager
from database import Database
import datetime
from datetime import datetime, timedelta
import random

# ====== Config ======
SSH_CONFIG = {
    "ssh_host": "isapc7.york.ac.uk",
    "ssh_port": 22,
    "ssh_user": "davebradley",
    "ssh_password": "ISAPC72024",
    "remote_bind_host": "172.17.0.2",
    "remote_bind_port": 3306,
}

DB_CONFIG = {"user": "solardb", "password": "solardb", "name": "solar_db"}

# ====== Setup ======
ssh_tunnel = SSHTunnelManager(**SSH_CONFIG)
ssh_tunnel.start()

db = Database(
    host="127.0.0.1",
    port=ssh_tunnel.local_bind_port,
    user=DB_CONFIG["user"],
    password=DB_CONFIG["password"],
    name=DB_CONFIG["name"],
)

app = Flask(__name__)

# Battery constants
BATTERY_MIN_VOLTAGE = 5.0
BATTERY_MAX_VOLTAGE = 18.0
CURRENT_THRESHOLD = 0.5
# Load constants
BASELINE_KW = 2.0
DAYLIGHT_FACTOR = 1.0
COOLING_ALPHA = 0.25  # kW/°C
HEATING_ALPHA = 0.20  # kW/°C
COOLING_THRESHOLD = 22.0
HEATING_THRESHOLD = 18.0


def run_db_query(sql, params=None):
    """Ensure tunnel, run SQL, return JSON-safe results."""
    try:
        ssh_tunnel.ensure_tunnel()
        results = db.query(sql, params or [])
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def run_safe(func):
    """Decorator to wrap route functions in error handling."""

    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    wrapper.__name__ = func.__name__
    return wrapper


def get_period_range(period: str, now=None):
    """
    Returns a tuple (start_time, interval_seconds, group_by)
    based on a standard period string.
    """
    now = now or datetime.utcnow()

    period_map = {
        "hour":      (now - timedelta(hours=1), 5*60, "5min"),      # 5-minute intervals
        "day":       (now.replace(hour=0, minute=0, second=0, microsecond=0), 3600, "hour"),  # hourly
        "24-hour":   (now - timedelta(hours=24), 3600, "hour"),     # hourly
        "week":      (now - timedelta(days=7), 6*3600, "6hour"),    # 6-hour intervals
        "month":     (now - timedelta(days=30), 24*3600, "day"),    # daily
        "year":      (now - timedelta(weeks=52), 7*24*3600, "week") # weekly
    }

    result = period_map.get(period.lower())
    if not result:
        raise ValueError(f"Invalid period: {period}")
    return result  # (start_time, interval_seconds, group_by)


@app.route("/query", methods=["POST"])
@run_safe
def run_query():
    data = request.json
    sql = data.get("query")
    params = data.get("params", [])
    if not sql:
        return jsonify({"error": "No SQL query provided"}), 400
    return run_db_query(sql, params)


@app.route("/current_solar_prod", methods=["GET"])
def run_current_solar_prod():
    sql = """
    SELECT SUM(avg_power)/1000.0 AS site_kW_5min_avg
    FROM (
        SELECT inverter, AVG(totalActivePower) AS avg_power
        FROM inverter_data
        WHERE timestamp >= NOW() - INTERVAL 5 MINUTE
        GROUP BY inverter
    ) t;
    """
    return run_db_query(sql)


@app.route("/historical_solar_prod", methods=["POST"])
def run_historical_solar_prod():
    try:
        data = request.get_json(force=True)
        period = data.get("period", "day").lower()

        ssh_tunnel.ensure_tunnel()

        if period == "hour":
            sql = """
            SELECT 
                t_bucket AS ts,
                SUM(avg_power)/1000.0 AS site_kW
            FROM (
                SELECT 
                    inverter,
                    DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:%%i:00') AS t_bucket,
                    AVG(totalActivePower) AS avg_power
                FROM inverter_data
                WHERE timestamp >= NOW() - INTERVAL 1 HOUR - INTERVAL 5 MINUTE
                AND timestamp <= NOW()
                GROUP BY inverter, t_bucket
            ) t
            GROUP BY t_bucket
            ORDER BY t_bucket;
                    """

        elif period == "day":
            sql = """
            SELECT 
                t_bucket AS ts,
                SUM(avg_power)/1000.0 AS site_kW
            FROM (
                SELECT 
                    inverter,
                    DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:00:00') AS t_bucket,
                    AVG(totalActivePower) AS avg_power
                FROM inverter_data
                WHERE timestamp >= CURDATE()
                GROUP BY inverter, t_bucket
            ) t
            GROUP BY t_bucket
            ORDER BY t_bucket;
            """

        elif period == "24-hour":
            sql = """
            SELECT 
                t_bucket AS ts,
                SUM(avg_power)/1000.0 AS site_kW
            FROM (
                SELECT 
                    inverter,
                    DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:00:00') AS t_bucket,
                    AVG(totalActivePower) AS avg_power
                FROM inverter_data
                WHERE timestamp >= NOW() - INTERVAL 24 HOUR
                GROUP BY inverter, t_bucket
            ) t
            GROUP BY t_bucket
            ORDER BY t_bucket;
            """

        elif period == "week":
            sql = """
            SELECT 
                t_bucket AS ts,
                SUM(avg_power)/1000.0 AS site_kW
            FROM (
                SELECT 
                    inverter,
                    DATE_FORMAT(timestamp - INTERVAL (HOUR(timestamp) %% 6) HOUR, '%%Y-%%m-%%d %%H:00:00') AS t_bucket,
                    AVG(totalActivePower) AS avg_power
                FROM inverter_data
                WHERE timestamp >= NOW() - INTERVAL 7 DAY
                GROUP BY inverter, t_bucket
            ) t
            GROUP BY t_bucket
            ORDER BY t_bucket;
            """

        elif period == "month":
            sql = """
            SELECT 
                t_bucket AS ts,
                SUM(avg_power)/1000.0 AS site_kW
            FROM (
                SELECT 
                    inverter,
                    DATE_FORMAT(timestamp, '%%Y-%%m-%%d') AS t_bucket,
                    AVG(totalActivePower) AS avg_power
                FROM inverter_data
                WHERE timestamp >= NOW() - INTERVAL 30 DAY
                GROUP BY inverter, t_bucket
            ) t
            GROUP BY t_bucket
            ORDER BY t_bucket;
            """

        elif period == "year":
            sql = """
            SELECT 
                t_bucket AS ts,
                SUM(avg_power)/1000.0 AS site_kW
            FROM (
                SELECT 
                    inverter,
                    DATE_FORMAT(timestamp - INTERVAL (WEEKDAY(timestamp)) DAY, '%%Y-%%m-%%d') AS t_bucket,
                    AVG(totalActivePower) AS avg_power
                FROM inverter_data
                WHERE timestamp >= NOW() - INTERVAL 52 WEEK
                GROUP BY inverter, t_bucket
            ) t
            GROUP BY t_bucket
            ORDER BY t_bucket;
            """

        else:
            return (
                jsonify(
                    {
                        "error": "Invalid period. Choose hour, day, 24-hour, week, month, year"
                    }
                ),
                400,
            )

        results = db.query(sql)
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_voltage", methods=["GET"])
def get_voltage():
    sql = """
    SELECT AVG((L1acVoltage+L2acVoltage+L3acVoltage)/3) AS avg_voltage
    FROM inverter_data
    WHERE timestamp >= NOW() - INTERVAL 5 MINUTE;
    """
    return run_db_query(sql)


@app.route("/get_current", methods=["GET"])
def get_current():
    sql = """
        SELECT 
            AVG((L1acCurrent + L2acCurrent + L3acCurrent)/3) AS avg_current
        FROM inverter_data
        WHERE timestamp >= NOW() - INTERVAL 5 MINUTE;
        """
    return run_db_query(sql)


@app.route("/solar_energy_totals", methods=["POST"])
def solar_energy_totals():
    try:
        ssh_tunnel.ensure_tunnel()
        data = request.get_json()
        period = data.get("period", "day").lower()

        if period == "hour":
            sql = "SELECT SUM(totalEnergy) AS total_energy FROM inverter_data WHERE timestamp >= NOW() - INTERVAL 1 HOUR;"
        elif period == "day":
            sql = "SELECT SUM(totalEnergy) AS total_energy FROM inverter_data WHERE timestamp >= CURDATE();"
        elif period == "24-hour":
            sql = "SELECT SUM(totalEnergy) AS total_energy FROM inverter_data WHERE timestamp >= NOW() - INTERVAL 24 HOUR;"
        elif period == "week":
            sql = "SELECT SUM(totalEnergy) AS total_energy FROM inverter_data WHERE timestamp >= NOW() - INTERVAL 7 DAY;"
        elif period == "month":
            sql = "SELECT SUM(totalEnergy) AS total_energy FROM inverter_data WHERE timestamp >= NOW() - INTERVAL 30 DAY;"
        elif period == "year":
            sql = "SELECT SUM(totalEnergy) AS total_energy FROM inverter_data WHERE timestamp >= NOW() - INTERVAL 52 WEEK;"
        else:
            return jsonify({"error": f"Invalid period: {period}"}), 400

        results = db.query(sql)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_weather_temperature", methods=["GET"])
def get_weather_temperature():
    sql = """
        SELECT CS240DM_Temperature AS latest_temperature
        FROM ground_datalogger
        ORDER BY timestamp DESC
        LIMIT 1;
        """
    return run_db_query(sql)


@app.route("/get_humidity", methods=["GET"])
def get_humidity():
    sql = """
            SELECT RH AS humidity
            FROM ground_datalogger
            ORDER BY timestamp DESC
            LIMIT 1;
        """
    return run_db_query(sql)


@app.route("/get_irradiance", methods=["GET"])
def get_irradiance():
    sql = """
        SELECT
            (SR30_Irr + SR30_Irr_2) / 2 AS total_irr,
            (SR05_Irr + SR05_Irr_2 + SR05_Irr_3) / 3 AS diffuse_irr
        FROM ground_datalogger
        ORDER BY timestamp DESC
        LIMIT 1;
        """
    return run_db_query(sql)


@app.route("/get_battery_voltage", methods=["GET"])
def get_battery_voltage():
    sql = """
        SELECT BattV
        FROM rooftop_datalogger
        ORDER BY timestamp DESC
        LIMIT 1;
        """
    return run_db_query(sql)


@app.route("/get_battery_current", methods=["GET"])
@run_safe
def get_battery_current():
    sql = """
        SELECT i.totalActivePower, g.BattV, g.timestamp
        FROM inverter_data i
        JOIN rooftop_datalogger g
        ON i.timestamp = g.timestamp
        ORDER BY g.timestamp DESC
        LIMIT 1;
        """
    results = db.query(sql)

    if not results or not results[0][0] or not results[0][1]:
        return jsonify({"error": "No valid data found"}), 404

    power_w = results[0][0]  # totalActivePower
    batt_v = results[0][1]  # BattV

    battery_current = power_w / batt_v if batt_v else None

    return jsonify(
        {
            round(battery_current, 2) if battery_current else None,
        }
    )


@app.route("/get_battery_percentage", methods=["GET"])
@run_safe
def get_battery_percentage():
    sql = """
        SELECT BattV, timestamp
        FROM rooftop_datalogger
        ORDER BY timestamp DESC
        LIMIT 1;
        """
    results = db.query(sql)

    if not results:
        return jsonify({"error": "No battery voltage data found"}), 404

    batt_v = results[0][0]

    percentage = (
        (batt_v - BATTERY_MIN_VOLTAGE)
        / (BATTERY_MAX_VOLTAGE - BATTERY_MIN_VOLTAGE)
        * 100
    )
    percentage = max(0, min(100, percentage))  # Clamp between 0 and 100

    return jsonify(
        {
            round(percentage, 2),
        }
    )


@app.route("/get_battery_state", methods=["GET"])
@run_safe
def get_battery_state():
    sql = """
        SELECT i.totalActivePower, r.BattV, r.timestamp
        FROM inverter_data i
        JOIN rooftop_datalogger r
        ON i.timestamp = r.timestamp
        ORDER BY r.timestamp DESC
        LIMIT 1;
        """
    results = db.query(sql)

    if not results:
        return jsonify({"error": "No battery data found"}), 404

    power_w = results[0][0]  # totalActivePower
    batt_v = results[0][1]  # BattV

    battery_current = power_w / batt_v if batt_v else 0

    if battery_current > CURRENT_THRESHOLD:
        state = "charging"
    elif battery_current < -CURRENT_THRESHOLD:
        state = "discharging"
    else:
        state = "idle"

    return jsonify(
        {
            state,
        }
    )


@app.route("/battery_percentage_timeseries", methods=["POST"])
def battery_percentage_timeseries():
    try:
        ssh_tunnel.ensure_tunnel()
        period = request.json.get("period", "day").lower()

        now = datetime.now()
        if period == "hour":
            start_time = now - timedelta(hours=1)
            group_by = "DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i')"  # 5-min intervals
        elif period == "day":
            start_time = now.replace(hour=0, minute=0, second=0, microsecond=0)
            group_by = "HOUR(timestamp)"
        elif period == "24-hour":
            start_time = now - timedelta(hours=24)
            group_by = "HOUR(timestamp)"
        elif period == "week":
            start_time = now - timedelta(days=7)
            group_by = "FLOOR(UNIX_TIMESTAMP(timestamp) / 21600)"  # 6-hour intervals
        elif period == "month":
            start_time = now - timedelta(days=30)
            group_by = "DATE(timestamp)"  # daily
        elif period == "year":
            start_time = now - timedelta(days=365)
            group_by = "WEEK(timestamp)"  # weekly
        else:
            return jsonify({"error": "Invalid period"}), 400

        sql = f"""
            SELECT
                {group_by} AS time_group,
                ROUND(
                    100 * (AVG(BattV) - %s) / (%s - %s),
                    1
                ) AS battery_percentage
            FROM rooftop_datalogger
            WHERE timestamp >= %s
            GROUP BY time_group
            ORDER BY time_group ASC;
        """

        results = db.query(
            sql,
            (CURRENT_THRESHOLD, BATTERY_MAX_VOLTAGE, BATTERY_MIN_VOLTAGE, start_time),
        )
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def compute_load(irr1, irr2, temp_c):
    # Compute synthetic load in kW from irradiance and temperature
    if irr1 is None and irr2 is None:
        irr_avg = 0
    else:
        irr_vals = [v for v in [irr1, irr2] if v is not None]
        irr_avg = sum(irr_vals) / len(irr_vals)

    irr_norm = max(0, min(1, irr_avg / 1000.0))

    L_day = DAYLIGHT_FACTOR * irr_norm

    L_cool = COOLING_ALPHA * max(0, temp_c - COOLING_THRESHOLD)
    L_heat = HEATING_ALPHA * max(0, HEATING_THRESHOLD - temp_c)

    return max(0, BASELINE_KW + L_day + L_cool + L_heat)


@app.route("/current_load", methods=["GET"])
@run_safe
def get_current_load():
    sql = """
        SELECT SR30_Irr, SR30_Irr_2, PTemp_C
        FROM ground_datalogger
        ORDER BY timestamp DESC
        LIMIT 1;
        """
    rows = db.query(sql)
    if not rows:
        return jsonify({"error": "No data"}), 404

    irr1, irr2, temp = rows[0]  # tuple indexing
    load_kw = compute_load(irr1, irr2, temp)
    return jsonify(load_kw)


@app.route("/total_load_today", methods=["GET"])
@run_safe
def get_total_load_today():
    midnight = datetime.now().replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    sql = """
        SELECT timestamp, SR30_Irr, SR30_Irr_2, PTemp_C
        FROM rooftop_datalogger
        WHERE timestamp >= %s
        ORDER BY timestamp ASC;
        """
    rows = db.query(sql, (midnight,))
    if not rows:
        return jsonify({"error": "No data"}), 404

    total_kwh = 0.0
    for i in range(1, len(rows)):
        t1, irr1a, irr2a, temp1 = rows[i - 1]
        t2, irr1b, irr2b, temp2 = rows[i]

        load1 = compute_load(irr1a, irr2a, temp1)
        load2 = compute_load(irr1b, irr2b, temp2)

        delta_h = (t2 - t1).total_seconds() / 3600.0
        total_kwh += 0.5 * (load1 + load2) * delta_h

    return jsonify(total_kwh)


@app.route("/peak_load_today", methods=["GET"])
@run_safe
def get_peak_load_today():
    midnight = datetime.now().replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    sql = """
        SELECT SR30_Irr, SR30_Irr_2, PTemp_C
        FROM rooftop_datalogger
        WHERE timestamp >= %s
        ORDER BY timestamp ASC;
        """
    rows = db.query(sql, (midnight,))
    if not rows:
        return jsonify({"error": "No data"}), 404

    max_kw = 0.0
    for irr1, irr2, temp in rows:
        load_kw = compute_load(irr1, irr2, temp)
        max_kw = max(max_kw, load_kw)

    return jsonify(max_kw)


@app.route("/grid_self_consumption", methods=["POST"])
def grid_self_consumption():
    try:
        ssh_tunnel.ensure_tunnel()
        data = request.get_json() or {}
        period = data.get("period", "day")

        if period == "hour":
            interval_sec = 5 * 60
            start_time = "NOW() - INTERVAL 1 HOUR"
        elif period == "day":
            interval_sec = 60 * 60
            start_time = "CURDATE()"
        elif period == "24-hour":
            interval_sec = 60 * 60
            start_time = "NOW() - INTERVAL 24 HOUR"
        elif period == "week":
            interval_sec = 6 * 3600
            start_time = "NOW() - INTERVAL 7 DAY"
        elif period == "month":
            interval_sec = 24 * 3600
            start_time = "NOW() - INTERVAL 30 DAY"
        elif period == "year":
            interval_sec = 7 * 24 * 3600
            start_time = "NOW() - INTERVAL 1 YEAR"
        else:
            return jsonify({"error": "Invalid period"}), 400

        sql = f"""
        SELECT 
            MIN(timestamp) AS ts,
            LEAST(SUM(totalActivePower) / (SUM(totalActivePower) * 1.2) * 100, 100) AS self_consumption_percent
        FROM inverter_data
        WHERE timestamp >= {start_time}
        GROUP BY FLOOR(UNIX_TIMESTAMP(timestamp) / {interval_sec})
        ORDER BY ts ASC;
        """

        results = db.query(sql)
        output = []
        for r in results:
            ts, val = r[0], r[1]
            if val is not None:
                #
                val = max(0, min(100, val * random.uniform(0.95, 1.05)))
            else:
                val = 0
            output.append([ts, val])
        return jsonify(output)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/grid_status", methods=["POST"])
def grid_status():
    try:
        data = request.get_json() or {}
        period = data.get("period", "hour")
        ssh_tunnel.ensure_tunnel()
        now = datetime.utcnow()

        if period == "hour":
            start_time = now - timedelta(hours=1)
            interval_seconds = 5 * 60
        elif period == "day":
            start_time = datetime(now.year, now.month, now.day)
            interval_seconds = 60 * 60
        elif period == "24-hour":
            start_time = now - timedelta(hours=24)
            interval_seconds = 60 * 60
        elif period == "week":
            start_time = now - timedelta(days=7)
            interval_seconds = 6 * 60 * 60
        elif period == "month":
            start_time = now - timedelta(days=30)
            interval_seconds = 24 * 60 * 60
        elif period == "year":
            start_time = now - timedelta(days=365)
            interval_seconds = 7 * 24 * 60 * 60
        else:
            return jsonify({"error": "Invalid period"}), 400

        sql = f"""
            SELECT
                MIN(timestamp) AS ts,
                SUM(totalActivePower) AS solar_power
            FROM inverter_data
            WHERE timestamp >= %s
            GROUP BY FLOOR(UNIX_TIMESTAMP(timestamp)/{interval_seconds})
            ORDER BY ts;
        """
        results = db.query(sql, (start_time,))

        response = []
        for r in results:
            ts = r[0].isoformat()
            solar = float(r[1] or 0)
            load = solar * (1 + random.uniform(0.1, 0.3))
            grid_usage = max(load - solar, 0)
            response.append([ts, grid_usage])

        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/solar_energy_usage", methods=["POST"])
def solar_energy_usage():
    try:
        data = request.get_json() or {}
        period = data.get("period", "hour")
        ssh_tunnel.ensure_tunnel()
        now = datetime.utcnow()

        if period == "hour":
            start_time = now - timedelta(hours=1)
            interval_seconds = 5 * 60
        elif period == "day":
            start_time = datetime(now.year, now.month, now.day)
            interval_seconds = 60 * 60
        elif period == "24-hour":
            start_time = now - timedelta(hours=24)
            interval_seconds = 60 * 60
        elif period == "week":
            start_time = now - timedelta(days=7)
            interval_seconds = 6 * 60 * 60
        elif period == "month":
            start_time = now - timedelta(days=30)
            interval_seconds = 24 * 60 * 60
        elif period == "year":
            start_time = now - timedelta(days=365)
            interval_seconds = 7 * 24 * 60 * 60
        else:
            return jsonify({"error": "Invalid period"}), 400

        sql = f"""
            SELECT
                MIN(timestamp) AS ts,
                SUM(totalActivePower) * {interval_seconds / 3600.0} AS energy_kwh
            FROM inverter_data
            WHERE timestamp >= %s
            GROUP BY FLOOR(UNIX_TIMESTAMP(timestamp)/{interval_seconds})
            ORDER BY ts;
        """
        results = db.query(sql, (start_time,))

        response = []
        for r in results:
            ts = r[0].isoformat()
            energy = float(r[1] or 0)
            energy *= random.uniform(0.95, 1.05)
            response.append([ts, energy])

        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/solar_energy_total", methods=["POST"])
def solar_energy_total():
    try:
        data = request.get_json() or {}
        period = data.get("period", "day")
        ssh_tunnel.ensure_tunnel()
        now = datetime.utcnow()  # <- fixed here

        if period == "hour":
            start_time = now - datetime.timedelta(hours=1)
        elif period == "day":
            start_time = datetime(now.year, now.month, now.day)
        elif period == "24-hour":
            start_time = now - datetime.timedelta(hours=24)
        elif period == "week":
            start_time = now - datetime.timedelta(days=7)
        elif period == "month":
            start_time = now - datetime.timedelta(days=30)
        elif period == "year":
            start_time = now - datetime.timedelta(days=365)
        else:
            return jsonify({"error": "Invalid period"}), 400

        sql = """
            SELECT SUM(totalActivePower) * 1/3600 AS total_energy_kwh
            FROM inverter_data
            WHERE timestamp >= %s
        """
        result = db.query(sql, (start_time,))
        total_energy = float(result[0][0] or 0)

        # add small random variation
        total_energy *= random.uniform(0.95, 1.05)

        return jsonify(total_energy)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def health():
    ssh_tunnel.ensure_tunnel()
    return jsonify({"status": "ok"})


@atexit.register
def shutdown():
    db.close()
    ssh_tunnel.stop()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
