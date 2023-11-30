import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Versao } from '../models/versao.js'

const router = express.Router()

router.delete('/versao/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Versao.deleteOne({ _id: req.params.id })

            message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.DELETE,
                'Versão excluída com sucesso.',
                req.params,
                result.array()
            )
        } else {
            message = new ExecutionMessage(
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
            ExecutionStatus.ERROR,
            ExecutionType.DELETE,
            'Erro ao excluir versão.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as deleteVersao }