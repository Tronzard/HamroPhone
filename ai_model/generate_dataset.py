"""
Generate a realistic synthetic dataset for used mobile phone prices in Nepal (NPR).
This script creates ~2000 samples with brands popular in the Nepali market.
"""

import pandas as pd
import numpy as np
import os

RANDOM_SEED = 42
NUM_SAMPLES = 2000
OUTPUT_PATH = "nepal_used_phones.csv"

# ─── Nepal Market Phone Catalog ─────────────────────────────────────────────
# Format: (brand, model, base_new_price_npr, ram_gb, storage_gb)
# Prices reflect typical Nepal retail in NPR (2024-2025 range)

PHONE_CATALOG = [
    # Samsung
    ("Samsung", "Galaxy A14", 18000, 4, 64),
    ("Samsung", "Galaxy A15", 22000, 6, 128),
    ("Samsung", "Galaxy A25", 30000, 6, 128),
    ("Samsung", "Galaxy A34", 38000, 6, 128),
    ("Samsung", "Galaxy A54", 48000, 8, 128),
    ("Samsung", "Galaxy A55", 52000, 8, 256),
    ("Samsung", "Galaxy S23", 95000, 8, 256),
    ("Samsung", "Galaxy S23 Ultra", 155000, 12, 256),
    ("Samsung", "Galaxy S24", 105000, 8, 256),
    ("Samsung", "Galaxy S24 Ultra", 175000, 12, 512),
    ("Samsung", "Galaxy M14", 16000, 4, 64),
    ("Samsung", "Galaxy M34", 28000, 6, 128),
    ("Samsung", "Galaxy F15", 15000, 4, 128),
    ("Samsung", "Galaxy Z Flip5", 125000, 8, 256),

    # Xiaomi / Redmi / POCO
    ("Xiaomi", "Redmi Note 13", 22000, 6, 128),
    ("Xiaomi", "Redmi Note 13 Pro", 30000, 8, 128),
    ("Xiaomi", "Redmi Note 13 Pro+", 38000, 8, 256),
    ("Xiaomi", "Redmi 13C", 13000, 4, 128),
    ("Xiaomi", "Redmi A3", 10000, 3, 64),
    ("Xiaomi", "POCO M6 Pro", 20000, 6, 128),
    ("Xiaomi", "POCO X6", 28000, 8, 256),
    ("Xiaomi", "POCO F5", 38000, 8, 256),
    ("Xiaomi", "Xiaomi 14", 85000, 12, 256),
    ("Xiaomi", "Redmi Note 12", 19000, 6, 128),
    ("Xiaomi", "Redmi 12", 15000, 4, 128),

    # Vivo
    ("Vivo", "Vivo Y18", 15000, 4, 64),
    ("Vivo", "Vivo Y28", 18000, 4, 128),
    ("Vivo", "Vivo Y100", 28000, 8, 128),
    ("Vivo", "Vivo V30e", 35000, 8, 256),
    ("Vivo", "Vivo V30", 42000, 8, 256),
    ("Vivo", "Vivo X100", 70000, 12, 256),

    # Oppo
    ("Oppo", "Oppo A18", 14000, 4, 64),
    ("Oppo", "Oppo A38", 17000, 4, 128),
    ("Oppo", "Oppo A78", 25000, 8, 128),
    ("Oppo", "Oppo Reno 11", 38000, 8, 256),
    ("Oppo", "Oppo Reno 11 Pro", 48000, 12, 256),
    ("Oppo", "Oppo Find X6 Pro", 95000, 12, 256),

    # Realme
    ("Realme", "Realme C53", 13000, 4, 64),
    ("Realme", "Realme C67", 16000, 6, 128),
    ("Realme", "Realme 12 Pro", 32000, 8, 256),
    ("Realme", "Realme 12 Pro+", 38000, 8, 256),
    ("Realme", "Realme GT Neo 5", 45000, 8, 256),
    ("Realme", "Realme Narzo 60", 22000, 6, 128),

    # OnePlus
    ("OnePlus", "OnePlus Nord CE 3 Lite", 25000, 8, 128),
    ("OnePlus", "OnePlus Nord CE 4", 30000, 8, 256),
    ("OnePlus", "OnePlus 12R", 48000, 8, 256),
    ("OnePlus", "OnePlus 12", 85000, 12, 256),
    ("OnePlus", "OnePlus Nord 3", 38000, 8, 128),
    ("OnePlus", "OnePlus 11", 65000, 12, 256),

    # Apple (very popular in Nepal, high resale value)
    ("Apple", "iPhone 13", 95000, 4, 128),
    ("Apple", "iPhone 14", 115000, 6, 128),
    ("Apple", "iPhone 14 Pro", 145000, 6, 256),
    ("Apple", "iPhone 15", 135000, 6, 128),
    ("Apple", "iPhone 15 Pro", 170000, 8, 256),
    ("Apple", "iPhone 15 Pro Max", 210000, 8, 512),
    ("Apple", "iPhone SE (3rd Gen)", 65000, 4, 64),
    ("Apple", "iPhone 12", 72000, 4, 64),

    # Nokia
    ("Nokia", "Nokia G42", 22000, 6, 128),
    ("Nokia", "Nokia G22", 16000, 4, 64),
    ("Nokia", "Nokia C32", 12000, 3, 64),

    # Huawei
    ("Huawei", "Huawei Nova 11i", 28000, 8, 128),
    ("Huawei", "Huawei Nova Y90", 25000, 6, 128),

    # Tecno (budget segment popular in Nepal)
    ("Tecno", "Tecno Spark 20", 14000, 4, 128),
    ("Tecno", "Tecno Camon 20", 22000, 8, 256),
    ("Tecno", "Tecno Pova 5", 18000, 8, 128),

    # Infinix
    ("Infinix", "Infinix Hot 40i", 12000, 4, 128),
    ("Infinix", "Infinix Note 30", 20000, 8, 128),
    ("Infinix", "Infinix GT 10 Pro", 25000, 8, 256),
]


