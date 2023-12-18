import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Versao } from '../models/versao.js'

const router = express.Router()

router.get('/versao/?', async (req, res) => {
    try {
        const { key, value } = req.query
        const filter = {}
        filter[`versao_${key}`] = value

        const versao = await Versao.find(filter)

        res.send(versao)
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
            'Não foi possível retornar versões.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllVersao }