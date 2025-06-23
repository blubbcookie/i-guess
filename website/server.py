from flask import Flask, request, jsonify, send_from_directory
import subprocess

app = Flask(__name__, static_folder="static")

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/run", methods=["POST"])
def run_script():
    script = request.json.get("script")
    # Sicherheit: nur bestimmte Skripte erlauben
    erlaubte_skripte = ["dein_script.py"]
    if script not in erlaubte_skripte:
        return jsonify({"error": "Script nicht erlaubt"}), 403
    try:
        result = subprocess.run(["python3", script], capture_output=True, text=True, check=True)
        return jsonify({"output": result.stdout})
    except subprocess.CalledProcessError as e:
        return jsonify({"error": e.stderr}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
