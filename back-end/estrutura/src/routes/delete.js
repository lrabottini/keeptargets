import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'

const router = express.Router()

router.delete('/estrutura/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await Estrutura.deleteOne({ _id: req.params.id }) 

            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Estrutura não encontrada.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Estrutura excluída com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir estrutura.',
                req.params,
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Não foi possível excluir estrutura.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteEstrutura }