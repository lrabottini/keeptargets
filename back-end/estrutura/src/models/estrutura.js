import mongoose, { SchemaTypes } from "mongoose"

const estruturaSchema = new mongoose.Schema({
    estrut_cod: String,
    estrut_descr: String,
    estrut_parent: SchemaTypes.Mixed,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'estrutura'})

const Estrutura = mongoose.model('estrut', estruturaSchema)

export { Estrutura }