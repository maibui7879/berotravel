import pandas as pd
from pymongo import MongoClient

# Kết nối tới MongoDB trong Docker network
client = MongoClient("mongodb://mongo:27017/")

db = client["travel_review_app"]
collection = db["places"]

df = pd.read_excel("hanoi_places.xlsx")
records = df.to_dict(orient="records")

if records:
    # Kiểm tra trùng theo name + lat + lon
    inserted = 0
    for record in records:
        query = {
            "name": record.get("name"),
            "latitude": record.get("latitude"),
            "longitude": record.get("longitude")
        }
        if not collection.find_one(query):
            collection.insert_one(record)
            inserted += 1
    print(f"Đã import {inserted} bản ghi mới vào travel_review_app.places")
else:
    print("File Excel rỗng, không có dữ liệu để import.")

client.close()
