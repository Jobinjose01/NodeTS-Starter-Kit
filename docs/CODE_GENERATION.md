# Code Generation Guide

This guide covers the automated code generation system in the Node.js Starter Kit, which generates complete CRUD modules with controllers, services, routes, validators, Swagger documentation, and comprehensive tests.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Generated Files](#generated-files)
- [Customization](#customization)
- [Templates](#templates)
- [Best Practices](#best-practices)

## Overview

The code generator automatically creates a complete module based on your Prisma schema, including:

- ✅ Model class with type definitions
- ✅ Service with CRUD operations and pagination
- ✅ Controller with request/response handling
- ✅ RESTful routes
- ✅ Validators with i18n support
- ✅ Swagger API documentation
- ✅ Unit tests (controller + service)
- ✅ Integration tests with performance tracking

**Benefits:**
- Consistent code structure across modules
- RESTful standards built-in
- Comprehensive test coverage from day one
- Time savings (minutes instead of hours)
- Reduced human error

## Quick Start

### 1. Define Your Model

Add your model to `prisma/schema.prisma`:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  description String?  @db.Text
  price       Float
  stock       Int      @default(0)
  categoryId  Int
  status      Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // Relation starts here
  category    Category @relation(fields: [categoryId], references: [id])
  
  @@index([categoryId])
  @@index([name])
}

model Category {
  id        Int       @id @default(autoincrement())
  name      String    @unique @db.VarChar(100)
  products  Product[]
}
```

**Important:** Add a comment `// Relation starts here` before relations to separate fields from relationships.

### 2. Run Generator

```bash
npm run generate
```

### 3. Select Options

The generator will prompt you for:

```
? What would you like to generate?
  ❯ All (Model, Controller, Service, Routes, Validator, Swagger, Tests)
    Model
    Controller
    Service
    Routes
    Validator
    Swagger Documentation
    Tests

? Enter the model name (as defined in Prisma schema): Product

? Would you like to generate tests? 
  ❯ Yes, generate all tests (unit + integration)
    No, skip tests
```

### 4. Generated Structure

```
src/
├── models/
│   └── Product.ts                          # Model class
├── controllers/
│   └── productController.ts                # Controller with CRUD
├── services/
│   └── productService.ts                   # Service with business logic
├── routes/
│   └── productRoutes.ts                    # RESTful routes
├── validators/
│   └── productValidator.ts                 # Request validation
├── config/swagger/
│   ├── definitions/
│   │   └── productDefinitions.ts          # Swagger schemas
│   └── paths/
│       └── productPaths.ts                 # Swagger endpoints
└── tests/
    ├── unit/
    │   ├── controllers/
    │   │   └── productController.test.ts   # Controller unit tests
    │   └── services/
    │       └── productService.test.ts      # Service unit tests
    └── integration/
        └── product.test.ts                 # API integration tests
```

### 5. Register Routes

Add to `src/routes/v1.ts`:

```typescript
import { ProductRoutes } from './productRoutes';

// In the constructor
this.router.use('/product', new ProductRoutes().router);
```

### 6. Run Tests

```bash
# Run all tests
npm test

# Run only product tests
npm test -- product

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration
```

## Generated Files

### Model (`src/models/Product.ts`)

```typescript
export class Product {
    id?: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: number;
    status?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(data: Partial<Product>) {
        Object.assign(this, data);
    }
}
```

**Features:**
- TypeScript interfaces for type safety
- Optional fields marked with `?`
- Constructor for easy initialization

### Service (`src/services/productService.ts`)

```typescript
export class ProductService extends BaseService<Product> {
    async create(data: Partial<Product>): Promise<Product> {
        return await prisma.product.create({ data });
    }

    async getById(id: number): Promise<Product | null> {
        return await prisma.product.findUnique({
            where: { id, deletedAt: null },
        });
    }

    async update(id: number, data: Partial<Product>): Promise<Product> {
        return await prisma.product.update({
            where: { id },
            data: { ...data, updatedAt: new Date() },
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async getAll(filters: any): Promise<PaginationResult<Product>> {
        // Pagination, filtering, sorting logic
    }
}
```

**Features:**
- Extends `BaseService` for common functionality
- Soft delete support (`deletedAt`)
- Pagination with filtering and sorting
- Type-safe operations

### Controller (`src/controllers/productController.ts`)

```typescript
export class ProductController extends BaseController {
    private service: ProductService;

    constructor() {
        super();
        this.service = new ProductService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.service.create(req.body);
            return res.status(201).json({
                message: i18n.__('PRODUCT_CREATED_SUCCESSFULLY'),
                result,
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        // GET by ID implementation
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        // UPDATE implementation
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        // DELETE implementation
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        // GET all with pagination implementation
    };
}
```

**Features:**
- Extends `BaseController` for common patterns
- i18n support for all messages
- Proper HTTP status codes
- Error handling with `next()`

### Routes (`src/routes/productRoutes.ts`)

```typescript
export class ProductRoutes extends BaseRouter {
    constructor() {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        const controller = new ProductController();
        const validator = new ProductValidator();

        // POST /api/v1/product - Create
        this.router.post(
            '/',
            authMiddleware,
            validator.create,
            controller.create
        );

        // GET /api/v1/product - Get all
        this.router.get(
            '/',
            authMiddleware,
            controller.getAll
        );

        // GET /api/v1/product/:id - Get by ID
        this.router.get(
            '/:id',
            authMiddleware,
            controller.getById
        );

        // PUT /api/v1/product/:id - Update
        this.router.put(
            '/:id',
            authMiddleware,
            validator.update,
            controller.update
        );

        // DELETE /api/v1/product/:id - Delete
        this.router.delete(
            '/:id',
            authMiddleware,
            controller.delete
        );
    }
}
```

**Features:**
- RESTful route conventions
- Authentication middleware
- Validation on create/update only
- Follows Express Router pattern

### Validator (`src/validators/productValidator.ts`)

```typescript
export class ProductValidator {
    create = [
        body('name')
            .isString().withMessage(i18n.__('validator.MUST_BE_A_STRING'))
            .notEmpty().withMessage(i18n.__('validator.NAME_REQUIRED')),
        body('price')
            .isFloat({ min: 0 }).withMessage(i18n.__('validator.MUST_BE_POSITIVE')),
        body('stock')
            .toInt().isInt({ min: 0 }).withMessage(i18n.__('validator.MUST_BE_POSITIVE')),
        body('categoryId')
            .toInt().isInt().withMessage(i18n.__('validator.MUST_BE_INTEGER')),
        validate,
    ];

    update = [
        body('name')
            .optional()
            .isString().withMessage(i18n.__('validator.MUST_BE_A_STRING')),
        body('price')
            .optional()
            .isFloat({ min: 0 }).withMessage(i18n.__('validator.MUST_BE_POSITIVE')),
        validate,
    ];
}
```

**Features:**
- Uses `express-validator`
- i18n error messages
- Required fields on create
- Optional fields on update
- Type coercion (string to int)

### Tests

#### Controller Unit Test

```typescript
describe('ProductController', () => {
    let controller: ProductController;

    beforeEach(() => {
        controller = new ProductController();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create product successfully', async () => {
            const mockProduct = { id: 1, name: 'Test Product', price: 99.99 };
            (ProductService.prototype.create as jest.Mock)
                .mockResolvedValue(mockProduct);

            const req = mockRequest({ body: { name: 'Test Product' } });
            const res = mockResponse();
            
            await controller.create(req, res, mockNext);
            
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
});
```

#### Service Unit Test

```typescript
describe('ProductService', () => {
    let service: ProductService;

    beforeEach(() => {
        service = new ProductService();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create product successfully', async () => {
            const productData = { name: 'Test', price: 99.99 };
            const mockProduct = { id: 1, ...productData };
            
            (prisma.product.create as jest.Mock)
                .mockResolvedValue(mockProduct);
            
            const result = await service.create(productData);
            
            expect(result).toEqual(mockProduct);
        });
    });
});
```

#### Integration Test

```typescript
describe('Product Module - Integration Tests', () => {
    let authToken: string;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({ username: 'admin@test.com', password: '123456' });
        authToken = loginResponse.body.result.token;
    });

    it('should create product successfully', async () => {
        const response = await performanceTracker.measureApiCall(
            'Create Product',
            () => request(app)
                .post('/api/v1/product')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Test Product',
                    price: 99.99,
                    stock: 10,
                    categoryId: 1,
                })
                .expect(201)
        );

        expect(response.body.result).toHaveProperty('id');
    });
});
```

## Customization

### Modify Templates

Templates are located in `src/config/templates/`:

```
src/config/templates/
├── controller.ts           # Controller template
├── service.ts              # Service template
├── routes.ts               # Routes template
├── validator.ts            # Validator template
├── swaggerDefinition.ts    # Swagger schema template
├── swaggerPaths.ts         # Swagger paths template
├── controller.test.ts      # Controller test template
├── service.test.ts         # Service test template
└── test.ts                 # Integration test template
```

### Add Custom Methods

After generation, you can add custom methods:

```typescript
// src/services/productService.ts
export class ProductService extends BaseService<Product> {
    // ... generated methods ...

    // Custom method
    async getByCategory(categoryId: number): Promise<Product[]> {
        return await prisma.product.findMany({
            where: {
                categoryId,
                deletedAt: null,
            },
        });
    }

    async updateStock(id: number, quantity: number): Promise<Product> {
        return await prisma.product.update({
            where: { id },
            data: {
                stock: {
                    increment: quantity,
                },
            },
        });
    }
}
```

### Extend Validation

```typescript
// src/validators/productValidator.ts
export class ProductValidator {
    // ... generated validators ...

    // Custom validator
    checkStock = [
        body('productId')
            .toInt().isInt().withMessage(i18n.__('validator.MUST_BE_INTEGER')),
        body('quantity')
            .toInt()
            .isInt({ min: 1 }).withMessage(i18n.__('validator.MIN_QUANTITY')),
        validate,
    ];
}
```

### Add Custom Routes

```typescript
// src/routes/productRoutes.ts
protected initializeRoutes(): void {
    // ... generated routes ...

    // Custom routes
    this.router.get(
        '/category/:categoryId',
        authMiddleware,
        controller.getByCategory
    );

    this.router.post(
        '/:id/stock',
        authMiddleware,
        validator.checkStock,
        controller.updateStock
    );
}
```

## Templates

### Template Variables

Templates use placeholders that are replaced during generation:

| Placeholder | Description | Example |
|------------|-------------|---------|
| `{{MODEL_NAME}}` | Pascal case model name | Product |
| `{{model_name}}` | Camel case model name | product |
| `{{MODEL_NAME_LOWER}}` | Lowercase model name | product |
| `{{MODEL_NAME_PLURAL}}` | Plural form | products |
| `{{FIELDS}}` | Model fields | name, price, stock |
| `{{TYPES}}` | Field types | string, number |

### Creating Custom Templates

1. Create template file in `src/config/templates/`
2. Use placeholders for dynamic content
3. Update `generate-files.ts` to use your template

Example custom template:

```typescript
// src/config/templates/dto.ts
export const dtoTemplate = `
export interface {{MODEL_NAME}}DTO {
    {{FIELDS_WITH_TYPES}}
}

export interface Create{{MODEL_NAME}}DTO extends Omit<{{MODEL_NAME}}DTO, 'id' | 'createdAt' | 'updatedAt'> {}

export interface Update{{MODEL_NAME}}DTO extends Partial<Create{{MODEL_NAME}}DTO> {}
`;
```

## Best Practices

### 1. Use Generator for Consistency

✅ **Do:** Use the generator for all new modules
```bash
npm run generate
```

❌ **Don't:** Manually create files for new modules

### 2. Customize After Generation

✅ **Do:** Generate first, then customize
```bash
1. npm run generate
2. Add custom methods to generated files
3. Run tests
```

❌ **Don't:** Edit templates unless building a reusable pattern

### 3. Keep Prisma Schema Clean

✅ **Do:** Use clear model definitions
```prisma
model Product {
  id    Int    @id @default(autoincrement())
  name  String @db.VarChar(255)
  
  // Relation starts here
  orders Order[]
}
```

❌ **Don't:** Mix fields and relations without comment marker

### 4. Test Generated Code

✅ **Do:** Run tests immediately after generation
```bash
npm run generate
npm test -- product
```

❌ **Don't:** Skip testing generated code

### 5. Version Control Templates

✅ **Do:** Commit template changes
```bash
git add src/config/templates/
git commit -m "Update controller template"
```

❌ **Don't:** Modify templates without version control

### 6. Document Custom Changes

✅ **Do:** Document customizations
```typescript
// Custom method added for business requirement #123
async getActiveProducts(): Promise<Product[]> {
    // implementation
}
```

## Troubleshooting

### Model Not Found

**Error:** `Model Product not found in schema.prisma`

**Solution:**
1. Check model name spelling in schema
2. Ensure schema.prisma is in correct location
3. Run `npx prisma generate` to update Prisma client

### Invalid Field Type

**Error:** `Unknown type: CustomType`

**Solution:**
Use Prisma-supported types:
- String
- Int
- Float
- Boolean
- DateTime
- Json

### Generator Hangs

**Solution:**
1. Stop with Ctrl+C
2. Check for syntax errors in schema
3. Ensure no circular dependencies

### Tests Fail After Generation

**Solution:**
1. Run `npm run prisma:generate`
2. Update database: `npm run prisma:migrate`
3. Seed test data: `npm run seed`
4. Check authentication in integration tests

## Advanced Usage

### Batch Generation

Generate multiple modules:

```bash
# Create script: scripts/generate-all.sh
#!/bin/bash

models=("Product" "Category" "Order" "Customer")

for model in "${models[@]}"; do
  echo "Generating $model..."
  echo -e "1\n$model\n1" | npm run generate
done
```

### Custom Generator Script

```typescript
// scripts/custom-generator.ts
import { generateModule } from './generate-files';

const modules = [
    { name: 'Product', features: ['crud', 'search', 'export'] },
    { name: 'Order', features: ['crud', 'workflow'] },
];

modules.forEach(module => {
    generateModule(module.name, module.features);
});
```

## Additional Resources

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Express Validator Docs](https://express-validator.github.io/docs/)
- [Swagger/OpenAPI Spec](https://swagger.io/specification/)

For testing generated code, see [TESTING.md](./TESTING.md).

For performance optimization, see [BENCHMARKING.md](./BENCHMARKING.md).
