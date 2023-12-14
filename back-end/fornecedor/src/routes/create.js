import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'
import { fieldValidation, validaCNPJ } from '../middleware/valida-chamada.js'

const router = express.Router()

router.post('/fornecedor', fieldValidation, validaCNPJ, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const fornecedor = new Fornecedor()

            fornecedor.fornecedor_nome = req.body.nome
            fornecedor.fornecedor_cnpj = req.body.cnpj
            fornecedor.fornecedor_cod = req.body.codigo
            fornecedor.fornecedor_descr = req.body.descricao
            fornecedor.fornecedor_org = req.body.org

            await fornecedor.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Fornecedor criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar fornecedor.',
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
            'Não foi possíve criar fornecedor.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as createFornecedor }