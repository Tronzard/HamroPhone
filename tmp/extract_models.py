import pandas as pd
import json

df = pd.read_csv('ai_model/nepal_used_phones.csv')
brands = df.groupby('device_brand')['model'].unique().apply(list).to_dict()

with open('public/brand_models.json', 'w') as f:
    json.dump(brands, f)
