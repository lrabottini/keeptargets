import express from 'express'
import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel, ErrorMessage } from '@keeptargets/common'
import { CentroCusto } from '../models/centro-custo.js'
import mongoose from 'mongoose'

const router = express.Router()

router.put('/centrocusto/:id', fieldValidation, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await CentroCusto.findById(req.params.id)
                .then((centrocusto) => {
                    centrocusto.set({
                        centrocusto_cod: req.body.codigo,
                        centrocusto_descr: req.body.descricao,
                        centrocusto_parent: Number(req.body.parent) === 0 ? Number(req.body.parent) : new mongoose.Types.ObjectId(req.body.parent)
                    })
                    
                    centrocusto.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Centro de custo atualizado com sucesso.',
                        {
                            params: req.params,
                            attrs: req.body
                        },
                        result.array()
                    )
                })
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.UPDATE,
                'Não foi possível atualizar centro de custo.',
                {
                    params: req.params,
                    attrs: req.body
                },
                result.array()
            )
        }
        res.send(message)
    } catch (e) {
        const error = new ErrorMessage()
        error.addError('ERROR', e.name, e.message, e.stack, '')

        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.UPDATE,
            'Não foi possível atualizar centro de custo.',
            {
                params: req.params,
                attrs: req.body
            },
            error
        )
        res.send(message)
    }
})

export { router as updateCentroCusto }