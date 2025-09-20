import express from "express";
import { registerUser, 
        loginUser, 
        getProfile, 
        getUserById, 
        updateProfile,
        getUsersCount  } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Người dùng
 *   description: API cho xác thực và quản lý hồ sơ người dùng
 */
/**
 * @swagger
 * /users/count:
 *   get:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Người dùng]
 *     responses:
 *       200:
 *         description: Tổng số user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 42
 */
router.get("/count", getUsersCount);
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Người dùng]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: Nguyễn Văn A
 *               email: nguyenvana@example.com
 *               password: matkhau123
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Người dùng đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Người dùng]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: nguyenvana@example.com
 *               password: matkhau123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi server
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ cá nhân
 *     tags: [Người dùng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       401:
 *         description: Không được phép / Token không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.get("/profile", protect, getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Cập nhật hồ sơ cá nhân
 *     tags: [Người dùng]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *               cover_url:
 *                 type: string
 *               dob:
 *                 type: string
 *               bio:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: Nguyễn Văn B
 *               avatar_url: https://example.com/avatar_moi.jpg
 *               cover_url: https://example.com/cover_moi.jpg
 *               dob: "1995-05-20"
 *               bio: "Tôi là một lập trình viên"
 *               password: matkhaumoi
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không được phép / Token không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.put("/profile", protect, updateProfile);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Người dùng]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần lấy
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", getUserById);

export default router;
