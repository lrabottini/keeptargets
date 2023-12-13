import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { fieldValidation, hasOrg } from '../middleware/valida-chamada.js'
import { Perfil } from '../models/perfil.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/perfil', fieldValidation, hasOrg, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const perfil = new Perfil()

            perfil.perfil_org = new mongoose.Types.ObjectId(req.body.org)
            perfil.perfil_descr = req.body.descricao

            await perfil.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Perfil criado com sucesso.',
                perfil,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar o perfil.',
                {},
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
            'Erro ao criar perfil.',
            req.params,
            error 
        )
    }
})

export { router as createPerfil }