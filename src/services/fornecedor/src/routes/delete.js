import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'
import { validaUso } from '../middleware/valida-chamada.js'

const router = express.Router()

router.delete('/fornecedor/:id', validaUso, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await Fornecedor.deleteOne({ _id: req.params.id }) 

            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Fornecedor não encontrado.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Fornecedor excluído com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_ERROR,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir fornecedor.',
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
            'Não foi possível excluir fornecedor.',
            req.params,
            error
        )
        res.send(message)
    }
})

export { router as deleteFornecedor }