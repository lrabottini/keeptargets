import express from 'express';

import { createFornecedor } from './routes/create.js'
import { deleteFornecedor } from './routes/delete.js'
import { listOneFornecedor } from './routes/list-one.js'
import { listAllFornecedor } from './routes/list-all.js'
import { updateFornecedor } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneFornecedor)
app.use(listAllFornecedor)
app.use(createFornecedor)
app.use(deleteFornecedor)
app.use(updateFornecedor)

export { app }