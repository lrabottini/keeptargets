import mongoose, { SchemaTypes } from "mongoose"

const proprietarioSchema = new mongoose.Schema({
    prop_cod: String,
    prop_nome: String,
    prop_role: mongoose.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'proprietario'})

const Proprietario = mongoose.model('proprietario', proprietarioSchema)

export { Proprietario }