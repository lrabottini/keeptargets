import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Classificacao } from '../models/classificacao.js'

const router = express.Router()

router.delete('/classificacao/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await Classificacao.deleteOne({ _id: req.params.id }) 
            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Classificação não encontrada.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Classificação excluída com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_ERROR,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir classificação.',
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
            'Não foi possível excluir classificação.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteClassificacao }