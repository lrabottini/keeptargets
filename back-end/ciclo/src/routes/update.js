import express from 'express'
import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { Ciclo } from '../models/ciclo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, toFormattedDate } from '@keeptargets/common'

const router = express.Router()

router.put('/ciclo/:id', fieldValidation, async (req, res) => {
    try {
        let message = ''

        const result = validationResult(req)
        if (result.isEmpty()){
            await Ciclo.findById(req.params.id)
                .then((ciclo) => {
                    ciclo.set({
                        ciclo_name: req.body.name,
                        ciclo_start: toFormattedDate(req.body.start),
                        ciclo_end: toFormattedDate(req.body.end),
                        ciclo_status: req.body.status,
                        ciclo_lastModified: Date.now()        
                    })
                    
                    ciclo.save()
            
                    message = new ExecutionMessage(
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.UPDATE,
                        'Ciclo atualizado com sucesso.',
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
                'Não foi possível atualizar ciclo.',
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
            'Erro ao atualizar ciclo.',
            {
                params: req.params,
                attrs: req.body
            },
            e.stack
        )
        res.send(message)
    }
})

export { router as updateCiclo }