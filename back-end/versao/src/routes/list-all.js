import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Versao } from '../models/versao.js'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/versao/?', async (req, res) => {
    try {
        const filter = {}
        for (const key in req.query){
            if (req.query[key] !== '')
                filter[`versao_${key}`] = new mongoose.Types.ObjectId(req.query[key])
        }

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