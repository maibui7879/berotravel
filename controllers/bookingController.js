import Booking from "../models/Booking.js";
import PlaceStatus from "../models/PlaceStatus.js";
import Place from "../models/Place.js";

// GET: lấy booking theo userId
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Nếu user bình thường, chỉ được xem chính mình
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

    // Lấy thông tin place
    const placeInfo = await Place.findById(place);
    if (!placeInfo) return res.status(404).json({ message: "Không tìm thấy place" });

    // Lấy giá từ PlaceStatus
    const placeStatus = await PlaceStatus.findOne({ place_id: place });
    if (!placeStatus) return res.status(404).json({ message: "Không tìm thấy trạng thái place" });

    let totalPrice;
    const checkin = new Date(bookingDateTime);

    if (placeInfo.category === "hotel") {
      if (!checkoutDateTime) return res.status(400).json({ message: "checkoutDateTime là bắt buộc với hotel" });
      const checkout = new Date(checkoutDateTime);
      if (checkout <= checkin) return res.status(400).json({ message: "checkoutDateTime phải lớn hơn bookingDateTime" });

      const diffHours = (checkout - checkin) / (1000 * 60 * 60);
      totalPrice = diffHours * placeStatus.price * numberOfPeople;

      const booking = await Booking.create({
        user: req.user._id,
        place,
        numberOfPeople,
        bookingDateTime: checkin,
        checkoutDateTime: checkout,
        totalPrice,
      });

      return res.status(201).json(booking);
    } else {
      // Nhà hàng, tour, dịch vụ khác
      totalPrice = placeStatus.price * numberOfPeople;

      const booking = await Booking.create({
        user: req.user._id,
        place,
        numberOfPeople,
        bookingDateTime: checkin,
        totalPrice,
      });

      return res.status(201).json(booking);
    }
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

    let totalPrice;
    const placeStatus = await PlaceStatus.findOne({ place_id: newPlace });
    if (!placeStatus) return res.status(404).json({ message: "Không tìm thấy trạng thái place" });

    if (placeInfo.category === "hotel") {
      if (!newCheckoutDate) return res.status(400).json({ message: "checkoutDateTime là bắt buộc với hotel" });
      const diffHours = (newCheckoutDate - newBookingDate) / (1000 * 60 * 60);
      if (diffHours <= 0) return res.status(400).json({ message: "checkoutDateTime phải lớn hơn bookingDateTime" });
      totalPrice = diffHours * placeStatus.price * newNumberOfPeople;
    } else {
      totalPrice = placeStatus.price * newNumberOfPeople;
    }

    const updatedData = {
      ...req.body,
      bookingDateTime: newBookingDate,
      checkoutDateTime: placeInfo.category === "hotel" ? newCheckoutDate : undefined,
      numberOfPeople: newNumberOfPeople,
      totalPrice,
    };

    const updated = await Booking.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// PATCH: cập nhật trạng thái xác nhận (confirm) - admin
export const updateConfirmStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(id, { isConfirmed: true }, { new: true });
    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// PATCH: cập nhật trạng thái thanh toán (paid) - admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(id, { isPaid: true }, { new: true });
    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
