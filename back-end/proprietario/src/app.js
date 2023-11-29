import express from 'express';

import { createProprietario } from './routes/create.js'
import { deleteProprietario } from './routes/delete.js'
import { listOneProprietario } from './routes/list-one.js'
import { listAllProprietario } from './routes/list-all.js'
import { updateProprietario } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneProprietario)
app.use(listAllProprietario)
app.use(createProprietario)
app.use(deleteProprietario)
app.use(updateProprietario)

export { app }