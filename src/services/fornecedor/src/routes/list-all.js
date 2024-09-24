import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'

const router = express.Router()

router.get('/fornecedor/all/:org', async (req, res) => {
    try {
        const fornecedor = await Fornecedor.find({fornecedor_org: req.params.org})

        res.send(fornecedor)
    } catch (e) {
        const error = [{
            type: e.name,
            value: '',
            msg: e.message,
            path: e.stack,
            location: ''
        }]

        const message = new ExecutionMessage(
            MessageLevel.LEVEL_WARNING,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Não foi possível buscar fornecedor.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllFornecedor }