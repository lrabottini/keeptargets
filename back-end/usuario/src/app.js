import express from 'express';
import cookieSession from 'cookie-session';

import { createUsuario } from './routes/create.js'
import { deleteUsuario } from './routes/delete.js'
import { listOneUsuario } from './routes/list-one.js'
import { listAllUsuario } from './routes/list-all.js'
import { updateUsuario } from './routes/update.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.set('trust proxy', true);
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }));

app.use(listOneUsuario)
app.use(listAllUsuario)
app.use(createUsuario)
app.use(deleteUsuario)
app.use(updateUsuario)

app.all('*', async (req, res) => {
  throw new Error();
});

export { app }