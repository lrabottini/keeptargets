import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { TipoDespesa } from '../models/tipo-despesa.js'

const router = express.Router()

router.delete('/tipodespesa/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await TipoDespesa.deleteOne({ _id: req.params.id }) 

            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Tipo de despesa não encontrada.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Tipo de despesa excluída com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir tipo de despesa.',
                req.params,
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Não foi possível excluir tipo de despesa.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteTipoDespesa }