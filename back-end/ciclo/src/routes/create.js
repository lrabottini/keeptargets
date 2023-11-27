import express from 'express'
import mongoose from 'mongoose'

import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { Ciclo } from '../models/ciclo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'

const router = express.Router()

router.post('/ciclo', fieldValidation, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const ciclo = new Ciclo()

            ciclo.ciclo_org = new mongoose.Types.ObjectId(req.body.org)
            ciclo.ciclo_name = req.body.name
            ciclo.ciclo_start = toFormattedDate(req.body.start)
            ciclo.ciclo_end = toFormattedDate(req.body.end)
            ciclo.ciclo_status = req.body.status

            await ciclo.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Ciclo criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar ciclo.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Erro ao criar ciclo.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createCiclo }