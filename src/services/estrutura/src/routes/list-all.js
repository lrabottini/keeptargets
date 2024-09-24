import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel, docHierarchy } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'

const router = express.Router()

router.get('/estrutura/all/:org', async (req, res) => {
    try {
        const estrutura = await Estrutura.listEstrutura(req.params.org)
        const estruturaAplanada = await docHierarchy(estrutura)
        
        res.send(estruturaAplanada)
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
            'Erro ao buscar estrutura.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllEstrutura }