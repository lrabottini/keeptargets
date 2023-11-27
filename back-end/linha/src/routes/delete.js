import express from 'express'
import { validationResult } from 'express-validator'

import { Linha } from '../models/linha.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'


const router = express.Router()

router.delete('/linha/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await Linha.deleteOne({ _id: req.params.id }) 
            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Linha não encontrada.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Linha excluída com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir linha.',
                req.params,
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Erro ao excluir linha.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteLinha }