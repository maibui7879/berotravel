import Journey from '../models/Journey.js';
import User from '../models/User.js';
import Place from '../models/Place.js';

// ==========================
// GET journey by ID
// ==========================
export const getJourneyById = async (req, res) => {
  try {
    const journey = await Journey.findOne({ _id: req.params.journeyId, user: req.user.id })
      .populate('places.place');

    if (!journey) return res.status(404).json({ success: false, message: 'Journey not found' });

    res.status(200).json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// GET all journeys of current user
// ==========================
export const getMyJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ user: req.user.id }).populate('places.place');
    res.status(200).json({ success: true, data: journeys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Create new journey
// ==========================
export const createJourney = async (req, res) => {
  const { places } = req.body;

  try {
    const placeObjects = places.map(placeId => ({ place: placeId, visited: false }));

    const journey = new Journey({
      user: req.user.id,
      places: placeObjects,
      status: 'ongoing',
    });

    await journey.save();
    res.status(201).json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Update journey (preserve visited)
// ==========================
export const updateJourney = async (req, res) => {
  const { places } = req.body;

  try {
    const journey = await Journey.findOne({ _id: req.params.journeyId, user: req.user.id });
    if (!journey) return res.status(404).json({ success: false, message: 'Journey not found' });

    const placeObjects = places.map(placeId => {
      const existing = journey.places.find(p => p.place.toString() === placeId);
      return { place: placeId, visited: existing ? existing.visited : false };
    });

    journey.places = placeObjects;
    journey.status = 'ongoing'; // resume journey nếu đang suspend
    await journey.save();

    res.status(200).json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Delete journey
// ==========================
export const deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findOneAndDelete({ _id: req.params.journeyId, user: req.user.id });
    if (!journey) return res.status(404).json({ success: false, message: 'Journey not found' });

    res.status(200).json({ success: true, message: 'Journey deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Update journey status (suspend/resume)
// ==========================
export const updateJourneyStatus = async (req, res) => {
  const { status } = req.body;

  if (!['ongoing', 'suspended'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });

  try {
    const journey = await Journey.findOne({ _id: req.params.journeyId, user: req.user.id });
    if (!journey) return res.status(404).json({ success: false, message: 'Journey not found' });

    if (journey.status === 'completed')
      return res.status(400).json({ success: false, message: 'Cannot change status of a completed journey' });

    // Nếu resume (suspended -> ongoing) thì giữ nguyên visited
    journey.status = status;
    await journey.save();

    res.status(200).json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const markPlaceAsVisited = async (req, res) => {
  try {
    const journey = await Journey.findOne({ _id: req.params.journeyId, user: req.user.id });
    if (!journey) return res.status(404).json({ success: false, message: 'Journey not found' });

    if (journey.status !== 'ongoing')
      return res.status(400).json({ success: false, message: 'Journey is not ongoing' });

    const placeInJourney = journey.places.find(p => p.place.toString() === req.params.placeId);
    if (!placeInJourney)
      return res.status(404).json({ success: false, message: 'Place not found in journey' });

    placeInJourney.visited = true;

    // Nếu tất cả visited → completed
    if (journey.places.every(p => p.visited)) journey.status = 'completed';

    await journey.save();
    res.status(200).json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