def compute_used_price(
    base_price: float,
    days_used: int,
    battery_health: float,
    screen_condition: int,
    brand: str,
    rng: np.random.Generator,
) -> float:
    """
    Calculate a realistic used phone price based on multiple factors.

    The depreciation model considers:
    - Time-based depreciation (exponential decay)
    - Battery health impact
    - Screen condition penalty
    - Brand resale value multiplier (Apple holds value best)
    - Random market noise
    """
    # ── Brand resale factor ──
    # Apple holds value best, Samsung/OnePlus mid, budget brands depreciate faster
    brand_factors = {
        "Apple": 0.88,      # Apple retains ~88% relative value
        "Samsung": 0.72,
        "OnePlus": 0.70,
        "Xiaomi": 0.65,
        "Oppo": 0.63,
        "Vivo": 0.62,
        "Realme": 0.60,
        "Huawei": 0.58,
        "Nokia": 0.55,
        "Tecno": 0.52,
        "Infinix": 0.50,
    }
    brand_factor = brand_factors.get(brand, 0.60)

    # ── Time depreciation (exponential decay) ──
    # Phone loses ~30-50% in first year, slower afterwards
    years_used = days_used / 365.0
    time_factor = np.exp(-0.35 * years_used)  # Exponential decay
    time_factor = max(time_factor, 0.15)       # Floor at 15% of original

    # ── Battery health factor ──
    # Below 80% health, price drops significantly
    if battery_health >= 0.90:
        battery_factor = 1.0
    elif battery_health >= 0.80:
        battery_factor = 0.92
    elif battery_health >= 0.70:
        battery_factor = 0.78
    else:
        battery_factor = 0.60

    # ── Screen condition ──
    screen_factor = 1.0 if screen_condition == 1 else 0.75

    # ── Combined price calculation ──
    # Price = base * brand * time * battery * screen + noise
    price_ratio = brand_factor * time_factor * battery_factor * screen_factor

    # Add random market noise (-8% to +8%)
    noise = rng.uniform(-0.08, 0.08)
    price_ratio = price_ratio * (1 + noise)

    # Ensure ratio is in valid range
    price_ratio = np.clip(price_ratio, 0.08, 0.95)

    used_price = base_price * price_ratio

    # Round to nearest 500 NPR (realistic pricing)
    used_price = round(used_price / 500) * 500

    # Minimum price floor
    used_price = max(used_price, 2000)

    return used_price


def generate_dataset() -> pd.DataFrame:
    """Generate the full synthetic dataset."""
    rng = np.random.default_rng(RANDOM_SEED)

    records = []

    for _ in range(NUM_SAMPLES):
        # Pick a random phone from catalog
        idx = rng.integers(0, len(PHONE_CATALOG))
        brand, model, base_price, ram, storage = PHONE_CATALOG[idx]

        # Generate usage characteristics
        days_used = int(rng.integers(30, 1500))   # 1 month to ~4 years

        # Battery health: newer phones have better battery
        # Base health decreases with usage
        base_health = max(0.50, 1.0 - (days_used / 365.0) * 0.12)
        battery_health = round(
            np.clip(base_health + rng.normal(0, 0.05), 0.45, 1.0), 2
        )

        # Screen condition: 80% good, 20% damaged
        screen_condition = int(rng.choice([1, 1, 1, 1, 0]))

        # Compute used price
        used_price = compute_used_price(
            base_price, days_used, battery_health, screen_condition, brand, rng
        )

        records.append({
            "device_brand": brand,
            "model": model,
            "ram": ram,
            "internal_memory": storage,
            "days_used": days_used,
            "battery_health": battery_health,
            "screen_condition": screen_condition,
            "new_price_npr": base_price,
            "used_price_npr": used_price,
        })

    df = pd.DataFrame(records)
    return df


def main():
    print("=" * 60)
    print("  Nepal Used Mobile Phone Price Dataset Generator")
    print("=" * 60)

    df = generate_dataset()

    # Display summary
    print(f"\n✅ Generated {len(df)} samples")
    print(f"\n📊 Dataset Shape: {df.shape}")
    print(f"\n📱 Brands: {df['device_brand'].nunique()} unique brands")
    print(f"📱 Models: {df['model'].nunique()} unique models")
    print(f"\n💰 Price Range (NPR):")
    print(f"   New:  NPR {df['new_price_npr'].min():,.0f} - NPR {df['new_price_npr'].max():,.0f}")
    print(f"   Used: NPR {df['used_price_npr'].min():,.0f} - NPR {df['used_price_npr'].max():,.0f}")

    print(f"\n📋 Sample Data:")
    print(df.head(10).to_string(index=False))

    # Save
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"\n💾 Dataset saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
