from flask import Flask, request, jsonify
import atexit
from ssh_tunnel import SSHTunnelManager
from database import Database

# ====== Config ======
SSH_CONFIG = {
    "ssh_host": "isapc7.york.ac.uk",
    "ssh_port": 22,
    "ssh_user": "davebradley",
    "ssh_password": "ISAPC72024",
    "remote_bind_host": "172.17.0.2",
    "remote_bind_port": 3306
}

DB_CONFIG = {
    "user": "solardb",
    "password": "solardb",
    "name": "solar_db"
}

# ====== Setup ======
ssh_tunnel = SSHTunnelManager(**SSH_CONFIG)
ssh_tunnel.start()

db = Database(
    host="127.0.0.1",
    port=ssh_tunnel.local_bind_port,
    user=DB_CONFIG["user"],
    password=DB_CONFIG["password"],
    name=DB_CONFIG["name"]
)

app = Flask(__name__)

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
        sql = """WITH latest AS (
                    SELECT
                    inverter,
                    totalActivePower,
                    timestamp,
                    ROW_NUMBER() OVER (PARTITION BY inverter ORDER BY timestamp DESC) AS rn
                    FROM inverter_data
                )
                SELECT
                    SUM(totalActivePower) / 1000.0 AS site_kW  -- drop "/ 1000.0" if your field is already kW
                FROM latest
                WHERE rn = 1;
                """
        results = db.query(sql)
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

