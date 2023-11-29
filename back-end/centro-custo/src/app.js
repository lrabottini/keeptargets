import express from 'express';

import { createCentroCusto } from './routes/create.js'
import { deleteCentroCusto } from './routes/delete.js'
import { listOneCentroCusto } from './routes/list-one.js'
import { listAllCentroCusto } from './routes/list-all.js'
import { updateCentroCusto } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneCentroCusto)
app.use(listAllCentroCusto)
app.use(createCentroCusto)
app.use(deleteCentroCusto)
app.use(updateCentroCusto)

export { app }