import express from "express";
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaceByName,
  searchPlaceByCategory,
  searchPlaceNearby
} from "../controllers/placeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Places
 *   description: API for managing places (restaurants, markets, attractions)
 */

/**
 * @swagger
 * /places:
 *   get:
 *     summary: Get all places
 *     tags: [Places]
 *     responses:
 *       200:
 *         description: List of all places
 */
router.get("/", getPlaces);

/**
 * @swagger
 * /places/{id}:
 *   get:
 *     summary: Get a place by ID
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     responses:
 *       200:
 *         description: Place object
 *       404:
 *         description: Place not found
 */
router.get("/:id", getPlaceById);

/**
 * @swagger
 * /places:
 *   post:
 *     summary: Create a new place
 *     tags: [Places]
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
 *         description: Created place object
 *       500:
 *         description: Server error
 */
router.post("/", protect, createPlace);

/**
 * @swagger
 * /places/{id}:
 *   put:
 *     summary: Update a place by ID
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated place object
 *       404:
 *         description: Place not found
 */
router.put("/:id", protect, updatePlace);

/**
 * @swagger
 * /places/{id}:
 *   delete:
 *     summary: Delete a place by ID
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     responses:
 *       200:
 *         description: Place deleted
 *       404:
 *         description: Place not found
 */
router.delete("/:id", protect, deletePlace);

/**
 * @swagger
 * /places/search/by-name:
 *   get:
 *     summary: Search places by name
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name keyword
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Optional category filter
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: Optional current latitude for nearby filter
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: Optional current longitude for nearby filter
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 4
 *         description: Radius in km for nearby filter
 *     responses:
 *       200:
 *         description: List of matching places
 */
router.get("/search/by-name", searchPlaceByName);

/**
 * @swagger
 * /places/search/by-category:
 *   get:
 *     summary: Search places by category
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category keyword
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Optional name filter
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 4
 *     responses:
 *       200:
 *         description: List of places filtered by category (and optional nearby)
 */
router.get("/search/by-category", searchPlaceByCategory);

/**
 * @swagger
 * /places/search/nearby:
 *   get:
 *     summary: Search nearby places
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 4
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of nearby places filtered by optional name/category
 */
router.get("/search/nearby", searchPlaceNearby);

export default router;
