import express from 'express'

import { validationResult } from 'express-validator'
import { validaCampos, validaParametros } from '../middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { TipoDespesa } from '../models/tipo-despesa.js'

const router = express.Router()

router.post('/tipodespesa', validaCampos, validaParametros, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const tipoDespesa = new TipoDespesa()

            tipoDespesa.tipodespesa_cod = req.body.codigo
            tipoDespesa.tipodespesa_descr = req.body.descricao
            tipoDespesa.tipodespesa_org = req.body.org

            await tipoDespesa.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Tipo de despesa criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar tipo de despesa.',
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
            'Não foi possível criar tipo de despesa.',
            {
                params: req.params,
                body: req.body 
            },
            error 
        )
        res.send(message)
    }
})

export { router as createTipoDespesa }