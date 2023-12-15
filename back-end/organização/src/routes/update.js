import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel, toFormattedDate } from '@keeptargets/common'
import { fieldValidation, validaCNPJ } from '../middleware/valida-chamada.js'
import { Organizacao } from '../models/organizacao.js'
import mongoose from 'mongoose'

const router = express.Router()

router.put('/organizacao/:id', fieldValidation, validaCNPJ, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Organizacao.findById(req.params.id)
                .then((organizacao) => {
                    organizacao.set({
                        organizacao_responsavel: new mongoose.Types.ObjectId(req.body.responsavel),
                        organizacao_cnpj: req.body.cnpj,
                        organizacao_nome: req.body.nome,
                        organizacao_situacao: new mongoose.Types.ObjectId(req.body.situacao),
                        organizacao_plano: new mongoose.Types.ObjectId(req.body.plano),
                        organizacao_data_expiração: toFormattedDate(req.body.expiracao),
                    })
                    
                    organizacao.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Organização atualizada com sucesso.',
                        {},
                        result.array()
                    )
                })
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.UPDATE,
                'Não foi possível atualizar organização.',
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
            'Não foi possível atualizar organização.',
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