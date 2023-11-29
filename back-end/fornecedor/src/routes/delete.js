import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'

const router = express.Router()

router.delete('/fornecedor/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await Fornecedor.deleteOne({ _id: req.params.id }) 

            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Fornecedor não encontrado.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Fornecedor excluído com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir fornecedor.',
                req.params,
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Não foi possível excluir fornecedor.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteFornecedor }