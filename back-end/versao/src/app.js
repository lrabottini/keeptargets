import express from 'express';

import { createVersao } from './routes/create.js'
import { deleteVersao } from './routes/delete.js'
import { listOneVersao } from './routes/list-one.js'
import { listAllVersao } from './routes/list-all.js'
import { updateVersao } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneVersao)
app.use(listAllVersao)
app.use(createVersao)
app.use(deleteVersao)
app.use(updateVersao)

export { app }