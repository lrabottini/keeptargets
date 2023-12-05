import express from 'express'
import { validationResult } from 'express-validator'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Versao } from '../models/versao.js'
import { fieldValidation } from '../middleware/valida-chamada.js'

const router = express.Router()

router.post('/versao', fieldValidation, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const versao = new Versao()

            versao.versao_nome = req.body.nome
            versao.versao_situacao = req.body.situacao
            versao.versao_ciclo = req.body.ciclo

            await versao.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Versão criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar versão.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Não foi possível criar versão.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createVersao }