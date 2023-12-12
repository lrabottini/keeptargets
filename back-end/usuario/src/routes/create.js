import express from 'express'

import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Usuario } from '../models/usuario.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/usuario', fieldValidation, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const usuario = new Usuario()

            usuario.usuario_org = new mongoose.Types.ObjectId(req.body.org)
            usuario.usuario_nome = req.body.nome
            usuario.usuario_sobrenome = req.body.sobrenome
            usuario.usuario_login = req.body.login
            usuario.usuario_senha = req.body.senha
            usuario.usuario_email = req.body.email
            usuario.usuario_perfil = new mongoose.Types.ObjectId(req.body.perfil)
            usuario.usuario_situacao = new mongoose.Types.ObjectId(req.body.situacao)

            await usuario.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Usuário criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar usuário.',
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
            'Não foi possíve criar usuário.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as createUsuario }