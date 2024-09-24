import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel, toFormattedDate } from '@keeptargets/common'
import { PlanoComercial } from '../models/plano-comercial.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/planocomercial', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const plano = new PlanoComercial()

            plano.plano_condicoes = req.body.condicoes
            plano.plano_nome = req.body.nome
            plano.plano_valor = req.body.valor

            await plano.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Plano criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar plano.',
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
            'Não foi possível criar plano.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as create }