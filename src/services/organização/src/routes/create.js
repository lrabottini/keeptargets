import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel, toFormattedDate } from '@keeptargets/common'
import { fieldValidation, validaCNPJ } from '../middleware/valida-chamada.js'
import { Organizacao } from '../models/organizacao.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/organizacao', fieldValidation, validaCNPJ, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const organizacao = new Organizacao()

            organizacao.organizacao_nome = req.body.nome
            organizacao.organizacao_cnpj = req.body.cnpj
            organizacao.organizacao_situacao = new mongoose.Types.ObjectId(req.body.situacao)
            organizacao.organizacao_plano = req.body.plano
            organizacao.organizacao_data_expiração = toFormattedDate(req.body.expiracao)
            organizacao.organizacao_responsavel = new mongoose.Types.ObjectId(req.body.responsavel)

            await organizacao.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Organizacao criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar organizacao.',
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
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Não foi possível criar organizacao.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as create }