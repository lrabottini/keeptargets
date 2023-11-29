import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Proprietario } from '../models/proprietario.js'

const router = express.Router()

router.delete('/proprietario/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await Proprietario.deleteOne({ _id: req.params.id }) 

            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Proprietário não encontrado.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Proprietário excluído com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir proprietário.',
                req.params,
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Não foi possível excluir proprietário.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteProprietario }