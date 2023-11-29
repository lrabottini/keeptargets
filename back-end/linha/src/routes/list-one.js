import express from 'express'
import { Linha } from '../models/linha.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'

const router = express.Router()

router.get('/linha/:id', async (req, res) => {
    try {
        await Linha.findLinha(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Linha não encontrada.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar linha.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listOneLinha }