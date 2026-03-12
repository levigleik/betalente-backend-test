/**
 * @openapi
 * components:
 *   schemas:
 *     MessageResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: Operação realizada com sucesso
 *     ValidationErrorItem:
 *       type: object
 *       required:
 *         - message
 *         - rule
 *         - field
 *       properties:
 *         message:
 *           type: string
 *           example: The email field must be a valid email address
 *         rule:
 *           type: string
 *           example: email
 *         field:
 *           type: string
 *           example: email
 *     ValidationErrorResponse:
 *       type: object
 *       required:
 *         - errors
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ValidationErrorItem'
 *     UnauthorizedResponse:
 *       type: object
 *       required:
 *         - errors
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: Unauthorized access
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - role
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fullName:
 *           type: string
 *           nullable: true
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *           example: USER
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2021-03-23T16:13:08.489Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2021-03-23T16:13:08.489Z
 *     UserPublic:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - createdAt
 *         - initials
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fullName:
 *           type: string
 *           nullable: true
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2021-03-23T16:13:08.489Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2021-03-23T16:13:08.489Z
 *         initials:
 *           type: string
 *           example: JD
 *     Client:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2021-03-23T16:13:08.489Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2021-03-23T16:13:08.489Z
 *     Gateway:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - priority
 *         - isActive
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Gateway Principal
 *         priority:
 *           type: integer
 *           example: 1
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2021-03-23T16:13:08.489Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2021-03-23T16:13:08.489Z
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - amount
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Produto Exemplo
 *         amount:
 *           type: number
 *           example: 99.9
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2021-03-23T16:13:08.489Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2021-03-23T16:13:08.489Z
 *     TransactionProduct:
 *       type: object
 *       required:
 *         - id
 *         - transactionId
 *         - productId
 *         - quantity
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         transactionId:
 *           type: integer
 *           example: 1
 *         productId:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2021-03-23T16:13:08.489Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2021-03-23T16:13:08.489Z
 *     Transaction:
 *       type: object
 *       required:
 *         - id
 *         - clientId
 *         - amount
 *         - cardLastNumbers
 *         - status
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         clientId:
 *           type: integer
 *           example: 1
 *         gatewayId:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         externalId:
 *           type: string
 *           nullable: true
 *           example: ext_123456
 *         amount:
 *           type: number
 *           example: 99.9
 *         cardLastNumbers:
 *           type: string
 *           example: '4242'
 *         status:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *           example: paid
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2021-03-23T16:13:08.489Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2021-03-23T16:13:08.489Z
 *     TransactionWithGateway:
 *       allOf:
 *         - $ref: '#/components/schemas/Transaction'
 *         - type: object
 *           properties:
 *             gateway:
 *               $ref: '#/components/schemas/Gateway'
 *     TransactionWithClientGateway:
 *       allOf:
 *         - $ref: '#/components/schemas/Transaction'
 *         - type: object
 *           properties:
 *             client:
 *               $ref: '#/components/schemas/Client'
 *             gateway:
 *               $ref: '#/components/schemas/Gateway'
 *     TransactionProductWithProduct:
 *       allOf:
 *         - $ref: '#/components/schemas/TransactionProduct'
 *         - type: object
 *           properties:
 *             product:
 *               $ref: '#/components/schemas/Product'
 *     TransactionDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/TransactionWithClientGateway'
 *         - type: object
 *           properties:
 *             transactionProducts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransactionProductWithProduct'
 *     ClientDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Client'
 *         - type: object
 *           properties:
 *             transactions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransactionWithGateway'
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: S3cur3P4s5word!
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - passwordConfirmation
 *       properties:
 *         fullName:
 *           type: string
 *           nullable: true
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 32
 *           example: S3cur3P4s5word!
 *         passwordConfirmation:
 *           type: string
 *           minLength: 8
 *           maxLength: 32
 *           example: S3cur3P4s5word!
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           nullable: true
 *           example: John Doe
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - amount
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Produto Exemplo
 *         amount:
 *           type: number
 *           minimum: 0
 *           example: 99.9
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Produto Exemplo
 *         amount:
 *           type: number
 *           minimum: 0
 *           example: 99.9
 *     UpdateGatewayPriorityRequest:
 *       type: object
 *       required:
 *         - priority
 *       properties:
 *         priority:
 *           type: integer
 *           example: 1
 *     CreatePurchaseRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - products
 *         - cardNumber
 *         - cvv
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         products:
 *           type: array
 *           items:
 *              type: object
 *              required:
 *                - id
 *                - quantity
 *              properties:
 *                id:
 *                  type: number
 *                  example: 1
 *                quantity:
 *                  type: number
 *                  example: 1
 *         cardNumber:
 *           type: string
 *           minLength: 13
 *           maxLength: 19
 *           example: '4111111111111111'
 *         cvv:
 *           type: string
 *           minLength: 3
 *           maxLength: 4
 *           example: '123'
 */

export {}
