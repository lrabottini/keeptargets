import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'

const router = express.Router()

router.put('/estrutura/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Estrutura.findById(req.params.id)
                .then((estrutura) => {
                    estrutura.set({
                        estrut_cod: req.body.codigo,
                        estrut_descr: req.body.descricao,
                        estrut_parent: req.body.parent
                    })
                    
                    estrutura.save()
            
                    message = new ExecutionMessage(
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
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.UPDATE,
            'Não foi possível atualizar estrutura.',
            {
                params: req.params,
                attrs: req.body
            },
            e.stack
        )
        res.send(message)
    }
})

export { router as updateEstrutura }