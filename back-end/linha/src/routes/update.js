import express from 'express'
import { validationResult } from 'express-validator'
import { Linha } from '../models/linha.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'

const router = express.Router()

router.put('/linha/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Linha.findById(req.params.id)
                .then((linha) => {
                    linha.set({
                        linha_versao: req.body.versao,
                        linha_classificacao: req.body.classificacao,
                        linha_centro_de_custo: req.body.cc,
                        linha_tipo_de_despesa: req.body.tipo_de_despesa,
                        linha_estrutura: req.body.estrutura,
                        linha_proprietario: req.body.proprietario,
                        linha_fornecedor: req.body.fornecedor,
                        linha_descricao: req.body.descricao,
                        linha_inicio_periodo: toFormattedDate(req.body.start),
                        linha_fim_periodo: toFormattedDate(req.body.end),
                        linha_valor_base: req.body.valor_base,
                        linha_reajuste: {
                            tipo_reajuste: req.body.tipo_reajuste,
                            reajuste_percentual: req.body.reajuste_percentual,
                            reajuste_valor: req.body.reajuste_valor
                        },
                        linha_valor_final: {
                            valor_final_perc: req.body.valor_final_perc,
                            valor_final_valor: req.body.valor_final_valor,
                        },
                        linha_etapa: req.body.etapa,
                        linha_observacao: req.body.obs
                    })
                    
                    linha.save()
                    message = new ExecutionMessage(
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Linha atualizado com sucesso.',
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
                'Não foi possível atualizar linha.',
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
            'Erro ao atualizar linha.',
            {
                params: req.params,
                attrs: req.body
            },
            e.stack
        )
        res.send(message)
    }
})

export { router as updateLinha }