from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['POST'])
def autograder():
    #data = request.json
    #print(data)
    print("Hi")
    tests = []
    return "Hello"

@app.route('/Search_Fetch/<course>', methods=['GET'])
def search_ratings(course):
    print(course)
    return jsonify('Test')

if __name__ == '__main__':
    app.run(debug=True)