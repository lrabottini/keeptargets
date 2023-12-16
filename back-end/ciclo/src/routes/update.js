import express from 'express'
import { validationResult } from 'express-validator'
import { fieldValidation } from '../middleware/valida-chamada.js'
import { Ciclo } from '../models/ciclo.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel, toFormattedDate } from '@keeptargets/common'
import mongoose from 'mongoose'

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
                        ciclo_situacao: new mongoose.Types.ObjectId(req.body.situacao),
                        ciclo_lastModified: Date.now()        
                    })
                    
                    ciclo.save()
            
                    message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
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
                MessageLevel.LEVEL_ERROR,
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
            'Não foi possível atualizar ciclo.',
            {
                params: req.params,
                attrs: req.body
            },
            error
        )
        res.send(message)
    }
})

export { router as updateCiclo }