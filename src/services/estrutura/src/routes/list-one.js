import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
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
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Estrutura não encontrada.',
                    req.params,
                    []
                )
                res.send(message)
            })

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
            'Erro ao buscar estrutura.',
            req.params,
            error
        )
        res.send(message)
    }
})

export { router as listOneEstrutura }