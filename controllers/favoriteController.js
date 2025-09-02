import User from "../models/User.js";
import Place from "../models/Place.js";

// Thêm hoặc bỏ favorite cho một place
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;        // user đã được xác thực bởi middleware `protect`
    const placeId = req.params.placeId;

    const user = await User.findById(userId);
    const place = await Place.findById(placeId);

    if (!place) return res.status(404).json({ message: "Place not found" });

    const index = user.favorites.findIndex(fav => fav.toString() === placeId);
    let action;

    if (index === -1) {
      // Thêm vào favorite
      user.favorites.push(placeId);
      place.favorite_count = (place.favorite_count || 0) + 1;
      action = "added";
    } else {
      // Bỏ favorite
      user.favorites.splice(index, 1);
      place.favorite_count = Math.max((place.favorite_count || 1) - 1, 0);
      action = "removed";
    }

    await user.save();
    await place.save();

    res.json({ message: `Favorite ${action} successfully`, favorite_count: place.favorite_count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách favorite của user
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
