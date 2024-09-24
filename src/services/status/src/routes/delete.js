import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Status } from '../models/status.js'

const router = express.Router()

router.delete('/status/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await Status.deleteOne({ _id: req.params.id }) 
            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Status não encontrado.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Status excluído com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_ERROR,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir o status.',
                req.params,
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionType.DELETE,
            'Não foi possível excluir o status.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteStatus }