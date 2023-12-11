import express from 'express'
import { validationResult } from 'express-validator'
import { fieldValidation } from '../../../centro-custo/src/middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'
import mongoose from 'mongoose'

const router = express.Router()

router.put('/estrutura/:id', fieldValidation, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Estrutura.findById(req.params.id)
                .then((estrutura) => {
                    estrutura.set({
                        estrutura_cod: req.body.codigo,
                        estrutura_descr: req.body.descricao,
                        estrutura_parent: Number(req.body.parent) === 0 ? Number(req.body.parent) : new mongoose.Types.ObjectId(req.body.parent)
                    })
                    
                    estrutura.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Estrutura atualizada com sucesso.',
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
                'Não foi possível atualizar estrutura.',
                {
                    params: req.params,
                    attrs: req.body
                },
                result.array()
            )
        }
        res.send(message)
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
            ExecutionTypes.UPDATE,
            'Não foi possível atualizar estrutura.',
            {
                params: req.params,
                attrs: req.body
            },
            error
        )
        res.send(message)
    }
})

export { router as updateEstrutura }