import mongoose from "mongoose";
import Place from "./models/Place.js";
import PlaceStatus from "./models/PlaceStatus.js";

// Kết nối MongoDB
const MONGO_URI = "mongodb+srv://maibui7879:7879maibui@cluster0.zs7wpoi.mongodb.net/travel_review_app";
mongoose.connect(MONGO_URI);

const createPlaceStatuses = async () => {
  try {
    const places = await Place.find();
    console.log(`Found ${places.length} places`);

    let countAdded = 0;

    for (const place of places) {
      const category = place.category?.toLowerCase() || "other";

      // Kiểm tra nếu placeStatus đã tồn tại
      const exists = await PlaceStatus.findOne({ place_id: place._id });
      if (exists) {
        console.log(`PlaceStatus already exists for ${place.name} (category: ${category})`);
        continue;
      }

      let defaultPrice = 0;
      let availableRooms = undefined;

      // Xử lý từng nhóm category
      if (["hotel", "motel", "resort", "guest_house", "hostel"].includes(category)) {
        defaultPrice = 500000;
        availableRooms = 10;
      } else if (["restaurant", "bar", "cafe", "fast_food", "pub"].includes(category)) {
        defaultPrice = 0;
      } else if (["attraction", "museum", "viewpoint", "gallery"].includes(category)) {
        defaultPrice = 0;
      } else {
        // Các loại còn lại (shop, park, sport, natural, historic, school, bus_station,...)
        defaultPrice = 0;
      }

      const newStatus = new PlaceStatus({
        place_id: place._id,
        initial_status: "open",
        opening_time: "00:00",
        closing_time: "23:59",
        available_status: "available",
        available_rooms: availableRooms,
        price: defaultPrice,
        contact: place.contact?.phone || "",
      });

      await newStatus.save();
      console.log(`Created PlaceStatus for ${place.name} (category: ${category})`);
      countAdded++;
    }

    console.log(`All eligible place statuses created! Total added: ${countAdded}`);
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
};

createPlaceStatuses();
