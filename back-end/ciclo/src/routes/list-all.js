import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus } from '@keeptargets/common'
import { Ciclo } from '../models/ciclo.js'

const router = express.Router()

router.get('/ciclo', async (req, res) => {
    try {
        const ciclo = await Ciclo.find()

        res.send(ciclo)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Erro ao buscar ciclos.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllCiclo }