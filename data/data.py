import requests
import pandas as pd

query = """
[out:json][timeout:90];
(
  /* Ẩm thực */
  node["amenity"~"restaurant|cafe|fast_food|bar|pub"](21.0,105.75,21.2,105.95);

  /* Mua sắm */
  node["shop"~"supermarket|convenience|mall|electronics|clothes|furniture|bakery|beverages|department_store"](21.0,105.75,21.2,105.95);

  /* Chợ */
  node["amenity"="marketplace"](21.0,105.75,21.2,105.95);

  /* Du lịch – tham quan */
  node["tourism"~"attraction|museum|viewpoint|gallery"](21.0,105.75,21.2,105.95);

  /* Cơ sở giáo dục */
  node["amenity"~"school|university|college|kindergarten"](21.0,105.75,21.2,105.95);

  /* Công viên, vui chơi */
  node["leisure"~"park|playground|amusement_ride|fitness_centre|sports_centre|stadium|swimming_pool"](21.0,105.75,21.2,105.95);

  /* Sân thể thao */
  node["sport"](21.0,105.75,21.2,105.95);

  /* Điểm tự nhiên */
  node["natural"~"water|wood|tree"](21.0,105.75,21.2,105.95);
  node["water"="lake"](21.0,105.75,21.2,105.95);

  /* Lưu trú */
  node["tourism"~"hotel|guest_house|motel|hostel"](21.0,105.75,21.2,105.95);

  /* Y tế */
  node["amenity"~"hospital|clinic|pharmacy|doctors"](21.0,105.75,21.2,105.95);
  node["healthcare"](21.0,105.75,21.2,105.95);

  /* Giao thông */
  node["highway"="bus_stop"](21.0,105.75,21.2,105.95);
  node["amenity"="bus_station"](21.0,105.75,21.2,105.95);
  node["railway"="station"](21.0,105.75,21.2,105.95);
  node["amenity"="parking"](21.0,105.75,21.2,105.95);

  /* Tôn giáo, di tích, lịch sử */
  node["amenity"="place_of_worship"](21.0,105.75,21.2,105.95);
  node["historic"](21.0,105.75,21.2,105.95);
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
        "category": (
            tags.get("amenity")
            or tags.get("shop")
            or tags.get("tourism")
            or tags.get("leisure")
            or tags.get("sport")
            or tags.get("natural")
            or tags.get("historic")
            or "other"
        ),
        "image_url": ""
    })

df = pd.DataFrame(places)
df.to_excel("hanoi_places.xlsx", index=False)
print("Đã lưu dữ liệu vào hanoi_places.xlsx")
