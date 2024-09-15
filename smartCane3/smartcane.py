from flask import Flask, request, jsonify
import logging
app = Flask(__name__)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

@app.route('/', methods=['GET'])
def handle_request():
    fell = request.args.get('fell', 'false') == 'true'
    print("FALL DETECTED, CALL EMERGENCY SERVICES!")
    return jsonify({'fell_value': fell})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
    