import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { validaParametros } from '../middleware/valida-chamada.js'
import { Status } from '../models/status.js'

const router = express.Router()

router.get('/status/', validaParametros, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const status = await Status.find({ status_org: req.query.org })

            res.send(status)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível buscar o status.',
                req.query,
                result.array() 
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Não foi possível buscar o status.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllStatus }