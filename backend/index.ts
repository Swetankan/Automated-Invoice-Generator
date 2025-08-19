import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// We are now importing the routes we created
import invoiceRoutes from './routes/invoices'; 

// Load environment variables from a .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Allows requests from your frontend (running on http://localhost:3000)
app.use(cors()); 
// Allows the server to understand and process incoming JSON data
app.use(express.json()); 

// --- API Routes ---
// This line is now active and connects your routes to the server
app.use('/api/invoices', invoiceRoutes);

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// --- Database Connection ---
const mongoUri = process.env.MONGODB_URI;

// This is the full database connection code
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log("Successfully connected to MongoDB");
      // Start the server only after the database connection is successful
      app.listen(PORT, () => {
        console.log(`Backend server is running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
} else {
    // If the .env file is missing or MONGODB_URI is not set, exit the process
    console.error("MongoDB URI is not defined. Please add it to your .env file.");
    process.exit(1);
}
