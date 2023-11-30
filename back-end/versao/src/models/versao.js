import mongoose, { SchemaTypes } from "mongoose"

const versaoSchema = new mongoose.Schema({
    versao_nr: String,
    versao_linhas: String,
    versao_valor_total: Number,
    versao_situacao: SchemaTypes.ObjectId, 
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