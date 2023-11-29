import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'

const router = express.Router()

router.get('/estrutura', async (req, res) => {
    try {
        const estrutura = await Estrutura.find()

        res.send(estrutura)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar estrutura.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllEstrutura }