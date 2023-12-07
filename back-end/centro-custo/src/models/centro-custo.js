import mongoose, { SchemaTypes } from "mongoose"

const centroCustoSchema = new mongoose.Schema({
    centrocusto_org: mongoose.Types.ObjectId,
    centrocusto_cod: String,
    centrocusto_descr: String,
    centrocusto_parent: SchemaTypes.Mixed,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'centro_de_custo'})

const CentroCusto = mongoose.model('CentroCusto', centroCustoSchema)

export { CentroCusto }