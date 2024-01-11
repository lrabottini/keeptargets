import express from 'express'
import { Linha } from '../models/linha.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'

const router = express.Router()

router.get('/linha/:id', async (req, res) => {
    try {
        await Linha.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Linha não encontrada.',
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
            'Erro ao buscar linha.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listOneLinha }