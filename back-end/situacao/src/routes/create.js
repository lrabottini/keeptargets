import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import mongoose from 'mongoose'
import { Situacao } from '../models/situacao.js'

const router = express.Router()

router.post('/situacao', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const situacao = new Situacao()

            situacao.situacao_org = 0
            situacao.situacao_codigo = req.body.codigo
            situacao.situacao_default = req.body.default
            situacao.situacao_descr = req.body.descr
            situacao.situacao_nome = req.body.nome
            situacao.situacao_objeto = req.body.objeto

            await situacao.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Situacao criada com sucesso.',
                situacao,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar situacao.',
                {},
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
            'Não foi possíve criar situacao.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as create }