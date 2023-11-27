import express from 'express'
import { Periodo } from '../models/periodo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'

const router = express.Router()

router.get('/periodo/:id', async (req, res) => {
    try {
        await Periodo.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Período não encontrado.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar período.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listOnePeriodo }