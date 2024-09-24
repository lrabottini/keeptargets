import express from 'express'
import { validationResult } from 'express-validator'

import { Periodo } from '../models/periodo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'


const router = express.Router()

router.delete('/periodo/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Periodo.deleteOne({ _id: req.params.id })

            message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.DELETE,
                'Periodo excluído com sucesso.',
                req.params,
                result.array()
            )
        } else {
            message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir período.',
                req.params,
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionType.DELETE,
            'Erro ao excluir período.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deletePeriodo }