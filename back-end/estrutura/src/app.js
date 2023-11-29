import express from 'express';

import { createEstrutura } from './routes/create.js'
import { deleteEstrutura } from './routes/delete.js'
import { listOneEstrutura } from './routes/list-one.js'
import { listAllEstrutura } from './routes/list-all.js'
import { updateEstrutura } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneEstrutura)
app.use(listAllEstrutura)
app.use(createEstrutura)
app.use(deleteEstrutura)
app.use(updateEstrutura)

export { app }