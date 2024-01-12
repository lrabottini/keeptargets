import express from 'express';
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser';
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'

import { currentUserRouter } from './routes/current-user.js';
import { signinRouter } from './routes/signin.js';
import { signoutRouter } from './routes/signout.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.set('trust proxy', true);
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV === 'prod' }));
app.use(cookieParser())

// Rotas
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all('*', async (req, res) => {
    const message = new ExecutionMessage(
        MessageLevel.LEVEL_ERROR,
        ExecutionStatus.ERROR,
        ExecutionTypes.PATH,
        'Ops.',
        req.url,
        {} 
    )
    res.send(message)
});

export { app }