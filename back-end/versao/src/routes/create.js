import express from 'express'
import mongoose from 'mongoose'

import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'
import { Versao } from '../models/versao.js'

const router = express.Router()

router.post('/versao', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const versao = new Versao()

            versao.versao_nr = req.body.versao_nr
            versao.versao_linhas = 0
            versao.versao_valor_total = 0
            versao.versao_situacao = req.body.situacao

            await versao.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Versão criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
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
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Erro ao criar versão.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createVersao }