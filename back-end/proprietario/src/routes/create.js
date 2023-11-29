import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Proprietario } from '../models/proprietario.js'

const router = express.Router()

router.post('/proprietario', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const proprietario = new Proprietario()

            proprietario.prop_cod = req.body.codigo
            proprietario.prop_nome = req.body.nome
            proprietario.prop_role = req.body.role

            await proprietario.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Proprietário criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar proprietário.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Não foi possíve criar proprietário.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createProprietario }