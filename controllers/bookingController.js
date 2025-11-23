import Booking from "../models/Booking.js";
import PlaceStatus from "../models/PlaceStatus.js";
import Place from "../models/Place.js";
import Notification from "../models/Notification.js";

// GET: lấy booking theo userId
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate("user", "-password")
      .populate("place");

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// POST: tạo booking mới
export const createBooking = async (req, res) => {
  try {
    const { place, numberOfPeople, bookingDateTime, checkoutDateTime } = req.body;

    if (!place || !numberOfPeople || !bookingDateTime) {
      return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin booking" });
    }

    const placeInfo = await Place.findById(place);
    if (!placeInfo) return res.status(404).json({ message: "Không tìm thấy place" });

    const placeStatus = await PlaceStatus.findOne({ place_id: place });
    if (!placeStatus) return res.status(404).json({ message: "Không tìm thấy trạng thái place" });

    const checkin = new Date(bookingDateTime);
    const isHotelType = ["hotel", "motel", "resort"].includes(placeInfo.category?.toLowerCase());

    let bookingData = {
      user: req.user._id,
      place,
      numberOfPeople,
      bookingDateTime: checkin,
      isPaid: !isHotelType, // auto paid nếu không phải hotel/motel/resort
    };

    if (isHotelType) {
      if (!checkoutDateTime) return res.status(400).json({ message: "checkoutDateTime là bắt buộc với hotel/motel/resort" });
      const checkout = new Date(checkoutDateTime);
      if (checkout <= checkin) return res.status(400).json({ message: "checkoutDateTime phải lớn hơn bookingDateTime" });

      const diffHours = (checkout - checkin) / (1000 * 60 * 60);
      const totalPrice = diffHours * placeStatus.price * numberOfPeople;

      bookingData = {
        ...bookingData,
        checkoutDateTime: checkout,
        totalPrice,
      };
    } else {
      const totalPrice = placeStatus.price * numberOfPeople;
      bookingData.totalPrice = totalPrice;
    }

    const booking = await Booking.create(bookingData);
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// PUT: cập nhật booking theo id
export const updateBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền cập nhật booking này" });
    }

    const newPlace = req.body.place || booking.place;
    const placeInfo = await Place.findById(newPlace);
    if (!placeInfo) return res.status(404).json({ message: "Không tìm thấy place" });

    const newBookingDate = req.body.bookingDateTime ? new Date(req.body.bookingDateTime) : booking.bookingDateTime;
    const newCheckoutDate = req.body.checkoutDateTime ? new Date(req.body.checkoutDateTime) : booking.checkoutDateTime;
    const newNumberOfPeople = req.body.numberOfPeople || booking.numberOfPeople;

    const placeStatus = await PlaceStatus.findOne({ place_id: newPlace });
    if (!placeStatus) return res.status(404).json({ message: "Không tìm thấy trạng thái place" });

    const isHotelType = ["hotel", "motel", "resort", "guest_house", "hostel"].includes(placeInfo.category?.toLowerCase());

    let totalPrice;
    let updatedData = {
      ...req.body,
      bookingDateTime: newBookingDate,
      numberOfPeople: newNumberOfPeople,
      isPaid: !isHotelType, // auto paid nếu không phải hotel/motel/resort
    };

    if (isHotelType) {
      if (!newCheckoutDate) return res.status(400).json({ message: "checkoutDateTime là bắt buộc với hotel/motel/resort" });
      const diffHours = (newCheckoutDate - newBookingDate) / (1000 * 60 * 60);
      if (diffHours <= 0) return res.status(400).json({ message: "checkoutDateTime phải lớn hơn bookingDateTime" });

      totalPrice = diffHours * placeStatus.price * newNumberOfPeople;
      updatedData = {
        ...updatedData,
        checkoutDateTime: newCheckoutDate,
        totalPrice,
      };
    } else {
      totalPrice = placeStatus.price * newNumberOfPeople;
      updatedData.totalPrice = totalPrice;
    }

    const updated = await Booking.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const updateConfirmStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Cập nhật booking
    const booking = await Booking.findByIdAndUpdate(
      id,
      { isConfirmed: true },
      { new: true }
    ).populate("user");

    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    // Tạo notification cho user
    await Notification.create({
      user_id: booking.user._id,
      message: `Booking của bạn tại place ${booking.place} đã được xác nhận.`,
    });

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// PATCH: cập nhật trạng thái thanh toán (paid) - admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Cập nhật booking
    const booking = await Booking.findByIdAndUpdate(
      id,
      { isPaid: true },
      { new: true }
    ).populate("user");

    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    // Tạo notification cho user
    await Notification.create({
      user_id: booking.user._id,
      message: `Thanh toán cho booking tại place ${booking.place} đã được xác nhận.`,
    });

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
