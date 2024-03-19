const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const houseRoutes = require('./routes/houses'); // Mongoose modeli

const app = express();

app.use(express.json()); // JSON istek gövdelerini ayrıştırmak için
app.use(cors());

mongoose.connect('mongodb://localhost:27017/realestate')
.then(() => {
    console.log('MongoDB connection successful');
  });

app.use('/api/houses', houseRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
