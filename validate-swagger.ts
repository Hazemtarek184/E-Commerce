import swaggerJsdoc from 'swagger-jsdoc';
import swaggerConfig from './src/config/swagger';

try {
    const spec = swaggerConfig as any;
    console.log("Swagger generation successful.");
    const paths = spec.paths || {};

    if (paths['/service-providers/{subCategoryId}']) {
        console.log("Path /service-providers/{subCategoryId} EXISTS.");
        console.log("Methods:", Object.keys(paths['/service-providers/{subCategoryId}']));
    } else {
        console.error("Path /service-providers/{subCategoryId} is MISSING!");
    }
} catch (error) {
    console.error("Swagger generation failed:", error);
}
