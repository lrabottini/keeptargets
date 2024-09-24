import express from 'express';

import { createStatus } from './routes/create.js'
import { deleteStatus } from './routes/delete.js'
import { listOneStatus } from './routes/list-one.js'
import { listAllStatus } from './routes/list-all.js'
import { updateStatus } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOneStatus)
app.use(listAllStatus)
app.use(createStatus)
app.use(deleteStatus)
app.use(updateStatus)

export { app }