const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoute = require('./routes/Users');
const customerRoute = require('./routes/Customers');
const loginRoute = require('./routes/Login');
const { auth } = require('./middleware/auth');
const dotenv = require('dotenv');
const cors = require('cors');

let dbURI;
// express app
const app = express();
//config
dotenv.config();

if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `http://localhost:8000`, credentials: true }));
  dbURI = process.env.DB_URI_DEV;
} else {
  app.use(
    cors({
      origin: 'https://golife-frontend.onrender.com',
    })
  );
  dbURI = process.env.DB_URI;
}

app.use(cors());

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
