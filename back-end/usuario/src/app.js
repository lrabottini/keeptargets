import express from 'express';

import { createUsuario } from './routes/create.js'
import { deleteUsuario } from './routes/delete.js'
import { listOneUsuario } from './routes/list-one.js'
import { listAllUsuario } from './routes/list-all.js'
import { updateUsuario } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneUsuario)
app.use(listAllUsuario)
app.use(createUsuario)
app.use(deleteUsuario)
app.use(updateUsuario)

export { app }