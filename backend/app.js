require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const { notFoundRoute } = require('./routes/notFound');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { signUpValidation, signInValidation } = require('./middlewares/validation');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);
app.post('/signin', signInValidation, login);
app.post('/signup', signUpValidation, createUser);

app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);
app.use('*', auth, notFoundRoute);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
