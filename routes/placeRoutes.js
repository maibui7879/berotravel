import express from "express";
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaceNearby,
  updatePlaceImages,
  getPlaceCount
} from "../controllers/placeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Địa điểm
 *   description: API quản lý địa điểm (nhà hàng, chợ, điểm tham quan)
 */
/**
 * @swagger
 * /places/count:
 *   get:
 *     summary: Lấy tổng số địa điểm hiện có
 *     tags: [Địa điểm]
 *     responses:
 *       200:
 *         description: Số lượng place
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPlaces:
 *                   type: integer
 *                   example: 123
 */
router.get("/count", getPlaceCount);
/**
 * @swagger
 * /places:
 *   get:
 *     summary: Lấy danh sách tất cả địa điểm
 *     tags: [Địa điểm]
 *     responses:
 *       200:
 *         description: Danh sách tất cả địa điểm
 */
router.get("/", getPlaces);

/**
 * @swagger
 * /places/{id}:
 *   get:
 *     summary: Lấy thông tin địa điểm theo ID
 *     tags: [Địa điểm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     responses:
 *       200:
 *         description: Thông tin địa điểm
 *       404:
 *         description: Không tìm thấy địa điểm
 */
router.get("/:id", getPlaceById);

/**
 * @swagger
 * /places:
 *   post:
 *     summary: Tạo địa điểm mới
 *     tags: [Địa điểm]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address, latitude, longitude]
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image_url:
 *                 type: string
 *               img_set:
 *                 type: array
 *                 items:
 *                   type: string
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *               favorite_count:
 *                 type: number
 *     responses:
 *       200:
 *         description: Địa điểm mới đã được tạo
 *       500:
 *         description: Lỗi server
 */
router.post("/", protect, createPlace);

/**
 * @swagger
 * /places/{id}:
 *   put:
 *     summary: Cập nhật thông tin địa điểm theo ID
 *     tags: [Địa điểm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Thông tin địa điểm đã được cập nhật
 *       404:
 *         description: Không tìm thấy địa điểm
 */
router.put("/:id", protect, updatePlace);

/**
 * @swagger
 * /places/images/{id}:
 *   put:
 *     summary: Cập nhật ảnh chính và ảnh phụ cho địa điểm 
 *     tags: [Địa điểm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image_url:
 *                 type: string
 *                 example: "https://example.com/main.jpg"
 *               img_set:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
 *     responses:
 *       200:
 *         description: Cập nhật ảnh thành công
 *       404:
 *         description: Không tìm thấy địa điểm
 *       500:
 *         description: Lỗi server
 */
router.put("/images/:id", updatePlaceImages); 

/**
 * @swagger
 * /places/{id}:
 *   delete:
 *     summary: Xóa địa điểm theo ID
 *     tags: [Địa điểm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm
 *     responses:
 *       200:
 *         description: Xóa địa điểm thành công
 *       404:
 *         description: Không tìm thấy địa điểm
 */
router.delete("/:id", protect, deletePlace);

/**
 * @swagger
 * /places/search/nearby:
 *   get:
 *     summary: Tìm địa điểm gần vị trí hiện tại
 *     tags: [Địa điểm]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Vĩ độ hiện tại
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Kinh độ hiện tại
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 4
 *         description: Bán kính tìm kiếm (km)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Lọc theo tên địa điểm (tùy chọn)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục địa điểm (tùy chọn)
 *     responses:
 *       200:
 *         description: Danh sách địa điểm gần vị trí hiện tại
 */
router.get("/search/nearby", searchPlaceNearby);

export default router;
