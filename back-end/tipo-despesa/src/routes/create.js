import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { TipoDespesa } from '../models/tipo-despesa.js'

const router = express.Router()

router.post('/tipodespesa', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const tipoDespesa = new TipoDespesa()

            tipoDespesa.tipodespesa_cod = req.body.codigo
            tipoDespesa.tipodespesa_descr = req.body.descricao

            await tipoDespesa.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Tipo de despesa criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar tipo de despesa.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Erro ao criar tipo de despesa.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createTipoDespesa }