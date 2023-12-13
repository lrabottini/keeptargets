import express from 'express';

import { createPerfil } from './routes/create.js'
import { deletePerfil } from './routes/delete.js'
import { listOnePerfil } from './routes/list-one.js'
import { listAllPerfil } from './routes/list-all.js'
import { updatePerfil } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOnePerfil)
app.use(listAllPerfil)
app.use(createPerfil)
app.use(deletePerfil)
app.use(updatePerfil)

export { app }