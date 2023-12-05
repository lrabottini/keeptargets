import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel, toFormattedDate } from '@keeptargets/common'
import { Versao } from '../models/versao.js'
import { fieldValidation, childrenValidation } from '../middleware/valida-chamada.js'

const router = express.Router()

router.put('/versao/:id', fieldValidation, childrenValidation, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Versao.findById(req.params.id)
                .then((versao) => {
                    versao.set({
                        versao_nome: req.body.nome,
                        versao_situacao: req.body.situacao,
                        versao_linhas: req.body.linhas,
                        versao_valor_total: req.body.valor_total,
                        lastModified: Date.now()
                    })
                    
                    versao.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Versão atualizada com sucesso.',
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
                'Não foi possível atualizar versão.',
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
            'Não foi possível atualizar versão.',
            {
                params: req.params,
                attrs: req.body
            },
            e.stack
        )
        res.send(message)
    }
})

export { router as updateVersao }