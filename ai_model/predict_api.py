import sys
import json
import joblib
import pandas as pd
import os
import base64

# Set paths relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BEST_MODEL_PATH = os.path.join(BASE_DIR, "best_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "price_scaler.pkl")
DATASET_PATH = os.path.join(BASE_DIR, "nepal_used_phones.csv")

def get_new_price(brand, model_name):
    try:
        df = pd.read_csv(DATASET_PATH)
        # Try to find exact model match
        exact_match = df[(df["device_brand"].str.lower() == brand.lower()) & (df["model"].str.lower() == model_name.lower())]
        if not exact_match.empty:
            return int(exact_match["new_price_npr"].mode().iloc[0])
        
        # Fallback to brand average if model not found
        brand_match = df[df["device_brand"].str.lower() == brand.lower()]
        if not brand_match.empty:
            return int(brand_match["new_price_npr"].mean())
        
        # Absolute fallback if brand not in dataset
        return 50000 
    except Exception:
        return 50000

def main():
    try:
        # Read JSON input from command line argument
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            sys.exit(1)
            
        if sys.argv[1] == "--b64":
            json_str = base64.b64decode(sys.argv[2]).decode("utf-8")
            input_data = json.loads(json_str)
        else:
            input_data = json.loads(sys.argv[1])
        
        # Extract features
        brand = input_data.get("brand", "Samsung")
        model_name = input_data.get("phoneModel", "Galaxy S23")
        ram_str = input_data.get("ram", "8GB").replace("GB", "")
        storage_str = input_data.get("storage", "128GB").replace("GB", "")
        
        ram = int(ram_str)
        internal_memory = int(storage_str)
        days_used = int(input_data.get("daysUsed", 365))
        battery_health = float(input_data.get("batteryHealth", 100)) / 100.0
        
        # Convert screen condition string to 0 or 1
        condition_str = input_data.get("screenCondition", "Perfect")
        screen_condition = 1 if condition_str == "Perfect" else 0
        
        # Get new price
        new_price_npr = get_new_price(brand, model_name)
        
        # Build features dict for DataFrame
        features = {
            "device_brand": brand,
            "model": model_name,
            "ram": ram,
            "internal_memory": internal_memory,
            "days_used": days_used,
            "battery_health": battery_health,
            "screen_condition": screen_condition,
            "new_price_npr": new_price_npr,
        }
        
        input_df = pd.DataFrame([features])
        
        # Load model and predict
        model = joblib.load(BEST_MODEL_PATH)
        predicted_price = model.predict(input_df)[0]
        
        # Ensure non-negative and round to nearest 500
        predicted_price = max(predicted_price, 2000)
        predicted_price = round(predicted_price / 500) * 500
        
        # Print JSON response
        print(json.dumps({"price": predicted_price}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
