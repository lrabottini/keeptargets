import express from 'express'
import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { Linha } from '../models/linha.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'

const router = express.Router()

router.put('/linha/:id', async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await findById(req.params.id)
                .then((linha) => {
                    periodo.set({
                        linha_fornecedor: mongoose.Types.ObjectId,
                        linha_centro_de_custo: mongoose.Types.ObjectId,
                        linha_tipo_de_despesa: mongoose.Types.ObjectId,
                        linha_inicio_periodo: toFormattedDate(req.body.inicio),
                        linha_fim_periodo: toFormattedDate(req.body.fim),
                        linha_valor_anterior: 0,
                        linha_valor: req.body.valor,
                        linha_tipo_reajuste: req.body.tipo_reajuste,
                        linha_valor_reajuste: req.body.valor_reajuste,
                        linha_situacao: req.body.situacao
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