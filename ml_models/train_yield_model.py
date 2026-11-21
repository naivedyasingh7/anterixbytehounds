"""
AgriVerify AI - Crop Yield ML Regressor Training Script
Demonstrates model training using agro-climatic indices & Sentinel-2 NDVI peak values.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

def train_model():
    print("Loading crop yield dataset for Central India (MP)...")
    df = pd.read_csv("sample_data/mp_crop_yield_data.csv")

    features = ["peak_ndvi", "rainfall_mm", "consecutive_dry_days", "mean_temp_c", "soil_moisture_index"]
    target = "yield_kg_ha"

    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    r2 = r2_score(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))

    print(f"Model Training Complete!")
    print(f"R² Score: {r2:.4f}")
    print(f"RMSE: {rmse:.2f} kg/ha")

    # Feature Importance
    importances = dict(zip(features, model.feature_importances_))
    print("Feature Importances:", importances)

if __name__ == "__main__":
    train_model()
