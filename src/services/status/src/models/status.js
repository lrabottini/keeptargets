import mongoose from "mongoose"

const statusSchema = new mongoose.Schema({
    status_org: mongoose.Types.ObjectId,
    status_nome: String,
    status_entidade: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'status'})

const Status = mongoose.model('Status', statusSchema)

export { Status }