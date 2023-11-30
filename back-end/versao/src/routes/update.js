import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'
import { Versao } from '../models/versao.js'

const router = express.Router()

router.put('/versao/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Versao.findById(req.params.id)
                .then((versao) => {
                    versao.set({
                        versao_nr: req.body.nr,
                        versao_linhas: req.body.linhas,
                        versao_valor_total: req.body.valor_total,
                        versao_situacao: req.body.versao_situacao
                    })
                    
                    versao.save()
            
                    message = new ExecutionMessage(
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
            ExecutionStatus.ERROR,
            ExecutionTypes.UPDATE,
            'Erro ao atualizar versão.',
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