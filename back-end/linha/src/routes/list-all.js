import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Linha } from '../models/linha.js'

const router = express.Router()

router.get('/linha', async (req, res) => {
    try {
        const linha = await Linha.findLinhas(req.query.versao)

        res.send(linha)
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
            'Erro ao buscar linhas.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllLinha }