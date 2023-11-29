import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { TipoDespesa } from '../models/tipo-despesa.js'

const router = express.Router()

router.put('/tipodespesa/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await TipoDespesa.findById(req.params.id)
                .then((tipoDespesa) => {
                    tipoDespesa.set({
                        tipodespesa_cod: req.body.codigo,
                        tipodespesa_descr: req.body.descricao,
                    })
                    
                    tipoDespesa.save()
            
                    message = new ExecutionMessage(
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Tipo de despesa atualizado com sucesso.',
                        {
                            params: req.params,
                            attrs: req.body
                        },
                        result.array()
                    )
                })
        } else {
            message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.UPDATE,
                'Não foi possível atualizar tipo de despesa.',
                {
                    params: req.params,
                    attrs: req.body
                },
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.UPDATE,
            'Erro ao atualizar tipo de despesa.',
            {
                params: req.params,
                attrs: req.body
            },
            e.stack
        )
        res.send(message)
    }
})

export { router as updateTipoDespesa }