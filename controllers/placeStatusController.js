import PlaceStatus from '../models/PlaceStatus.js';
import Place from '../models/Place.js';

// ---------------- GET ---------------- //

// GET place status by ID
export const getPlaceStatusById = async (req, res) => {
  try {
    const placeStatus = await PlaceStatus.findById(req.params.id);
    if (!placeStatus) return res.status(404).json({ message: 'Place status not found' });
    res.status(200).json(placeStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET place status by place ID
export const getPlaceStatusByPlaceId = async (req, res) => {
  try {
    const placeStatus = await PlaceStatus.findOne({ place_id: req.params.placeId });
    if (!placeStatus) return res.status(404).json({ message: 'Place status not found' });
    res.status(200).json(placeStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- CREATE ---------------- //

export const createPlaceStatus = async (req, res) => {
  try {
    const {
      place_id,
      initial_status,
      opening_time,
      closing_time,
      available_status,
      available_rooms,
      price,
      contact,
    } = req.body;

    // Kiểm tra place tồn tại
    const place = await Place.findById(place_id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const newPlaceStatus = new PlaceStatus({
      place_id: place._id,
      initial_status,
      opening_time,
      closing_time,
    });

    // Nếu là hotel, thêm các trường đặc thù
    if (place.category === 'hotel') {
      newPlaceStatus.available_status = available_status;
      newPlaceStatus.available_rooms = available_rooms;
      newPlaceStatus.price = price;
      newPlaceStatus.contact = contact;
    }

    const saved = await newPlaceStatus.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- UPDATE ---------------- //

// UPDATE place status by ID
export const updatePlaceStatusById = async (req, res) => {
  try {
    const placeStatus = await PlaceStatus.findById(req.params.id);
    if (!placeStatus) return res.status(404).json({ message: 'Place status not found' });

    const place = await Place.findById(placeStatus.place_id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const {
      initial_status,
      opening_time,
      closing_time,
      available_status,
      available_rooms,
      price,
      contact,
    } = req.body;

    placeStatus.initial_status = initial_status ?? placeStatus.initial_status;
    placeStatus.opening_time = opening_time ?? placeStatus.opening_time;
    placeStatus.closing_time = closing_time ?? placeStatus.closing_time;

    if (place.category === 'hotel') {
      placeStatus.available_status = available_status ?? placeStatus.available_status;
      placeStatus.available_rooms = available_rooms ?? placeStatus.available_rooms;
      placeStatus.price = price ?? placeStatus.price;
      placeStatus.contact = contact ?? placeStatus.contact;
    }

    const updated = await placeStatus.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE place status by place ID
export const updatePlaceStatusByPlaceId = async (req, res) => {
  try {
    const placeStatus = await PlaceStatus.findOne({ place_id: req.params.placeId });
    if (!placeStatus) return res.status(404).json({ message: 'Place status not found' });

    const place = await Place.findById(placeStatus.place_id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const {
      initial_status,
      opening_time,
      closing_time,
      available_status,
      available_rooms,
      price,
      contact,
    } = req.body;

    placeStatus.initial_status = initial_status ?? placeStatus.initial_status;
    placeStatus.opening_time = opening_time ?? placeStatus.opening_time;
    placeStatus.closing_time = closing_time ?? placeStatus.closing_time;

    if (place.category === 'hotel') {
      placeStatus.available_status = available_status ?? placeStatus.available_status;
      placeStatus.available_rooms = available_rooms ?? placeStatus.available_rooms;
      placeStatus.price = price ?? placeStatus.price;
      placeStatus.contact = contact ?? placeStatus.contact;
    }

    const updated = await placeStatus.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- DELETE ---------------- //

// DELETE place status by ID
export const deletePlaceStatusById = async (req, res) => {
  try {
    const placeStatus = await PlaceStatus.findById(req.params.id);
    if (!placeStatus) return res.status(404).json({ message: 'Place status not found' });

    await placeStatus.deleteOne();
    res.status(200).json({ message: 'Place status removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlaceStatusByPlaceId = async (req, res) => {
  try {
    const placeStatus = await PlaceStatus.findOne({ place_id: req.params.placeId });
    if (!placeStatus) return res.status(404).json({ message: 'Place status not found' });

    await placeStatus.deleteOne();
    res.status(200).json({ message: 'Place status removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
