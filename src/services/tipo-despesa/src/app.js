import express from 'express';
import cookieSession from 'cookie-session'

import { createTipoDespesa } from './routes/create.js'
import { deleteTipoDespesa } from './routes/delete.js'
import { listOneTipoDespesa } from './routes/list-one.js'
import { listAllTipoDespesa } from './routes/list-all.js'
import { updateTipoDespesa } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV === 'prod' }));

app.set('trust proxy', true);

app.use(listOneTipoDespesa)
app.use(listAllTipoDespesa)
app.use(createTipoDespesa)
app.use(deleteTipoDespesa)
app.use(updateTipoDespesa)

export { app }