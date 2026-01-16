import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'API documentation for E-Commerce application',
        },
        servers: [
            {
                url: 'https://e-commerce-three-sigma-49.vercel.app/api',
                description: 'Production server',
            },
            {
                url: 'http://localhost:8000/api',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/main-categories/*.ts', './src/sub-categories/*.ts', './src/service-provider/*.ts', './src/users/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

const outputPath = path.join(__dirname, '../config/swagger-output.ts');

const fileContent = `export const swaggerSpec = ${JSON.stringify(swaggerSpec, null, 2)};`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log(`Swagger spec generated at ${outputPath}`);
