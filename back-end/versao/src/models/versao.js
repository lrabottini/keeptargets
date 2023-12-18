import mongoose, { SchemaTypes } from "mongoose"

const versaoSchema = new mongoose.Schema({
    versao_org: mongoose.Types.ObjectId,
    versao_ciclo: mongoose.Types.ObjectId,
    versao_responsavel: mongoose.Types.ObjectId,
    versao_estrutura: mongoose.Types.ObjectId,
    versao_nome: String,
    versao_situacao: {
        situacao_id: mongoose.Types.ObjectId,
        situacao_nome: String,
        situacao_cor: String
    },
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
}, {
    collection: 'versao',
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.createdAt
            delete ret.lastModified
        }
    }
})

const Versao = mongoose.model('Versao', versaoSchema)

export { Versao }