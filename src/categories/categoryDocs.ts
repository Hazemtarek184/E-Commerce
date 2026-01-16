/**
 * @swagger
 * components:
 *   schemas:
 *     MainCategory:
 *       type: object
 *       required:
 *         - englishName
 *         - arabicName
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the category
 *         englishName:
 *           type: string
 *           description: The name of the category in English
 *         arabicName:
 *           type: string
 *           description: The name of the category in Arabic
 *         subCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: List of sub-category IDs
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
 *     ServiceProvider:
 *       type: object
 *       required:
 *         - name
 *         - bio
 *         - workingDays
 *         - workingHours
 *         - closingHours
 *         - phoneContacts
 *         - locationLinks
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the service provider
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *         imagesUrl:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               public_id:
 *                 type: string
 *         workingDays:
 *           type: array
 *           items:
 *             type: string
 *         workingHour:
 *           type: string
 *         closingHour:
 *           type: string
 *         phoneContacts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               hasWhatsApp:
 *                 type: boolean
 *               canCall:
 *                 type: boolean
 *         locationLinks:
 *           type: array
 *           items:
 *             type: string
 *         offers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: array
 *                 items:
 *                   type: string
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The categories managing API
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Returns the list of all main categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: The list of the categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The auto-generated id of the category
 *                       englishName:
 *                         type: string
 *                       arabicName:
 *                         type: string
 *   post:
 *     summary: Create a new main category
 *     tags: [Categories]
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
 *         description: The category was created
 *       400:
 *         description: Missing parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Update a main category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category id
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
 *         description: The category was updated
 *       404:
 *         description: The category was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Delete a main category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category id
 *     responses:
 *       200:
 *         description: The category was deleted
 *       404:
 *         description: The category was not found
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
 */

/**
 * @swagger
 * tags:
 *   name: ServiceProviders
 *   description: The service providers managing API
 */

/**
 * @swagger
 * /service-providers/{subCategoryId}:
 *   get:
 *     summary: Get service providers by sub-category ID
 *     tags: [ServiceProviders]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sub-category id
 *     responses:
 *       200:
 *         description: The list of service providers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serviceProviders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceProvider'
 *   post:
 *     summary: Create a service provider under a sub-category
 *     tags: [ServiceProviders]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - bio
 *               - workingDays
 *               - workingHours
 *               - closingHours
 *               - phoneContacts
 *               - locationLinks
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Main image file
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: string
 *               workingHour:
 *                  type: string
 *               closingHour:
 *                  type: string
 *               phoneContacts:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      phoneNumber:
 *                        type: string
 *                      hasWhatsApp:
 *                        type: boolean
 *                      canCall:
 *                        type: boolean
 *               locationLinks:
 *                  type: array
 *                  items:
 *                    type: string
 *               offers:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                      description:
 *                        type: string
 *                      imageUrl:
 *                        type: array
 *                        items:
 *                          type: string
 *     responses:
 *       201:
 *         description: The service provider was created
 */

/**
 * @swagger
 * /service-providers/{serviceProviderId}:
 *   put:
 *     summary: Update a service provider
 *     tags: [ServiceProviders]
 *     parameters:
 *       - in: path
 *         name: serviceProviderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The service provider id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: string
 *               workingHour:
 *                  type: string
 *               closingHour:
 *                  type: string
 *               phoneContacts:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      phoneNumber:
 *                        type: string
 *                      hasWhatsApp:
 *                        type: boolean
 *                      canCall:
 *                        type: boolean
 *               locationLinks:
 *                  type: array
 *                  items:
 *                    type: string
 *               offers:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                      description:
 *                        type: string
 *                      imageUrl:
 *                        type: array
 *                        items:
 *                          type: string
 *     responses:
 *       200:
 *         description: The service provider was updated
 *   delete:
 *     summary: Delete a service provider
 *     tags: [ServiceProviders]
 *     parameters:
 *       - in: path
 *         name: serviceProviderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The service provider id
 *     responses:
 *       200:
 *         description: The service provider was deleted
 */

/**
 * @swagger
 * /search-providers:
 *   get:
 *     summary: Search service providers by name
 *     tags: [ServiceProviders]
 *     parameters:
 *       - in: query
 *         name: searchString
 *         schema:
 *           type: string
 *         required: true
 *         description: The string to search for in provider names
 *     responses:
 *       200:
 *         description: List of matching service providers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 providers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceProvider'
 *   post:
 *      summary: Search using post method
 *      tags: [ServiceProviders]
 *      responses:
 *        200: 
 *          description: Search works
 */

/**
 * swagger
 * /upload-provider-photo:
 *   get:
 *     summary: Upload a single photo for a provider
 *     tags: [ServiceProviders]
 *     description: Note - This endpoint uses GET but requires multipart/form-data which is unusual.
 *     responses:
 *       201:
 *         description: Photo uploaded successfully
 */

/**
 * swagger
 * /upload-provider-photos:
 *   post:
 *     summary: Upload multiple photos for a provider
 *     tags: [ServiceProviders]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               serviceProviderId:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Photos uploaded successfully
 */
