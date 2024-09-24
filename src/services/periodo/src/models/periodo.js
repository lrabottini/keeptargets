import mongoose from "mongoose"

const periodoSchema = new mongoose.Schema({
    periodo_ciclo: mongoose.Types.ObjectId,
    periodo_name: String,
    periodo_start: Date,
    periodo_end: Date,
    periodo_status: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'periodo'})

const Periodo = mongoose.model('Periodo', periodoSchema)

export { Periodo }