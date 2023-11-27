import express from 'express';

import { createPeriodo } from './routes/create.js'
import { deletePeriodo } from './routes/delete.js'
import { listOnePeriodo } from './routes/list-one.js'
import { listAllPeriodo } from './routes/list-all.js'
import { updatePeriodo } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOnePeriodo)
app.use(listAllPeriodo)
app.use(createPeriodo)
app.use(deletePeriodo)
app.use(updatePeriodo)

export { app }