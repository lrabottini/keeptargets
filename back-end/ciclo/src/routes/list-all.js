import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Ciclo } from '../models/ciclo.js'

const router = express.Router()

router.get('/ciclo/', async (req, res) => {
    try {
        const ciclo = await Ciclo.listaCiclos(req.query.org)

        res.send(ciclo)
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
            ExecutionTypes.DELETE,
            'Erro ao buscar ciclos.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllCiclo }