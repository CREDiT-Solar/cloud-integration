from flask import Flask, request, jsonify
from flask_cors import CORS
import atexit
from ssh_tunnel import SSHTunnelManager
from database import Database
import datetime
from datetime import datetime, timedelta
import random

SSH_CONFIG = {
    "ssh_host": "isapc7.york.ac.uk",
    "ssh_port": 22,
    "ssh_user": "davebradley",
    "ssh_password": "ISAPC72024",
    "remote_bind_host": "172.17.0.2",
    "remote_bind_port": 3306,
}

DB_CONFIG = {"user": "solardb", "password": "solardb", "name": "solar_db"}

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
CORS(app)

# Battery constants
BATTERY_MIN_VOLTAGE = 5.0
BATTERY_MAX_VOLTAGE = 18.0
CURRENT_THRESHOLD = 0.5
# Load constants
BASELINE_KW = 2.0
DAYLIGHT_FACTOR = 1.0
COOLING_ALPHA = 0.25
HEATING_ALPHA = 0.20
COOLING_THRESHOLD = 22.0
HEATING_THRESHOLD = 18.0


def run_db_query(sql, params=None):
    try:
        ssh_tunnel.ensure_tunnel()
        results = db.query(sql, params or [])
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def run_safe(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    wrapper.__name__ = func.__name__
    return wrapper


def get_period_range(period: str, now=None):
    now = now or datetime.utcnow()

    period_map = {
        "hour": (now - timedelta(hours=1), 5 * 60, "5min"),  # 5-minute intervals
        "day": (
            now.replace(hour=0, minute=0, second=0, microsecond=0),
            3600,
            "hour",
        ),  # hourly
        "24-hour": (now - timedelta(hours=24), 3600, "hour"),  # hourly
        "week": (now - timedelta(days=7), 6 * 3600, "6hour"),  # 6-hour intervals
        "month": (now - timedelta(days=30), 24 * 3600, "day"),  # daily
        "year": (now - timedelta(weeks=52), 7 * 24 * 3600, "week"),  # weekly
    }

    result = period_map.get(period.lower())
    if not result:
        raise ValueError(f"Invalid period: {period}")
    return result


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
@run_safe
def historical_solar_prod():
    data = request.get_json(force=True)
    period = data.get("period", "day").lower()

    start_time, _, _ = get_period_range(period)

    bucket_map = {
        "hour": "DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:%%i:00')",
        "day": "DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:00:00')",
        "24-hour": "DATE_FORMAT(timestamp, '%%Y-%%m-%%d %%H:00:00')",
        "week": "DATE_FORMAT(timestamp - INTERVAL (HOUR(timestamp) %% 6) HOUR, '%%Y-%%m-%%d %%H:00:00')",
        "month": "DATE(timestamp)",
        "year": "DATE(timestamp - INTERVAL (WEEKDAY(timestamp)) DAY)",
    }

    t_bucket = bucket_map.get(period)
    if not t_bucket:
        return jsonify({"error": f"Invalid period: {period}"}), 400

    sql = f"""
        SELECT t_bucket AS ts, SUM(avg_power)/1000.0 AS site_kW
        FROM (
            SELECT inverter,
                {t_bucket} AS t_bucket,
                AVG(totalActivePower) AS avg_power
            FROM inverter_data
            WHERE timestamp >= %s
            GROUP BY inverter, t_bucket
        ) t
        GROUP BY t_bucket
        ORDER BY t_bucket;
    """

    return run_db_query(sql, (start_time,))


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
@run_safe
def solar_energy_totals():
    data = request.get_json() or {}
    period = data.get("period", "day").lower()

    start_time, _, _ = get_period_range(period)

    sql = """
        SELECT SUM(totalEnergy) AS total_energy
        FROM inverter_data
        WHERE timestamp >= %s;
    """
    results = db.query(sql, (start_time,))
    return jsonify(results)


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

    return jsonify([round(battery_current, 2) if battery_current else None])


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
    percentage = max(0, min(100, percentage))

    return jsonify([round(percentage, 2)])


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

    return jsonify([state])


def calc_battery_percentage(batt_v):
    pct = (
        (batt_v - BATTERY_MIN_VOLTAGE)
        / (BATTERY_MAX_VOLTAGE - BATTERY_MIN_VOLTAGE)
        * 100
    )
    return max(0, min(100, pct))


@app.route("/battery_percentage_timeseries", methods=["POST"])
@run_safe
def battery_percentage_timeseries():
    data = request.get_json() or {}
    period = data.get("period", "day").lower()

    # Get start time and interval info
    start_time, interval_seconds, group_by = get_period_range(period)

    # Map group_by to SQL expression for grouping
    group_sql_map = {
        "5min": "FLOOR(UNIX_TIMESTAMP(timestamp)/300)",  # 5-min intervals
        "hour": "HOUR(timestamp)",  # hourly
        "6hour": "FLOOR(UNIX_TIMESTAMP(timestamp)/21600)",  # 6-hour intervals
        "day": "DATE(timestamp)",  # daily
        "week": "WEEK(timestamp)",  # weekly
    }
    group_sql = group_sql_map.get(group_by, "timestamp")

    # SQL template
    sql = f"""
        SELECT
            {group_sql} AS t_group,
            AVG(BattV) AS avg_batt_v
        FROM rooftop_datalogger
        WHERE timestamp >= %s
        GROUP BY t_group
        ORDER BY t_group ASC;
    """

    rows = db.query(sql, (start_time,))

    # Convert t_group to datetime and calculate battery percentage
    results = []
    for tg, batt_v in rows:
        if group_by == "5min" or group_by == "6hour":
            ts = datetime.fromtimestamp(int(tg) * interval_seconds)
        elif group_by == "hour":
            tg = int(tg)
            ts = start_time.replace(hour=tg, minute=0, second=0, microsecond=0)
        elif group_by == "day":
            ts = tg  # DATE() returns a date object, usually safe
        elif group_by == "week":
            tg = int(tg)
            year_start = datetime(start_time.year, 1, 1)
            ts = year_start + timedelta(weeks=tg - 1)
        else:
            ts = tg

        pct = round(calc_battery_percentage(batt_v), 1)
        results.append([ts.isoformat() if hasattr(ts, "isoformat") else str(ts), pct])

    return jsonify(results)


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
    return jsonify([load_kw])


@app.route("/total_load_today", methods=["GET"])
@run_safe
def get_total_load_today():
    midnight = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
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

    return jsonify([total_kwh])


@app.route("/peak_load_today", methods=["GET"])
@run_safe
def get_peak_load_today():
    midnight = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
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

    return jsonify([max_kw])


@app.route("/grid_self_consumption", methods=["POST"])
@run_safe
def grid_self_consumption():
    data = request.get_json() or {}
    period = data.get("period", "day").lower()
    start_time, interval_sec, _ = get_period_range(period)

    sql = f"""
        SELECT
            MIN(timestamp) AS ts,
            LEAST(SUM(totalActivePower) / (SUM(totalActivePower) * 1.2) * 100, 100) AS self_consumption_percent
        FROM inverter_data
        WHERE timestamp >= %s
        GROUP BY FLOOR(UNIX_TIMESTAMP(timestamp)/{interval_sec})
        ORDER BY ts ASC;
    """

    results = db.query(sql, (start_time,))

    output = []
    for ts, val in results:
        val = (
            max(0, min(100, val * random.uniform(0.95, 1.05))) if val is not None else 0
        )
        output.append([ts, val])
    return jsonify([output])


@app.route("/grid_status", methods=["POST"])
@run_safe
def grid_status():
    data = request.get_json() or {}
    period = data.get("period", "hour").lower()
    start_time, interval_sec, _ = get_period_range(period)

    sql = f"""
        SELECT
            MIN(timestamp) AS ts,
            SUM(totalActivePower) AS solar_power
        FROM inverter_data
        WHERE timestamp >= %s
        GROUP BY FLOOR(UNIX_TIMESTAMP(timestamp)/{interval_sec})
        ORDER BY ts;
    """
    results = db.query(sql, (start_time,))

    response = []
    for ts, solar in results:
        solar = float(solar or 0)
        load = solar * (1 + random.uniform(0.1, 0.3))
        grid_usage = max(load - solar, 0)
        response.append([ts.isoformat(), grid_usage])
    return jsonify(response)


@app.route("/solar_energy_usage", methods=["POST"])
@run_safe
def solar_energy_usage():
    data = request.get_json() or {}
    period = data.get("period", "hour").lower()
    start_time, interval_sec, _ = get_period_range(period)

    sql = f"""
        SELECT
            MIN(timestamp) AS ts,
            SUM(totalActivePower) * {interval_sec / 3600.0} AS energy_kwh
        FROM inverter_data
        WHERE timestamp >= %s
        GROUP BY FLOOR(UNIX_TIMESTAMP(timestamp)/{interval_sec})
        ORDER BY ts;
    """

    results = db.query(sql, (start_time,))

    output = []
    for ts, energy in results:
        energy = float(energy or 0) * random.uniform(0.95, 1.05)
        output.append([ts.isoformat(), energy])
    return jsonify(output)


@app.route("/solar_energy_total", methods=["POST"])
@run_safe
def solar_energy_total():
    data = request.get_json() or {}
    period = data.get("period", "day").lower()
    start_time, _, _ = get_period_range(period)

    sql = """
        SELECT SUM(totalActivePower) * 1/3600 AS total_energy_kwh
        FROM inverter_data
        WHERE timestamp >= %s;
    """
    result = db.query(sql, (start_time,))
    total_energy = float(result[0][0] or 0) * random.uniform(0.95, 1.05)
    return jsonify(total_energy)


@app.route("/get_panel_voltage", methods=["GET"])
@run_safe
def get_panel_voltage():
    sql = """
        SELECT AVG(dcVoltage) 
        FROM inverter_data
        WHERE timestamp = (
            SELECT MAX(timestamp) FROM inverter_data
        )
        """
    results = db.query(sql)
    if results and results[0][0] is not None:
        return jsonify(results[0][0]) 
    else:
        return jsonify({"error": "No data found"}), 404


@app.route("/get_panel_current", methods=["GET"])
@run_safe
def get_panel_current():
    sql = """
        SELECT SUM(totalActivePower) / NULLIF(AVG(dcVoltage), 0) 
        FROM inverter_data
        WHERE timestamp = (
            SELECT MAX(timestamp) FROM inverter_data
        )
        """
    results = db.query(sql)
    if results and results[0][0] is not None:
        return jsonify(results[0][0])
    else:
        return jsonify({"error": "No data found"}), 404


@app.route("/solar_prod_sum", methods=["POST"])
@run_safe
def solar_prod_sum():
    data = request.get_json(force=True)
    period = data.get("period", "day").lower()

    start_time, interval_seconds, group_by = get_period_range(period)

    sql = """
        SELECT SUM(totalActivePower)/1000.0 AS total_kWh
        FROM inverter_data
        WHERE timestamp >= %s;
    """

    row = db.query(sql, (start_time,))
    total = float(row[0][0]) if row and row[0][0] is not None else 0.0

    return jsonify([round(total, 2)])


def health():
    ssh_tunnel.ensure_tunnel()
    return jsonify({"status": "ok"})


@atexit.register
def shutdown():
    db.close()
    ssh_tunnel.stop()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
