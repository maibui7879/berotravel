import Place from "../models/Place.js";
import PlaceStatus from "../models/PlaceStatus.js";
import AdminLog from "../models/AdminLog.js";

// GET: tất cả place kèm status
export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();

    const placesWithStatus = await Promise.all(
      places.map(async (place) => {
        const status = await PlaceStatus.findOne({ place_id: place._id });
        return {
          ...place.toObject(),
          status: status || null
        };
      })
    );

    res.json(placesWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: place theo id kèm status
export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });

    const status = await PlaceStatus.findOne({ place_id: place._id });

    res.json({
      ...place.toObject(),
      status: status || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST: tạo place mới
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

    // Tạo luôn PlaceStatus mặc định
    const status = await PlaceStatus.create({
      place_id: place._id,
      initial_status: "open",
      opening_time: "00:00",
      closing_time: "23:59",
      available_status: "available",
      available_rooms: ["hotel","motel","resort","guest_house","hostel"].includes(place.category?.toLowerCase()) ? 10 : undefined,
      price: ["hotel","motel","resort","guest_house","hostel"].includes(place.category?.toLowerCase()) ? 500000 : 0,
      contact: place.contact?.phone || ""
    });

    res.json({ ...place.toObject(), status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT: cập nhật place
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

    const status = await PlaceStatus.findOne({ place_id: place._id });

    res.json({ ...place.toObject(), status: status || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH: cập nhật hình ảnh place
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

    const status = await PlaceStatus.findOne({ place_id: place._id });

    res.json({ ...place.toObject(), status: status || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: xóa place
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

    // Xóa luôn PlaceStatus liên quan
    await PlaceStatus.deleteOne({ place_id: place._id });

    res.json({ message: "Place deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH: tìm place gần vị trí kèm status
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
    if (category) places = places.filter(p => p.category?.toLowerCase().includes(category.toLowerCase()));

    const nearby = [];
    for (const place of places) {
      const dLat = (place.latitude - lat) * Math.PI / 180;
      const dLon = (place.longitude - lon) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat * Math.PI / 180) *
        Math.cos(place.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;
      if (distance <= r) {
        const status = await PlaceStatus.findOne({ place_id: place._id });
        nearby.push({ ...place.toObject(), status: status || null, distance });
      }
    }

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

export const getPlaceCount = async (req, res) => {
  try {
    const count = await Place.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};