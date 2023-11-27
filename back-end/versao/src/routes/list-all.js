import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus } from '@keeptargets/common'
import { Periodo } from '../models/periodo.js'

const router = express.Router()

router.get('/periodo', async (req, res) => {
    try {
        const periodo = await Periodo.find()

        res.send(periodo)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Erro ao buscar períodos.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllPeriodo }