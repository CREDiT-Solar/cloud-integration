from flask import Flask, request, jsonify
import atexit
from ssh_tunnel import SSHTunnelManager
from database import Database
import datetime
from datetime import timedelta

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

BATTERY_MIN_VOLTAGE = 5.0
BATTERY_MAX_VOLTAGE = 18.0
CURRENT_THRESHOLD   = 0.5

@app.route("/query", methods=["POST"])
def run_query():
    data = request.json
    sql = data.get("query")
    params = data.get("params", [])

    if not sql:
        return jsonify({"error": "No SQL query provided"}), 400

    try:
        ssh_tunnel.ensure_tunnel()
        results = db.query(sql, params)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/current_solar_prod", methods=["GET"])
def run_current_solar_prod():
    try:
        ssh_tunnel.ensure_tunnel()
        sql = """SELECT 
    SUM(avg_power) / 1000.0 AS site_kW_5min_avg
FROM (
    SELECT 
        inverter,
        AVG(totalActivePower) AS avg_power
    FROM inverter_data
    WHERE timestamp >= NOW() - INTERVAL 5 MINUTE
    GROUP BY inverter
) t;
                """
        results = db.query(sql)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
    try:
        ssh_tunnel.ensure_tunnel()
        sql = """
        SELECT 
            AVG((L1acVoltage + L2acVoltage + L3acVoltage)/3) AS avg_voltage
        FROM inverter_data
        WHERE timestamp >= NOW() - INTERVAL 5 MINUTE;
        """
        results = db.query(sql)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_current", methods=["GET"])
def get_current():
    try:
        ssh_tunnel.ensure_tunnel()
        sql = """
        SELECT 
            AVG((L1acCurrent + L2acCurrent + L3acCurrent)/3) AS avg_current
        FROM inverter_data
        WHERE timestamp >= NOW() - INTERVAL 5 MINUTE;
        """
        results = db.query(sql)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
    try:
        ssh_tunnel.ensure_tunnel()
        sql = """
        SELECT CS240DM_Temperature AS latest_temperature
        FROM ground_datalogger
        ORDER BY timestamp DESC
        LIMIT 1;
        """
        results = db.query(sql)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_humidity", methods=["GET"])
def get_humidity():
    try:
        ssh_tunnel.ensure_tunnel()
        sql = """
            SELECT RH AS humidity
            FROM ground_datalogger
            ORDER BY timestamp DESC
            LIMIT 1;
        """
        results = db.query(sql)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_irradiance", methods=["GET"])
def get_irradiance():
    try:
        ssh_tunnel.ensure_tunnel()
        sql = """
        SELECT
            (SR30_Irr + SR30_Irr_2) / 2 AS total_irr,
            (SR05_Irr + SR05_Irr_2 + SR05_Irr_3) / 3 AS diffuse_irr
        FROM ground_datalogger
        ORDER BY timestamp DESC
        LIMIT 1;
        """
        results = db.query(sql)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_battery_voltage", methods=["GET"])
def get_battery_voltage():
    try:
        ssh_tunnel.ensure_tunnel()
        sql = """
        SELECT BattV
        FROM rooftop_datalogger
        ORDER BY timestamp DESC
        LIMIT 1;
        """
        results = db.query(sql)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_battery_current", methods=["GET"])
def get_battery_current():
    try:
        ssh_tunnel.ensure_tunnel()
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

        power_w = results[0][0]   # totalActivePower
        batt_v = results[0][1]    # BattV

        battery_current = power_w / batt_v if batt_v else None

        return jsonify({
            "battery_current": round(battery_current, 2) if battery_current else None,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/get_battery_percentage", methods=["GET"])
def get_battery_percentage():
    try:
        ssh_tunnel.ensure_tunnel()
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

        percentage = (batt_v - BATTERY_MIN_VOLTAGE) / (BATTERY_MAX_VOLTAGE - BATTERY_MIN_VOLTAGE) * 100
        percentage = max(0, min(100, percentage))  # Clamp between 0 and 100

        return jsonify({
            "battery_percentage": round(percentage, 2),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_battery_state", methods=["GET"])
def get_battery_state():
    try:
        ssh_tunnel.ensure_tunnel()
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

        power_w = results[0][0]   # totalActivePower
        batt_v = results[0][1]    # BattV

        battery_current = power_w / batt_v if batt_v else 0

        if battery_current > CURRENT_THRESHOLD:
            state = "charging"
        elif battery_current < -CURRENT_THRESHOLD:
            state = "discharging"
        else:
            state = "idle"

        return jsonify({
            "battery_state": state,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/battery_percentage", methods=["POST"])
def battery_percentage():
    try:
        ssh_tunnel.ensure_tunnel()
        period = request.json.get("period", "day").lower()

        now = datetime.datetime.now()
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

        results = db.query(sql, (CURRENT_THRESHOLD, BATTERY_MAX_VOLTAGE, BATTERY_MIN_VOLTAGE, start_time))
        return jsonify(results)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health")
def health():
    ssh_tunnel.ensure_tunnel()
    return jsonify({"status": "ok"})


@atexit.register
def shutdown():
    db.close()
    ssh_tunnel.stop()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
