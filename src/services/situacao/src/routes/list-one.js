import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Situacao } from '../models/situacao.js'

const router = express.Router()

router.get('/situacao/:id', async (req, res) => {
    try {
        await Situacao.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Situação não encontrada.',
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
            MessageLevel.LEVEL_INFO,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Não foi possível buscar situação.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listOne }