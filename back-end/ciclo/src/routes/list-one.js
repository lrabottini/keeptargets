import express from 'express'
import { Ciclo } from '../models/ciclo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'

const router = express.Router()

router.get('/ciclo/:id', async (req, res) => {
    try {
        await Ciclo.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Ciclo não encontrado.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar ciclo.',
            req.params,
            e.stack 
        )
        res.send(message)
    }

})

export { router as listOneCiclo }