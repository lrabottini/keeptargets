import express from 'express';

import { create } from './routes/create.js'
import { del } from './routes/delete.js'
import { listOne } from './routes/list-one.js'
import { listAll } from './routes/list-all.js'
import { update } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

app.use(listOne)
app.use(listAll)
app.use(create)
app.use(del)
app.use(update)

export { app }