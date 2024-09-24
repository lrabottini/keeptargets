import express from 'express'
import { validationResult } from 'express-validator'
import { validaCampos } from '../middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Status } from '../models/status.js'

const router = express.Router()

router.put('/status/:id', validaCampos, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Status.findById(req.params.id)
                .then((status) => {
                    status.set({
                        status_nome: req.body.nome
                    })
                    
                    status.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Status atualizado com sucesso.',
                        {
                            params: req.params,
                            attrs: req.body
                        },
                        result.array()
                    )
                })
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_ERROR,
                ExecutionStatus.ERROR,
                ExecutionTypes.UPDATE,
                'Não foi possível atualizar o status.',
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
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.UPDATE,
            'Não foi possível atualizar o status.',
            {
                params: req.params,
                attrs: req.body
            },
            e.stack
        )
        res.send(message)
    }
})

export { router as updateStatus }