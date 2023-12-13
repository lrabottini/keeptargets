import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Situacao } from '../models/situacao.js'

const router = express.Router()

router.delete('/situacao/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await Situacao.deleteOne({ _id: req.params.id }) 

            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Situação não encontrada.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Situação excluída com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir situação.',
                req.params,
                result.array()
            )
        }
        res.send(message)
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
            ExecutionTypes.DELETE,
            'Não foi possível excluir situação.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as del }