import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category and subcategory information
 */

export const createCategoryRoutes = (categoryController: CategoryController): Router => {
  const router = Router();

  /**
   * @swagger
   * /categories:
   *   get:
   *     summary: Get all available categories and subcategories
   *     tags: [Categories]
   *     description: Returns all predefined expense categories with their subcategories and icons
   *     responses:
   *       200:
   *         description: List of all categories and subcategories
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CategoriesResponse'
   *             example:
   *               success: true
   *               data:
   *                 Food:
   *                   icon: "🍔"
   *                   subcategories:
   *                     Restaurants: "🍽️"
   *                     Grocery: "🛒"
   *                     Coffee/Snacks: "☕"
   *                     Delivery: "🛍️"
   *                 Transportation:
   *                   icon: "🚗"
   *                   subcategories:
   *                     Fuel: "⛽"
   *                     Public Transport: "🚌"
   *                     Uber/Taxi: "🚕"
   *                     Maintenance: "🔧"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  router.get('/', categoryController.getCategories);

  return router;
};