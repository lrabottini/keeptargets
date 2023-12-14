import mongoose from "mongoose"

const fornecedorSchema = new mongoose.Schema({
    fornecedor_org: mongoose.Types.ObjectId,
    fornecedor_cod: String,
    fornecedor_descr: String,
    fornecedor_cnpj: String,
    fornecedor_nome: String,
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
    collection: 'fornecedor',
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.fornecedor_org
            delete ret.createdAt
            delete ret.lastModified
        }
    }
})

const Fornecedor = mongoose.model('Fornecedor', fornecedorSchema)

export { Fornecedor }