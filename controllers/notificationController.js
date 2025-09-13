import Notification from "../models/Notification.js";

// Lấy danh sách thông báo
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đánh dấu thông báo là đã đọc
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;

    const notification = await Notification.findByIdAndUpdate(notification_id, { read: true }, { new: true });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
