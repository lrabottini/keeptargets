import express from 'express'
import { validationResult } from 'express-validator'

import { Ciclo } from '../models/ciclo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'


const router = express.Router()

router.delete('/ciclo/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Ciclo.deleteOne({ _id: req.params.id })

            message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.DELETE,
                'Ciclo excluído com sucesso.',
                req.params,
                result.array()
            )
        } else {
            message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir estabelecimento.',
                req.params,
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionType.DELETE,
            'Erro ao excluir estabelecimento.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteCiclo }