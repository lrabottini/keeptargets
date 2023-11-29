import mongoose from "mongoose"

const tipoDespesaSchema = new mongoose.Schema({
    tipodespesa_cod: String,
    tipodespesa_descr: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'tipo_de_despesa'})

const TipoDespesa = mongoose.model('TipoDespesa', tipoDespesaSchema)

export { TipoDespesa }