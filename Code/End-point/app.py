# -*- coding: utf-8 -*-
"""
Created on Thu Mar  4 22:37:16 2021

@author: 1999b
"""

import numpy as np
from flask import Flask, request , jsonify , make_response
from flask_cors import CORS, cross_origin
import pickle , json

app = Flask(__name__)
CORS(app)
model = pickle.load(open("models.pkl", "rb"))
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
@cross_origin()
def home():
    return "Hello ML"

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    bd = request.get_json()
    prediction = model.predict(np.array(bd['data']))
    print(prediction)
    output = prediction
    lst = output.tolist()
    response = make_response(
        jsonify({"message": json.dumps(lst),})
        ,200,)
    response.headers["Content-Type"] = "application/json"
    return response
    
    
if __name__ == "__main__":
    app.run(debug=True)