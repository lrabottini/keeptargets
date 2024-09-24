import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { PlanoComercial } from '../models/plano-comercial.js'

const router = express.Router()

router.delete('/planocomercial/:id', validaUso, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            const d = await PlanoComercial.deleteOne({ _id: req.params.id }) 

            if (d.deletedCount === 0) {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.DELETE,
                    'Plano Comercial não encontrada.',
                    req.params,
                    result.array()
                )
            } else {
                message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.DELETE,
                    'Plano Comercial excluído com sucesso.',
                    req.params,
                    result.array()
                )
            }
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir plano comercial.',
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
            'Não foi possível excluir plano comercial.',
            req.params,
            error
        )
        res.send(message)
    }
})

export { router as del }