import express from 'express'
import mongoose from 'mongoose'

import { validationResult } from 'express-validator'
import { fieldValidation, hasOrg } from '../middleware/valida-chamada.js'
import { Ciclo } from '../models/ciclo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel, toFormattedDate } from '@keeptargets/common'

const router = express.Router()

router.post('/ciclo', fieldValidation, hasOrg, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const ciclo = new Ciclo()

            ciclo.ciclo_org = new mongoose.Types.ObjectId(req.body.org)
            ciclo.ciclo_name = req.body.name
            ciclo.ciclo_start = toFormattedDate(req.body.start)
            ciclo.ciclo_end = toFormattedDate(req.body.end)
            ciclo.ciclo_situacao = new mongoose.Types.ObjectId(req.body.situacao)

            await ciclo.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Ciclo criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_ERROR,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar ciclo.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const error = [{
            type: e.name,
            value: '',
            msg: e.message,
            path: e.stack,
            location: ''
        }]

        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Não foi possível criar ciclo.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as createCiclo }