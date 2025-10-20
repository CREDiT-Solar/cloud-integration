import flask

app = flask.Flask(__name__)

@app.route('/test', methods=['GET'])
def test_endpoint():
    return flask.jsonify({"message": "This is a test endpoint"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)