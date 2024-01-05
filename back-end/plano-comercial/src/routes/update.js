import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel, toFormattedDate } from '@keeptargets/common'
import { PlanoComercial } from '../models/plano-comercial.js'
import mongoose from 'mongoose'

const router = express.Router()

router.put('/planocomercial/:id', fieldValidation, validaCNPJ, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await PlanoComercial.findById(req.params.id)
                .then((plano) => {
                    plano.set({
                        plano_condicoes: req.body.condicoes
                        plano_nome: req.body.nome
                        plano_valor: req.body.valor
                        lastModified: Date.now()
                    })
                    
                    plano.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Plano Comercial atualizado com sucesso.',
                        {},
                        result.array()
                    )
                })
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.UPDATE,
                'Não foi possível atualizar plano comercial.',
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
            'Não foi possível atualizar plano comercial.',
            {
                params: req.params,
                attrs: req.body
            },
            error
        )
        res.send(message)
    }
})

export { router as update }