import express from 'express'
import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import mongoose from 'mongoose'
import { Perfil } from '../models/perfil.js'

const router = express.Router()

router.put('/perfil/:id', fieldValidation, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Perfil.findById(req.params.id)
                .then((perfil) => {
                    perfil.set({
                        perfil_nome: req.body.nome,
                        perfil_descr: req.body.descricao
                    })
                    
                    perfil.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Perfil atualizado com sucesso.',
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
                'Não foi possível atualizar perfil.',
                {},
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
            'Não foi possível atualizar perfil.',
            {
                params: req.params,
                attrs: req.body
            },
            error   
        )
        res.send(message)
    }
})

export { router as updatePerfil }