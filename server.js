// import packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const cors = require('cors');
const morgan = require('morgan');
const FileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
// const rfs = require('rotating-file-stream');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");

// create a rotating write stream
/*var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});*/

// https://sodocumentation.net/express/topic/7191/logging
const logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
})

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Swagger for Shop API',
        version: '1.0.0',
        description:
            'This is a REST API application made with Express. It is demo shop api.',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
            name: 'Stanley-Kemuel Lloyd Kemuel',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
// call express app
const app = express();
app.use(express.json());
app.use(cors());


// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.get('/', (req, res) => {
    return res.status(200).json({status: true, message: 'Welcome to shop api', data: null});
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // swagger routes
app.use('/api',authRoutes);
app.use('/api',itemRoutes);
app.use('/api',cartRoutes);
app.use('/api',orderRoutes);

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
    .then((result) => app.listen(port, () => console.log(`Ecommerce server started at port ${port}`)))
    .catch((err) => console.log(err));

// https://github.com/shubham1710/MERN-E-Commerce/blob/master/server.js
