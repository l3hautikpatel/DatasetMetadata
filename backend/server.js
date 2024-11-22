const express = require('express');
const connectDB = require('./src/config/db');
const datasetRoutes = require('./src/routes/datasetRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/datasets', datasetRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});