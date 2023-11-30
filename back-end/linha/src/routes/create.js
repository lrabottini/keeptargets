import express from 'express'
import mongoose from 'mongoose'

import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { Linha } from '../models/linha.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'

const router = express.Router()

router.post('/linha', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const linha = new Linha()

            linha.linha_versao = req.body.versao,
            linha.linha_classificacao = req.body.classificacao,
            linha.linha_centro_de_custo = req.body.cc,
            linha.linha_tipo_de_despesa = req.body.tipo_de_despesa,
            linha.linha_estrutura = req.body.estrutura,
            linha.linha_proprietario = req.body.proprietario,
            linha.linha_fornecedor = req.body.fornecedor,
            linha.linha_descricao = req.body.descricao,
            linha.linha_inicio_periodo = toFormattedDate(req.body.start),
            linha.linha_fim_periodo = toFormattedDate(req.body.end),
            linha.linha_valor_base = req.body.valor_base,
            linha.linha_reajuste.ativo = req.body.tipo_reajuste,
            linha.linha_reajuste.reajuste_percentual = req.body.reajuste_percentual,
            linha.linha_reajuste.reajuste_valor = req.body.reajuste_valor,
            linha.linha_valor_final.valor_final_perc = req.body.valor_final_perc,
            linha.linha_valor_final.valor_final_valor = req.body.valor_final_valor,
            linha.linha_etapa = req.body.etapa,
            linha.linha_observacao = req.body.obs

            await linha.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Linha criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar linha.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Erro ao criar linha.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createLinha }