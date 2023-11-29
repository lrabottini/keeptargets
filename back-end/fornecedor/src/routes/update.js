import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'

const router = express.Router()

router.put('/fornecedor/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Fornecedor.findById(req.params.id)
                .then((fornecedor) => {
                    fornecedor.set({
                        forn_cod: req.body.codigo,
                        forn_descr: req.body.descricao,
                    })
                    
                    fornecedor.save()
            
                    message = new ExecutionMessage(
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Fornecedor atualizado com sucesso.',
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
                'Não foi possível atualizar fornecedor.',
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
            'Não foi possível atualizar fornecedor.',
            {
                params: req.params,
                attrs: req.body
            },
            e.stack
        )
        res.send(message)
    }
})

export { router as updateFornecedor }