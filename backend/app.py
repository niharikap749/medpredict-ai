from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib

# Load trained model and encoder
model = joblib.load("../model/disease_model.pkl")
encoder = joblib.load("../model/label_encoder.pkl")

# Load training columns
training_data = pd.read_csv("../dataset/Training.csv")

# Remove useless column
training_data = training_data.drop(columns=["Unnamed: 133"], errors="ignore")

# Get symptom columns
symptom_columns = training_data.drop("prognosis", axis=1).columns

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class Symptoms(BaseModel):
    symptoms: list[str]

@app.get("/")
def home():
    return {"message": "MedPredict AI Backend Running"}

@app.get("/symptoms")
def get_symptoms():
    return {
        "symptoms": list(symptom_columns)
    }

@app.post("/predict")
def predict(data: Symptoms):

    # Create symptom vector
    input_dict = {symptom: 0 for symptom in symptom_columns}

    for symptom in data.symptoms:
        if symptom in input_dict:
            input_dict[symptom] = 1

    # Convert to DataFrame
    input_data = pd.DataFrame([input_dict])

    # Predict probabilities
    probabilities = model.predict_proba(input_data)[0]

    # Get top 3 predictions
    top_indices = probabilities.argsort()[-3:][::-1]

    results = []

    for index in top_indices:

        disease = encoder.inverse_transform([index])[0]

        confidence = round(probabilities[index] * 100, 2)

        results.append({
            "disease": disease,
            "confidence": f"{confidence}%"
        })

    return {
        "predictions": results
    }