import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus } from '@keeptargets/common'
import { Proprietario } from '../models/proprietario.js'

const router = express.Router()

router.get('/proprietario', async (req, res) => {
    try {
        const proprietario = await Proprietario.find()

        res.send(proprietario)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar proprietário.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllProprietario }