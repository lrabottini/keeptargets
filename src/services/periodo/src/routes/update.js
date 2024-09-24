import express from 'express'
import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { Periodo } from '../models/periodo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'

const router = express.Router()

router.put('/periodo/:id', fieldValidation, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Periodo.findById(req.params.id)
                .then((periodo) => {
                    periodo.set({
                        periodo_name: req.body.name,
                        periodo_start: toFormattedDate(req.body.start),
                        periodo_end: toFormattedDate(req.body.end),
                        periodo_status: req.body.status,
                        periodo_lastModified: Date.now() 
                    })
                    
                    periodo.save()
            
                    message = new ExecutionMessage(
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Período atualizado com sucesso.',
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
                'Não foi possível atualizar período.',
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
            'Erro ao atualizar período.',
            {
                params: req.params,
                attrs: req.body
            },
            e.stack
        )
        res.send(message)
    }
})

export { router as updatePeriodo }