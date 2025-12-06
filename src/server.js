const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Conectar a Base de Datos
connectDB();

const logRoutes = require('./routes/logRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', service: 'api-insights' }));
app.use('/api/insights', logRoutes);

const PORT = process.env.PORT || 3600;

app.listen(PORT, () => {
    console.log(`Insights API running on port ${PORT}`);
});
