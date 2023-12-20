import express from 'express';

import { createLinha } from './routes/create.js'
import { deleteLinha } from './routes/delete.js'
//import { listOneLinha } from './routes/list-one.js'
import { listAllLinha } from './routes/list-all.js'
import { updateLinha } from './routes/update.js'

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('trust proxy', true);

//app.use(listOneLinha)
app.use(listAllLinha)
app.use(createLinha)
app.use(deleteLinha)
app.use(updateLinha)

export { app }