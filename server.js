require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json())
const userRoute = require('./routes/user');

app.use('/users', userRoute);

app.listen(PORT, () => {
    console.log(`listen on ${PORT}`);
});