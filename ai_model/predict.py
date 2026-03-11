"""
Predict Used Mobile Phone Price in Nepal (NPR).
Interactive CLI that uses the best trained model from train_model.py.
"""

import joblib
import pandas as pd
import sys

BEST_MODEL_PATH = "best_model.pkl"
SCALER_PATH = "price_scaler.pkl"
DATASET_PATH = "nepal_used_phones.csv"

# Hardware options
RAM_OPTIONS = [3, 4, 6, 8, 12, 16]
STORAGE_OPTIONS = [64, 128, 256, 512]


def load_brand_model_mapping():
    """Load brand → model mapping with new prices from the dataset."""
    df = pd.read_csv(DATASET_PATH)

    mapping = {}
    for brand in sorted(df["device_brand"].unique()):
        brand_df = df[df["device_brand"] == brand]
        models_info = {}
        for model in sorted(brand_df["model"].unique()):
            model_df = brand_df[brand_df["model"] == model]
            models_info[model] = {
                "new_price": int(model_df["new_price_npr"].mode().iloc[0]),
                "ram": int(model_df["ram"].mode().iloc[0]),
                "storage": int(model_df["internal_memory"].mode().iloc[0]),
            }
        mapping[brand.lower()] = {
            "original_name": brand,
            "models": models_info,
        }
    return mapping


def display_header():
    print("\n" + "=" * 55)
    print("  📱 Nepal Used Mobile Phone Price Predictor")
    print("  💰 Prices in Nepalese Rupees (NPR)")
    print("=" * 55)


def select_brand(mapping):
    print("\n📋 Available Brands:")
    brands = [v["original_name"] for v in mapping.values()]
    for i, brand in enumerate(brands, 1):
        print(f"   {i}. {brand}")

    while True:
        choice = input("\n👉 Select Brand (name or number): ").strip()

        # Try number selection
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(brands):
                key = brands[idx].lower()
                return mapping[key]
        except ValueError:
            pass

        # Try name selection
        if choice.lower() in mapping:
            return mapping[choice.lower()]

        print("❌ Invalid choice. Please try again.")


def select_model(brand_data):
    models_info = brand_data["models"]
    model_names = list(models_info.keys())

    print(f"\n📋 Available Models ({brand_data['original_name']}):")
    for i, (name, info) in enumerate(models_info.items(), 1):
        print(f"   {i}. {name} — NPR {info['new_price']:,} (new)")

    while True:
        choice = input("\n👉 Select Model (name or number): ").strip()

        # Try number selection
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(model_names):
                selected = model_names[idx]
                return selected, models_info[selected]
        except ValueError:
            pass

        # Try name selection (case-insensitive)
        lookup = {m.lower(): m for m in model_names}
        if choice.lower() in lookup:
            selected = lookup[choice.lower()]
            return selected, models_info[selected]

        print("❌ Invalid choice. Please try again.")


def get_numeric_input(prompt, valid_options=None, min_val=None, max_val=None, input_type=int):
    while True:
        try:
            value = input_type(input(prompt).strip())
            if valid_options and value not in valid_options:
                print(f"❌ Choose from: {valid_options}")
                continue
            if min_val is not None and value < min_val:
                print(f"❌ Value must be >= {min_val}")
                continue
            if max_val is not None and value > max_val:
                print(f"❌ Value must be <= {max_val}")
                continue
            return value
        except ValueError:
            print("❌ Please enter a valid number.")


def get_user_input():
    mapping = load_brand_model_mapping()

    display_header()

    # Brand
    brand_data = select_brand(mapping)
    device_brand = brand_data["original_name"]

    # Model
    model_name, model_info = select_model(brand_data)
    new_price = model_info["new_price"]
    default_ram = model_info["ram"]
    default_storage = model_info["storage"]

    print(f"\n📱 Selected: {device_brand} {model_name}")
    print(f"   New Price: NPR {new_price:,}")

    # RAM
    print(f"\n💾 RAM Options (GB): {RAM_OPTIONS}")
    print(f"   Default for this model: {default_ram} GB")
    ram_input = input(f"👉 RAM (GB) [press Enter for {default_ram}]: ").strip()
    ram = int(ram_input) if ram_input else default_ram

    # Storage
    print(f"\n💿 Storage Options (GB): {STORAGE_OPTIONS}")
    print(f"   Default for this model: {default_storage} GB")
    storage_input = input(f"👉 Storage (GB) [press Enter for {default_storage}]: ").strip()
    internal_memory = int(storage_input) if storage_input else default_storage

    # Days used
    days_used = get_numeric_input(
        "\n📅 How many days has the phone been used? (e.g., 365 for 1 year): ",
        min_val=0, max_val=3000
    )
    years = days_used / 365
    print(f"   ≈ {years:.1f} years")

    # Battery health
    battery_pct = get_numeric_input(
        "\n🔋 Battery Health (%) [65-100]: ",
        min_val=0, max_val=100, input_type=float
    )
    battery_health = battery_pct / 100.0

    if battery_pct < 65:
        print("   ⚠️  Battery health is quite low — price may be significantly affected.")

    # Screen condition
    screen_condition = get_numeric_input(
        "\n📱 Screen Condition (1 = Good, 0 = Damaged): ",
        valid_options=[0, 1]
    )

    return {
        "device_brand": device_brand,
        "model": model_name,
        "ram": ram,
        "internal_memory": internal_memory,
        "days_used": days_used,
        "battery_health": battery_health,
        "screen_condition": screen_condition,
        "new_price_npr": new_price,
    }


def main():
    # Load model
    try:
        model = joblib.load(BEST_MODEL_PATH)
        meta = joblib.load(SCALER_PATH)
        print(f"\n✅ Loaded model: {meta.get('model_name', 'Unknown')}")
    except FileNotFoundError:
        print("\n❌ Model not found! Run 'python train_model.py' first.")
        sys.exit(1)

    while True:
        # Get input
        user_data = get_user_input()
        input_df = pd.DataFrame([user_data])

        # Predict
        predicted_price = model.predict(input_df)[0]

        # Ensure non-negative and round
        predicted_price = max(predicted_price, 2000)
        predicted_price = round(predicted_price / 500) * 500

        # Display result
        new_price = user_data["new_price_npr"]
        depreciation = ((new_price - predicted_price) / new_price) * 100

        print("\n" + "═" * 55)
        print("  💰 PREDICTED USED PHONE PRICE")
        print("═" * 55)
        print(f"  📱 Phone  : {user_data['device_brand']} {user_data['model']}")
        print(f"  🆕 New    : NPR {new_price:,}")
        print(f"  📉 Used   : NPR {predicted_price:,.0f}")
        print(f"  📊 Depr.  : {depreciation:.1f}%")
        print(f"  📅 Used   : {user_data['days_used']} days ({user_data['days_used']/365:.1f} yrs)")
        print(f"  🔋 Battery: {user_data['battery_health']*100:.0f}%")
        print(f"  📱 Screen : {'Good' if user_data['screen_condition'] == 1 else 'Damaged'}")
        print("═" * 55)

        # Continue?
        again = input("\n🔄 Predict another? (y/n): ").strip().lower()
        if again != "y":
            print("\n👋 Goodbye!")
            break


if __name__ == "__main__":
    main()
