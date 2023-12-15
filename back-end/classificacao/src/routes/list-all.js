import express from 'express'
import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Classificacao } from '../models/classificacao.js'
import { validaParametros } from '../middleware/valida-chamada.js'

const router = express.Router()

router.get('/classificacao/', validaParametros, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const classificacao = await Classificacao.find({ classificacao_org: req.query.org })

            res.send(classificacao)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.DELETE,
                'Não foi possível buscar classificações.',
                req.query,
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
            ExecutionTypes.DELETE,
            'Não foi possível buscar classificações.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllClassificacao }