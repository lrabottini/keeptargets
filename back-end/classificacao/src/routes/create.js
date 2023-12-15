import express from 'express'
import mongoose from 'mongoose'

import { validationResult } from 'express-validator'
import { validaCampos, validaParametros } from '../middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Classificacao } from '../models/classificacao.js'

const router = express.Router()

router.post('/classificacao', validaParametros, validaCampos, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const classificacao = new Classificacao()

            classificacao.classificacao_org = new mongoose.Types.ObjectId(req.body.org)
            classificacao.classificacao_nome = req.body.nome

            await classificacao.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Classificação criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_ERROR,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar classificação.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const error = [{
            type: e.name,
            value: '',
            msg: e.message,
            path: e.stack,
            location: ''
        }]

        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Não foi possível criar classificação.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as createClassificacao }