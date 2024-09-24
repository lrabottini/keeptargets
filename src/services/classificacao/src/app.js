import express from 'express';

import { createClassificacao } from './routes/create.js'
import { deleteClassificacao } from './routes/delete.js'
import { listOneClassificacao } from './routes/list-one.js'
import { listAllClassificacao } from './routes/list-all.js'
import { updateClassificacao } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneClassificacao)
app.use(listAllClassificacao)
app.use(createClassificacao)
app.use(deleteClassificacao)
app.use(updateClassificacao)

export { app }