import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Situacao } from '../models/situacao.js'

const router = express.Router()

const filter = (filtro) => {
    let filter = {}

    if (filtro.hasOwnProperty('objeto')) {
        if (filtro.objeto !== 'all'){
            filter = {
                situacao_objeto: `${filtro.objeto}`
            }
        } 
    }

    return filter
}


router.get('/situacao/?', async (req, res) => {
    try {
        const situacao = await Situacao.find(filter(req.query))

        res.send(situacao)
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
            'Erro ao buscar situações.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAll }