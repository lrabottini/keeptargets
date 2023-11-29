import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus } from '@keeptargets/common'
import { TipoDespesa } from '../models/tipo-despesa.js'

const router = express.Router()

router.get('/tipodespesa', async (req, res) => {
    try {
        const tipoDespesa = await TipoDespesa.find()

        res.send(tipoDespesa)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar tipo de despesa.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllTipoDespesa }