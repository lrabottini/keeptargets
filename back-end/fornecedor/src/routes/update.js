import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'
import { fieldValidation, validaCNPJ } from '../middleware/valida-chamada.js'

const router = express.Router()

router.put('/fornecedor/:id', fieldValidation, validaCNPJ, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Fornecedor.findById(req.params.id)
                .then((fornecedor) => {
                    fornecedor.set({
                        fornecedor_cod: req.body.codigo,
                        fornecedor_descr: req.body.descricao,
                        fornecedor_cnpj: req.body.cnpj,
                        fornecedor_nome: req.body.nome
                    })
                    
                    fornecedor.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Fornecedor atualizado com sucesso.',
                        {},
                        result.array()
                    )
                })
        } else {
            message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
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
            'Não foi possível atualizar fornecedor.',
            {
                params: req.params,
                attrs: req.body
            },
            error
        )
        res.send(message)
    }
})

export { router as updateFornecedor }