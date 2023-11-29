import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'

const router = express.Router()

router.post('/fornecedor', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const fornecedor = new Fornecedor()

            fornecedor.forn_cod = req.body.codigo
            fornecedor.forn_descr = req.body.descricao

            await fornecedor.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Fornecedor criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar fornecedor.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Não foi possíve criar fornecedor.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createFornecedor }