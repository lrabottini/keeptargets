import mongoose from "mongoose"

const versaoSchema = new mongoose.Schema({
    versao_nr: String,
    versao_linhas: String,
    versao_total: Number,
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