import mongoose, { Schema, SchemaType } from "mongoose"

const linhaSchema = new mongoose.Schema({
    linha_versao: mongoose.Types.ObjectId,
    linha_fornecedor: mongoose.Types.ObjectId,
    linha_centro_de_custo: mongoose.Types.ObjectId,
    linha_tipo_de_despesa: mongoose.Types.ObjectId,
    linha_inicio_periodo: Date,
    linha_fim_periodo: Date,
    linha_valor_anterior: Schema.Types.Mixed,
    linha_valor: mongoose.Types.Decimal128,
    linha_tipo_reajuste: Number,
    linha_valor_reajuste: mongoose.Types.Decimal128,
    linha_situacao: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'linha'})

const Linha = mongoose.model('Linha', linhaSchema)

export { Linha }