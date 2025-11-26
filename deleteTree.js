//script sửa db, đừng quan tâm

import mongoose from "mongoose";
import Place from "./models/Place.js";
import PlaceStatus from "./models/PlaceStatus.js";

// Kết nối MongoDB
const MONGO_URI = "mongodb+srv://maibui7879:7879maibui@cluster0.zs7wpoi.mongodb.net/travel_review_app";
mongoose.connect(MONGO_URI);

const deleteTrees = async () => {
  try {
    // Tìm tất cả place category = "tree"
    const trees = await Place.find({ category: "tree" });
    console.log(`Found ${trees.length} tree places`);

    for (const place of trees) {
      // Xóa PlaceStatus liên quan
      await PlaceStatus.deleteMany({ place_id: place._id });
      // Xóa Place
      await Place.findByIdAndDelete(place._id);
      console.log(`Deleted ${place.name} (${place._id})`);
    }

    console.log("All tree places deleted!");
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
};

deleteTrees();
