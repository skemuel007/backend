// import packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const cors = require('cors');

// call express app
const app = express();
app.use(express.json());
app.use(cors());

// set up server to serve static file content, i.e. react
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

// connecting to mongoDB and then running server on port 4000
const dbURI = config.get('dbURI');
const port = process.env.PORT || 3000;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
    .then((result) => app.listen(port, () => 'Ecommerce server started'))
    .catch((err) => console.log(err));
