import express from 'express';
import cookieSession from 'cookie-session'
//import cookieParser from 'cookie-parser';

import { currentUserRouter } from './routes/current-user.js';
import { signinRouter } from './routes/signin.js';
import { signoutRouter } from './routes/signout.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.set('trust proxy', true);
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV === 'prod' }));
//app.use(cookieParser())

// Rotas
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all('*', async (req, res) => {
    throw new Error();
});

export { app }