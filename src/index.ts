import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config.js";
import bodyParser from 'body-parser';
import categoryRouter from './categories/categoryRouter';
import userRouter from './users/userRouter';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGOURI = process.env.MONGO_CONNECTION_URI;

app.use(cors()); // Allow all origins for CORS
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/", categoryRouter);
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