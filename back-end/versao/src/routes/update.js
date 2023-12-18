import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Versao } from '../models/versao.js'
import { validaCamposAtualizacao, childrenValidation } from '../middleware/valida-chamada.js'

const router = express.Router()

router.put('/versao/:id', validaCamposAtualizacao, childrenValidation, async (req, res) => {
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
                        versao_situacao: {
                            situacao_id: new mongoose.Types.ObjectId(req.body.situacao_id),
                            situacao_nome: req.body.situacao_nome,
                            situacao_cor: req.body.situacao_cor
                        },
                        versao_responsavel: new mongoose.Types.ObjectId(req.body.situacao_id),
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
            'Não foi possível atualizar versão.',
            {
                params: req.params,
                attrs: req.body
            },
            error
        )
        res.send(message)
    }
})

export { router as updateVersao }