import mongoose from "mongoose"

const fornecedorSchema = new mongoose.Schema({
    forn_cod: String,
    forn_descr: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'fornecedor'})

const Fornecedor = mongoose.model('Fornecedor', fornecedorSchema)

export { Fornecedor }