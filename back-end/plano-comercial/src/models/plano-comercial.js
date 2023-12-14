import mongoose from "mongoose"

const planoComercialSchema = new mongoose.Schema({
    plano_nome: String,
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
    collection: 'plano_comercial',
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.lastModified
        }
    }
})

const PlanoComercial = mongoose.model('PlanoComercial', planoComercialSchema)

export { PlanoComercial }