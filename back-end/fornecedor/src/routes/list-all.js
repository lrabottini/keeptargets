import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'

const router = express.Router()

router.get('/fornecedor', async (req, res) => {
    try {
        const fornecedor = await Fornecedor.find()

        res.send(fornecedor)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar fornecedor.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllFornecedor }