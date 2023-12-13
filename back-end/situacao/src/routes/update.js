import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import mongoose from 'mongoose'
import { Situacao } from '../models/situacao.js'

const router = express.Router()

router.put('/situacao/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Situacao.findById(req.params.id)
                .then((situacao) => {
                    situacao.set({
                        situacao_descr: req.body.descr,
                        situacao_nome: req.body.nome,
                        lastModified: Date.now()
                    })
                    
                    situacao.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Situação atualizada com sucesso.',
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
                'Não foi possível atualizar situação.',
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
            'Não foi possível atualizar situação.',
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