const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/parkings', async (req, res) => {
    try {
        const response = await fetch('http://api_server:5000/parkings');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des parkings' });
    }
});

app.listen(PORT, () => {
    console.log(`Frontend running at http://0.0.0.0:${PORT}`);
});
