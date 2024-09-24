import mongoose from "mongoose"

const situacaoSchema = new mongoose.Schema({
    situacao_org: Number,
    situacao_codigo: Number,
    situacao_default: Boolean,
    situacao_descr: String,
    situacao_nome: String,
    situacao_objeto: String,
    situacao_cor: String,
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
    collection: 'situacao',
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
        }
    }
}
)

// usuarioSchema.statics.findUsuarios = async function (id) {
//     const response = await this.aggregate([
//             /** Faz o match para trazer o documento que corresponde ao 'id' informado */
//             {
//                 $match: {
//                     usuario_org: new mongoose.Types.ObjectId(id)
//                 }
//             }
//             /** Faz o lookup para trazer as informações do perfil */
//             ,{
//                 $lookup: {
//                     from: 'perfil',
//                     localField: 'usuario_perfil',
//                     foreignField: '_id',
//                     pipeline:[
//                         {
//                             $project: {
//                                 'role_name': 1
//                             }
//                         }
//                     ],
//                     as: 'perfil',
//                 }
//             }
//             /** Faz o lookup para trazer o tipo de despesa */
//             ,{
//                 $lookup: {
//                     from: 'situacao',
//                     localField: 'usuario_situacao',
//                     foreignField: '_id',
//                     pipeline:[
//                         {
//                             $project: {
//                                 'sit_descr': 1
//                             }
//                         }
//                     ],
//                     as: 'situacao',
//                 }
//             }
//             ,{
//                 $project: {
//                     usuario_senha: 0,
//                     __v: 0
//                 }
//             }
//     ]).exec()

//     return response
// }


const Situacao = mongoose.model('situacao', situacaoSchema)

export { Situacao }