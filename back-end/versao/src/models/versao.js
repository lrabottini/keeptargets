import mongoose, { SchemaTypes } from "mongoose"

const versaoSchema = new mongoose.Schema({
    versao_ciclo: mongoose.Types.ObjectId,
    versao_nome: String,
    versao_situacao: mongoose.Types.ObjectId,
    versao_linhas: {
        type: Number,
        default: 0
    },
    versao_valor_total: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'versao'})

const Versao = mongoose.model('Versao', versaoSchema)

export { Versao }