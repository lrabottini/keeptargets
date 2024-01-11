import express from 'express'
import mongoose from 'mongoose'

import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { Linha } from '../models/linha.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate, MessageLevel } from '@keeptargets/common'

const router = express.Router()

router.post('/linha', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const linha = new Linha()

            linha.linha_org = new mongoose.Types.ObjectId(req.body.org)
            linha.linha_ciclo = new mongoose.Types.ObjectId(req.body.ciclo)
            linha.linha_versao = new mongoose.Types.ObjectId(req.body.versao)
            linha.linha_classificacao = new mongoose.Types.ObjectId(req.body.classificacao),
            linha.linha_centro_de_custo = new mongoose.Types.ObjectId(req.body.cc),
            linha.linha_tipo_de_despesa = new mongoose.Types.ObjectId(req.body.tipo_de_despesa),
            linha.linha_estrutura = new mongoose.Types.ObjectId(req.body.estrutura),
            linha.linha_proprietario = new mongoose.Types.ObjectId(req.body.proprietario),
            linha.linha_fornecedor = new mongoose.Types.ObjectId(req.body.fornecedor),
            linha.linha_descricao = req.body.descricao,
            linha.linha_inicio_periodo = toFormattedDate(req.body.start),
            linha.linha_fim_periodo = toFormattedDate(req.body.end),
            linha.linha_valor_base = req.body.valor_base,
            linha.linha_reajuste.tipo_reajuste = req.body.tipo_reajuste,
            linha.linha_reajuste.reajuste_percentual = req.body.reajuste_percentual,
            linha.linha_reajuste.reajuste_valor = req.body.reajuste_valor,
            linha.linha_valor_final.valor_final_perc = req.body.valor_final_perc,
            linha.linha_valor_final.valor_final_valor = req.body.valor_final_valor,
            linha.linha_etapa = new mongoose.Types.ObjectId(req.body.etapa)
            linha.linha_observacao = req.body.obs
            linha.linha_detalhe[0].previsto = req.body.mes1_previsto
            linha.linha_detalhe[0].realizado = req.body.mes1_realizado
            linha.linha_detalhe[1].previsto = req.body.mes2_previsto
            linha.linha_detalhe[1].realizado = req.body.mes2_realizado
            linha.linha_detalhe[2].previsto = req.body.mes3_previsto
            linha.linha_detalhe[2].realizado = req.body.mes3_realizado
            linha.linha_detalhe[3].previsto = req.body.mes4_previsto
            linha.linha_detalhe[3].realizado = req.body.mes4_realizado
            linha.linha_detalhe[4].previsto = req.body.mes5_previsto
            linha.linha_detalhe[4].realizado = req.body.mes5_realizado
            linha.linha_detalhe[5].previsto = req.body.mes6_previsto
            linha.linha_detalhe[5].realizado = req.body.mes6_realizado
            linha.linha_detalhe[6].previsto = req.body.mes7_previsto
            linha.linha_detalhe[6].realizado = req.body.mes7_realizado
            linha.linha_detalhe[7].previsto = req.body.mes8_previsto
            linha.linha_detalhe[7].realizado = req.body.mes8_realizado
            linha.linha_detalhe[8].previsto = req.body.mes9_previsto
            linha.linha_detalhe[8].realizado = req.body.mes9_realizado
            linha.linha_detalhe[9].previsto = req.body.mes10_previsto
            linha.linha_detalhe[9].realizado = req.body.mes10_realizado
            linha.linha_detalhe[10].previsto = req.body.mes11_previsto
            linha.linha_detalhe[10].realizado = req.body.mes11_realizado
            linha.linha_detalhe[11].previsto = req.body.mes12_previsto
            linha.linha_detalhe[11].realizado = req.body.mes12_realizado

            await linha.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Linha criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar linha.',
                req.body,
                result.array()
            )
            res.send(message)
        }
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
            ExecutionTypes.CREATE,
            'Erro ao criar linha.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as createLinha }