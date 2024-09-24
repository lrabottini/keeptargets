import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Organizacao } from '../models/organizacao.js'

const router = express.Router()

router.get('/organizacaoall/', async (req, res) => {
    try {
        const organizacao = await Organizacao.listOrgs()

        res.send(organizacao)
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
            ExecutionTypes.LIST,
            'Não foi possível buscar organização.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAll }