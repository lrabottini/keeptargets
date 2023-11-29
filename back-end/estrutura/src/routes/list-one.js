import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'

const router = express.Router()

router.get('/estrutura/:id', async (req, res) => {
    try {
        await Estrutura.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Estrutura não encontrada.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar estrutura.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listOneEstrutura }