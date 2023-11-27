import express from 'express'
import mongoose from 'mongoose'

import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { Periodo } from '../models/versao.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'

const router = express.Router()

router.post('/periodo', fieldValidation, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const periodo = new Periodo()

            periodo.periodo_ciclo = new mongoose.Types.ObjectId(req.body.org)
            periodo.periodo_name = req.body.name
            periodo.periodo_start = toFormattedDate(req.body.start)
            periodo.periodo_end = toFormattedDate(req.body.end)
            periodo.periodo_status = req.body.status

            await periodo.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Periodo criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar período.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Erro ao criar periodo.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createPeriodo }