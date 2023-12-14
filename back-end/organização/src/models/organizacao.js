import mongoose from "mongoose"

const organizacaoSchema = new mongoose.Schema({
    organizacao_nome: String,
    organizacao_cnpj: String,
    organizacao_situacao: mongoose.Types.ObjectId,
    organizacao_plano:  mongoose.Types.ObjectId,
    organizacao_data_expiração: Date,
    organizacao_responsavel:  mongoose.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, 
{
    collection: 'organizacao',
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.createdAt
            delete ret.lastModified
        }
    }
})

const Organizacao = mongoose.model('Organizacao', organizacaoSchema)

export { Organizacao }