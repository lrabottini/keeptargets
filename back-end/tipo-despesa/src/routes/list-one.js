import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { TipoDespesa } from '../models/tipo-despesa.js'

const router = express.Router()

router.get('/tipodespesa/:id', async (req, res) => {
    try {
        await TipoDespesa.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Tipo de despesa não encontrada.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Não foi possível buscar tipo de despesa.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listOneTipoDespesa }