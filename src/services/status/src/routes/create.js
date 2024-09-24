import express from 'express'
import mongoose from 'mongoose'

import { validationResult } from 'express-validator'
import { validaCampos, validaParametros } from '../middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Status } from '../models/status.js'

const router = express.Router()

router.post('/status', validaParametros, validaCampos, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const status = new Status()

            status.status_entidade = req.body.entidade
            status.status_nome = req.body.nome
            status.status_org = mongoose.Types.ObjectId(req.body.org)

            await status.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Status criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_ERROR,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar o status.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Não foi possível criar o status.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createStatus }