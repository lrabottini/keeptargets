import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus } from '@keeptargets/common'
import { Linha } from '../models/linha.js'

const router = express.Router()

router.get('/linha', async (req, res) => {
    try {
        const linha = await Linha.findLinhas()

        res.send(linha)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Erro ao buscar linhas.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllLinha }