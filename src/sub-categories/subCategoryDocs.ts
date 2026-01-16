/**
 * @swagger
 * components:
 *   schemas:
 *     SubCategory:
 *       type: object
 *       required:
 *         - englishName
 *         - arabicName
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the sub-category
 *         englishName:
 *           type: string
 *           description: The name of the sub-category in English
 *         arabicName:
 *           type: string
 *           description: The name of the sub-category in Arabic
 *         serviceProvider:
 *           type: array
 *           items:
 *             type: string
 *           description: List of service provider IDs
 */

/**
 * @swagger
 * /sub-categories/{mainCategoryId}:
 *   get:
 *     summary: Get sub-categories by main category ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: mainCategoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The main category id
 *     responses:
 *       200:
 *         description: The list of sub-categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subCategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The auto-generated id of the sub-category
 *                       englishName:
 *                         type: string
 *                         description: The name of the sub-category in English
 *                       arabicName:
 *                         type: string
 *                         description: The name of the sub-category in Arabic
 *       404:
 *         description: Main category not found
 *   post:
 *     summary: Create a sub-category under a main category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: mainCategoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The main category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - englishName
 *               - arabicName
 *             properties:
 *               englishName:
 *                 type: string
 *               arabicName:
 *                 type: string
 *     responses:
 *       201:
 *         description: The sub-category was created
 *       404:
 *         description: Main category not found
 */

/**
 * @swagger
 * /sub-categories/{subCategoryId}:
 *   put:
 *     summary: Update a sub-category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sub-category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               englishName:
 *                 type: string
 *               arabicName:
 *                 type: string
 *     responses:
 *       200:
 *         description: The sub-category was updated
 *   delete:
 *     summary: Delete a sub-category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sub-category id
 *     responses:
 *       200:
 *         description: The sub-category was deleted
 *       404:
 *         description: Sub-category not found
 */
