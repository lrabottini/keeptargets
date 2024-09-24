import express from 'express';

import { createCiclo } from './routes/create.js'
import { deleteCiclo } from './routes/delete.js'
import { listOneCiclo } from './routes/list-one.js'
import { listAllCiclo } from './routes/list-all.js'
import { updateCiclo } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneCiclo)
app.use(listAllCiclo)
app.use(createCiclo)
app.use(deleteCiclo)
app.use(updateCiclo)

export { app }