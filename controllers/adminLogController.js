import AdminLog from "../models/AdminLog.js";

export const getAllLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate("user", "name email avatar_url role")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLogById = async (req, res) => {
  try {
    const log = await AdminLog.findById(req.params.id)
      .populate("user", "name email avatar_url role");
    if (!log) return res.status(404).json({ message: "Log not found" });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllLogs = async (req, res) => {
  try {
    await AdminLog.deleteMany();
    res.json({ message: "All logs deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLogById = async (req, res) => {
  try {
    const log = await AdminLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: "Log not found" });
    res.json({ message: "Log deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
