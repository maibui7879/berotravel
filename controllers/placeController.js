import Place from "../models/Place.js";

export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
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
    const place = await Place.create(req.body);
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      address,
      latitude,
      longitude,
      description,
      category,
      contact
    } = req.body;

    const updateData = {
      ...(name && { name }),
      ...(address && { address }),
      ...(latitude && { latitude }),
      ...(longitude && { longitude }),
      ...(description && { description }),
      ...(category && { category }),
      ...(contact && { contact }),
      updated_by: req.user?.name || "Unknown"
    };

    const place = await Place.findByIdAndUpdate(id, updateData, { new: true });

    if (!place) return res.status(404).json({ message: "Place not found" });

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

    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json({ message: "Place deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPlaceByName = async (req, res) => {
  try {
    const { name, category, latitude, longitude, radius = 4 } = req.query;

    let query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };

    let places = await Place.find(query);

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const r = parseFloat(radius);
      const earthRadius = 6371;

      places = places.filter((place) => {
        const dLat = (place.latitude - lat) * Math.PI / 180;
        const dLon = (place.longitude - lon) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat * Math.PI / 180) *
          Math.cos(place.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return distance <= r;
      });
    }

    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPlaceByCategory = async (req, res) => {
  try {
    const { category, name, latitude, longitude, radius = 4 } = req.query;

    let query = {};
    if (category) query.category = { $regex: category, $options: "i" };
    if (name) query.name = { $regex: name, $options: "i" };

    let places = await Place.find(query);

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const r = parseFloat(radius);
      const earthRadius = 6371;

      places = places.filter((place) => {
        const dLat = (place.latitude - lat) * Math.PI / 180;
        const dLon = (place.longitude - lon) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat * Math.PI / 180) *
          Math.cos(place.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        return distance <= r;
      });
    }

    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPlaceNearby = async (req, res) => {
  try {
    const { latitude, longitude, radius = 4, name, category } = req.query;

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
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat * Math.PI / 180) *
        Math.cos(place.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c;
      return distance <= r;
    });

    res.json(nearby);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
