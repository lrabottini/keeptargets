import mongoose from "mongoose"

const cicloSchema = new mongoose.Schema({
    ciclo_org: mongoose.Types.ObjectId,
    ciclo_name: String,
    ciclo_start: Date,
    ciclo_end: Date,
    ciclo_status: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'ciclo'})

const Ciclo = mongoose.model('Ciclo', cicloSchema)

export { Ciclo }