import mongoose from "mongoose"

const classificacaoSchema = new mongoose.Schema({
    classificacao_nome: String,
    classificacao_org: mongoose.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'classificacao'})

const Classificacao = mongoose.model('Classificacao', classificacaoSchema)

export { Classificacao }