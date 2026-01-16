import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config.js";
import categoryRouter from './main-categories/categoryRouter';
import subCategoryRouter from './sub-categories/subCategoryRouter';
import userRouter from './users/userRouter';
import serviceProviderRouter from './service-provider/serviceProviderRouter';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGOURI = process.env.MONGO_CONNECTION_URI;

app.use(cors());
// app.options('(.*)', cors()); // Enable pre-flight for all routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/", categoryRouter);
app.use("/api/", subCategoryRouter);
app.use("/api/", serviceProviderRouter);
app.use("/api/", userRouter);

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";
const JS_URL = [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.min.js"
];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customJs: JS_URL
}));

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

// Connect to MongoDB
if (!MONGOURI) {
    console.error("Missing MONGO_CONNECTION_URI environment variable");
    process.exit(1);
}

// Create a connection function
const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURI);
        console.log("Connected to the database.");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the Express API
export default app;