import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Usuario } from '../models/usuario.js'

const router = express.Router()

router.put('/usuario/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Usuario.findById(req.params.id)
                .then((usuario) => {
                    usuario.set({
                        usuario_nome: req.body.nome,
                        usuario_sobrenome: req.body.sobrenome,
                        usuario_email: req.body.email,
                    })
                    
                    usuario.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Proprietário atualizado com sucesso.',
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
                'Não foi possível atualizar proprietário.',
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
            'Não foi possível atualizar proprietário.',
            {
                params: req.params,
                attrs: req.body
            },
            error
        )
        res.send(message)
    }
})

export { router as updateUsuario }