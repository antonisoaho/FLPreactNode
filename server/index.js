const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoute = require('./routes/Users');
const customerRoute = require('./routes/Customers');
const loginRoute = require('./routes/Login');
const { auth } = require('./middleware/auth');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

// express app
const app = express();
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(cors());

//config
dotenv.config();

const dbURI = process.env.DB_URI;
const port = process.env.PORT || 3001;

// connect to mongodb
mongoose
  .connect(dbURI)
  .then(() => {
    console.log('Listening for requests..');
    app.listen(port);
  })
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(morgan('dev'));

// middleware to parse JSON and handle form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/customers', auth, customerRoute);
app.use('/users', auth, userRoute);
app.use('/login', loginRoute);
