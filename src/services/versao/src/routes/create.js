import express from 'express'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Versao } from '../models/versao.js'
import { validaCamposCriacao } from '../middleware/valida-chamada.js'

const router = express.Router()

router.post('/versao', validaCamposCriacao, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const versao = new Versao()

            versao.versao_org = new mongoose.Types.ObjectId(req.body.org)
            versao.versao_nome = req.body.nome
            versao.versao_ciclo = new mongoose.Types.ObjectId(req.body.ciclo)
            versao.versao_situacao.situacao_id = new mongoose.Types.ObjectId(req.body.situacao_id)
            versao.versao_situacao.situacao_nome = req.body.situacao_nome
            versao.versao_situacao.situacao_cor = req.body.situacao_cor
            versao.versao_responsavel = new mongoose.Types.ObjectId(req.body.responsavel)
            versao.versao_estrutura = new mongoose.Types.ObjectId(req.body.estrutura)
        
            await versao.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Versão criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar versão.',
                req.body,
                result.array()
            )
            res.send(message)
        }
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
            ExecutionTypes.CREATE,
            'Não foi possível criar versão.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as createVersao }