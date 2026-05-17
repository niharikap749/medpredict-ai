import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
data = pd.read_csv("../dataset/Training.csv")

# Remove useless column
data = data.drop(columns=["Unnamed: 133"], errors="ignore")

# Features and target
X = data.drop("prognosis", axis=1)
y = data["prognosis"]

# Encode disease labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Save encoder
joblib.dump(encoder, "../model/label_encoder.pkl")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)

# Random Forest Model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

# Train model
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)

print(f"\nAccuracy: {accuracy * 100:.2f}%")

# Save model
joblib.dump(model, "../model/disease_model.pkl")

print("\nModel saved successfully!")