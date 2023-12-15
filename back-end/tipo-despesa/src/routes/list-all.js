import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { TipoDespesa } from '../models/tipo-despesa.js'
import { validationResult } from 'express-validator'
import { validaParametros } from '../middleware/valida-chamada.js'

const router = express.Router()

router.get('/tipodespesa/', validaParametros, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const tipoDespesa = await TipoDespesa.find({ tipodespesa_org: req.query.org })

            res.send(tipoDespesa)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível buscar tipos de despesa.',
                req.query,
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
            ExecutionTypes.LIST,
            'Não foi possível buscar tipos de despesa.',
            req.params,
            error 
        )

        res.send(message)
    }
})

export { router as listAllTipoDespesa }