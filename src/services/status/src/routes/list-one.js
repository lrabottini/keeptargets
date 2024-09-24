import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Status } from '../models/status.js'

const router = express.Router()

router.get('/status/:id', async (req, res) => {
    try {
        await Status.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Status não encontrado.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Não foi possível buscar o status.',
            req.params,
            e.stack 
        )
        res.send(message)
    }

})

export { router as listOneStatus }