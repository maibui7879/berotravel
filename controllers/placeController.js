import Place from "../models/Place.js";
import AdminLog from "../models/AdminLog.js";

export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaceCount = async (req, res) => {
  try {
    const count = await Place.countDocuments();
    res.json({ totalPlaces: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlace = async (req, res) => {
  try {
    const place = await Place.create({
      ...req.body,
      updated_by: req.user?.name || "Unknown"
    });

    await AdminLog.create({
      user: req.user._id,
      action: "create",
      targetType: "Place",
      target: place._id,
      description: `Người dùng ${req.user.name} đã tạo place ${place.name}`
    });

    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updated_by: req.user?.name || "Unknown" };

    const place = await Place.findByIdAndUpdate(id, updateData, { new: true });
    if (!place) return res.status(404).json({ message: "Place not found" });

    await AdminLog.create({
      user: req.user._id,
      action: "update",
      targetType: "Place",
      target: place._id,
      description: `Người dùng ${req.user.name} đã chỉnh sửa place ${place.name}`
    });

    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlaceImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, img_set } = req.body;

    const updateData = {};
    if (image_url) updateData.image_url = image_url;
    if (img_set) updateData.img_set = img_set;

    const place = await Place.findByIdAndUpdate(id, updateData, { new: true });
    if (!place) return res.status(404).json({ message: "Place not found" });

    await AdminLog.create({
      user: req.user._id,
      action: "update",
      targetType: "Place",
      target: place._id,
      description: `Người dùng ${req.user.name} đã cập nhật hình ảnh place ${place.name}`
    });

    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });

    await AdminLog.create({
      user: req.user._id,
      action: "delete",
      targetType: "Place",
      target: place._id,
      description: `Người dùng ${req.user.name} đã xóa place ${place.name}`
    });

    res.json({ message: "Place deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPlaceNearby = async (req, res) => {
  try {
    const { latitude, longitude, radius = 4, name, category, page = 1, limit = 10 } = req.query;
    if (!latitude || !longitude)
      return res.status(400).json({ message: "Missing latitude or longitude" });

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const r = parseFloat(radius);
    const earthRadius = 6371;

    let places = await Place.find();

    if (name) places = places.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    if (category) places = places.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));

    const nearby = places.filter((place) => {
      const dLat = (place.latitude - lat) * Math.PI / 180;
      const dLon = (place.longitude - lon) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat * Math.PI / 180) *
        Math.cos(place.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;
      return distance <= r;
    });

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    const paginated = nearby.slice(startIndex, endIndex);

    res.json({
      total: nearby.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(nearby.length / limitNum),
      data: paginated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
