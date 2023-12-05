import express from 'express'
import { childrenValidation } from '../middleware/valida-chamada.js'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Versao } from '../models/versao.js'

const router = express.Router()

router.delete('/versao/:id', childrenValidation, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Versao.deleteOne({ _id: req.params.id })

            message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.DELETE,
                'Versão excluída com sucesso.',
                req.params,
                result.array()
            )
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível excluir versão.',
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
            'Não foi possível excluir versão.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteVersao }