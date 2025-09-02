import express from "express";
import { toggleFavorite, getUserFavorites } from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: API for managing user's favorite places
 */

/**
 * @swagger
 * /favorites/{placeId}:
 *   post:
 *     summary: Add or remove a place from user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the place to toggle favorite
 *     responses:
 *       200:
 *         description: Favorite added or removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 favorite_count:
 *                   type: number
 *       404:
 *         description: Place not found
 *       500:
 *         description: Server error
 */
router.post("/:placeId", protect, toggleFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get all favorite places of the authenticated user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's favorite places
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", protect, getUserFavorites);

export default router;
