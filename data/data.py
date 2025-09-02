import requests
import pandas as pd

query = """
[out:json][timeout:50];
(
  node["amenity"~"restaurant|cafe|fast_food|bar"](21.0,105.75,21.2,105.95);
  node["shop"~"supermarket|convenience"](21.0,105.75,21.2,105.95);
  node["amenity"="marketplace"](21.0,105.75,21.2,105.95);
  node["tourism"="attraction"](21.0,105.75,21.2,105.95);
  node["amenity"~"school|university|college|kindergarten"](21.0,105.75,21.2,105.95);
  node["leisure"="park"](21.0,105.75,21.2,105.95);
  node["leisure"~"playground|amusement_ride"](21.0,105.75,21.2,105.95);
  node["natural"="water"](21.0,105.75,21.2,105.95);
  node["water"="lake"](21.0,105.75,21.2,105.95);
);
out body;
"""

url = "https://overpass-api.de/api/interpreter"
response = requests.post(url, data={"data": query})
data = response.json()

places = []
for e in data["elements"]:
    tags = e.get("tags", {})
    places.append({
        "name": tags.get("name", "Không rõ tên"),
        "address": tags.get("addr:full") or tags.get("addr:street") or "Không rõ địa chỉ",
        "latitude": e.get("lat"),
        "longitude": e.get("lon"),
        "description": "",
        "category": tags.get("amenity") or tags.get("shop") or tags.get("tourism") or tags.get("leisure") or tags.get("natural") or "other",
        "image_url": ""
    })

df = pd.DataFrame(places)
df.to_excel("hanoi_places.xlsx", index=False)
print("Đã lưu dữ liệu vào hanoi_places.xlsx")
