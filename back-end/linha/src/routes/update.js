import express from 'express'
import { validationResult } from 'express-validator'
import { Linha } from '../models/linha.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate, MessageLevel } from '@keeptargets/common'
import mongoose from 'mongoose'

const router = express.Router()

router.put('/linha/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Linha.findById(req.params.id)
                .then((linha) => {
                    const detalhes = "[".concat(req.body.detalhes, ']')
                    linha.set({
                        linha_versao: new mongoose.Types.ObjectId(req.body.versao),
                        linha_classificacao: new mongoose.Types.ObjectId(req.body.classificacao),
                        linha_centro_de_custo: new mongoose.Types.ObjectId(req.body.cc),
                        linha_tipo_de_despesa: new mongoose.Types.ObjectId(req.body.tipo_de_despesa),
                        linha_estrutura: new mongoose.Types.ObjectId(req.body.estrutura),
                        linha_proprietario: new mongoose.Types.ObjectId(req.body.proprietario),
                        linha_fornecedor: new mongoose.Types.ObjectId(req.body.fornecedor),
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
                        linha_etapa: new mongoose.Types.ObjectId(req.body.etapa),
                        linha_observacao: req.body.obs,
                        linha_distribuicao: {
                            tipo_distribuicao: req.body.tipo_distribuicao,
                            mes_valor: req.body.mes_valor,
                            offset: req.body.offset,
                            distribuicao: {
                                campo_1: req.body.campo_1,
                                campo_2: req.body.campo_2,
                                campo_3: req.body.campo_3,
                                campo_4: req.body.campo_4,
                                campo_5: req.body.campo_5,
                                campo_6: req.body.campo_6
                            }
                        },
                        linha_detalhes: JSON.parse(detalhes),
                    })
                    
                    linha.save()
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
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
                MessageLevel.LEVEL_WARNING,
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
            'Erro ao atualizar linha.',
            {
                params: req.params,
                attrs: req.body
            },
            error
        )
        res.send(message)
    }
})

export { router as updateLinha }