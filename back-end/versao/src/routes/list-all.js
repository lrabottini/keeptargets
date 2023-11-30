import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus } from '@keeptargets/common'
import { Versao } from '../models/versao.js'

const router = express.Router()

router.get('/versao', async (req, res) => {
    try {
        const versao = await Versao.find()

        res.send(versao)
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.DELETE,
            'Erro ao buscar versões.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllVersao }