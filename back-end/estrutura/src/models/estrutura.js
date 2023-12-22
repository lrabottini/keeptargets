import mongoose, { SchemaTypes } from "mongoose"

const estruturaSchema = new mongoose.Schema({
    estrutura_org: mongoose.Types.ObjectId,
    estrutura_cod: String,
    estrutura_descr: String,
    estrutura_parent: SchemaTypes.Mixed,
    estrutura_responsavel: mongoose.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'estrutura'})

// estruturaSchema.statics.returnTree = async function (id) {
//     // const response = await this.aggregate([
//     //     {
//     //         $match: {
//     //             estrutura_org : new mongoose.Types.ObjectId(id),
//     //             estrutura_parent: 0
//     //         }
//     //     }
//     //     ,{
//     //         $graphLookup: {
//     //             from: 'estrutura',
//     //             startWith: '$_id',
//     //             connectFromField: '_id',
//     //             connectToField: 'estrutura_parent',
//     //             depthField: "level",
//     //             as: 'children'
//     //         }
//     //     }
//     //     ,{
//     //         $unwind: {
//     //           path: "$children",
//     //           preserveNullAndEmptyArrays: true,
//     //           includeArrayIndex: "index"
//     //         }
//     //     }
//     //     ,{
//     //         $sort: {
//     //             "children.level": -1
//     //         }
//     //     }    
//     //     ,{
//     //         $group: {
//     //             _id: "$_id",
//     //             estrutura_parent: { $first: "$estrutura_parent" },
//     //             estrutura_descr: { $first: "$estrutura_descr" },
//     //             estrutura_cod: { $first: "$estrutura_cod" },
//     //             estrutura_org: { $first: "$estrutura_org" },
//     //             estrutura_responsavel: { $first: "$estrutura_responsavel" },
//     //             children: { $push: "$children" }
//     //         }
//     //     }
//     //     ,{
//     //         $addFields: {
//     //             children: {
//     //                 $reduce: {
//     //                     input: "$children",
//     //                     initialValue: { level: -1, presentChild: [], prevChild: [] },
//     //                     in: {
//     //                         $let: {
//     //                             vars: {
//     //                                 prev: {
//     //                                     $cond: [
//     //                                         { 
//     //                                             $eq: ["$$value.level", "$$this.level"]
//     //                                         },
//     //                                         "$$value.prevChild",
//     //                                         "$$value.presentChild"
//     //                                     ]
//     //                                 },
//     //                                 current: {
//     //                                     $cond: [
//     //                                         { 
//     //                                             $eq: ["$$value.level", "$$this.level"]
//     //                                         },
//     //                                         "$$value.presentChild",
//     //                                         []
//     //                                     ]
//     //                                 }
//     //                             },
//     //                             in: {
//     //                                 level: "$$this.level",
//     //                                 prevChild: "$$prev",
//     //                                 presentChild: {
//     //                                     $concatArrays: [
//     //                                         "$$current",
//     //                                         [
//     //                                             {
//     //                                                 $mergeObjects: [
//     //                                                     "$$this",
//     //                                                     {
//     //                                                         children: {
//     //                                                             $filter: {
//     //                                                                 input: "$$prev",
//     //                                                                 as: "e",
//     //                                                                 cond: {
//     //                                                                     $eq: ["$$e.estrutura_parent", "$$this._id"]
//     //                                                                 }
//     //                                                             }
//     //                                                         }
//     //                                                     }
//     //                                                 ]
//     //                                             }
//     //                                         ]
//     //                                     ]
//     //                                 }
//     //                             }
//     //                         }
//     //                     }
//     //                 }
//     //             }
//     //         }
//     //     },
//     //     {
//     //         $addFields: {
//     //             children: "$children.presentChild"
//     //         }
//     //     },
//     //     {
//     //         $sort: {
//     //             "level": 1,
//     //             "_id": 1
//     //         }

//     //     }
//     //     ,{
//     //         $project: {
//     //             _id: 1,
//     //             estrutura_parent: 1,
//     //             estrutura_descr: 1,
//     //             estrutura_cod: 1,
//     //             estrutura_org: 1,
//     //             estrutura_responsavel: 1,
//     //             children: 1,
//     //         }
//     //     }
//     // ])        
//     const response = await this.aggregate([
//         {
//           $match: {
//             estrutura_org: new mongoose.Types.ObjectId(id),
//             //estrutura_parent: 0
//           }
//         }
//         ,{
//           $graphLookup: {
//             from: 'estrutura',
//             startWith: '$_id',
//             connectFromField: '_id',
//             connectToField: 'estrutura_parent',
//             depthField: 'level',
//             as: 'children'
//           }
//         }
//         ,{
//             $lookup: {
//                 from: 'usuario',
//                 localField: 'estrutura_responsavel',
//                 foreignField: '_id',
//                 pipeline:[
//                     {
//                         $project: {
//                             'usuario_nomecompleto': {
//                                 $concat: ["$usuario_nome", " ", "$usuario_sobrenome"]
//                             }
//                         }
//                     }
//                 ],
//                 as: 'responsavel',
//             }
//         }
//         ,{
//             $unwind: {
//                 path: '$responsavel',
//                 preserveNullAndEmptyArrays: true
//             }
//         }
//         ,{
//           $addFields: {
//             responsavel: '$responsavel',
//             children: {
//               $map: {
//                 input: '$children',
//                 as: 'child',
//                 in: {
//                   $mergeObjects: [
//                     '$$child',
//                     {
//                       responsavel: '$responsavel'
//                     }
//                   ]
//                 }
//               }
//             }
//           }
//         },
//         {
//           $addFields: {
//             children: {
//               $reduce: {
//                 input: '$children',
//                 initialValue: { level: -1, presentChild: [], prevChild: [] },
//                 in: {
//                   $let: {
//                     vars: {
//                       prev: {
//                         $cond: [
//                           { $eq: ['$$value.level', '$$this.level'] },
//                           '$$value.prevChild',
//                           '$$value.presentChild'
//                         ]
//                       },
//                       current: {
//                         $cond: [
//                           { $eq: ['$$value.level', '$$this.level'] },
//                           '$$value.presentChild',
//                           []
//                         ]
//                       }
//                     },
//                     in: {
//                       level: '$$this.level',
//                       prevChild: '$$prev',
//                       presentChild: {
//                         $concatArrays: [
//                           '$$current',
//                           [
//                             {
//                               $mergeObjects: [
//                                 '$$this',
//                                 {
//                                   children: {
//                                     $filter: {
//                                       input: '$$prev',
//                                       as: 'e',
//                                       cond: { $eq: ['$$e.estrutura_parent', '$$this._id'] }
//                                     }
//                                   }
//                                 }
//                               ]
//                             }
//                           ]
//                         ]
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         },
//         {
//           $addFields: {
//             children: '$children.presentChild'
//           }
//         },
//         {
//           $sort: { level: 1, "_id": 1 }
//         }
//         ,{
//           $project: {
//             _id: 1,
//             estrutura_parent: 1,
//             estrutura_descr: 1,
//             estrutura_cod: 1,
//             estrutura_org: 1,
//             estrutura_responsavel: 1,
//             children: 1,
//           }
//         }
//         /** Faz o lookup para trazer as informações do centro de custo */
//         ,{
//             $lookup: {
//                 from: 'usuario',
//                 localField: 'estrutura_responsavel',
//                 foreignField: '_id',
//                 pipeline:[
//                     {
//                         $project: {
//                             'usuario_nomecompleto': {
//                                 $concat: ["$usuario_nome", " ", "$usuario_sobrenome"]
//                             }
//                         }
//                     }
//                 ],
//                 as: 'responsavel',
//             }
//         }
//         ,{
//             $unwind: {
//                 path: '$responsavel',
//                 preserveNullAndEmptyArrays: true
//             }
//         }
//       ]);
               
//     return response
// }

estruturaSchema.statics.listEstrutura = async function (org) {
    const response = await this.aggregate([
        {
            $match: {
                estrutura_org : new mongoose.Types.ObjectId(org)
            }
        }
        /** Faz o lookup para trazer o responsável principal */
        ,{
            $lookup: {
                from: 'usuario',
                localField: 'estrutura_responsavel',
                foreignField: '_id',
                pipeline:[
                    {
                        $project: {
                            'usuario_nomecompleto': {
                                $concat: ["$usuario_nome", " ", "$usuario_sobrenome"]
                            }
                        }
                    }
                ],
                as: 'responsavel',
            }
        }
        ,{
            $unwind: {
                path: '$responsavel',
                preserveNullAndEmptyArrays: true
            }
        }
        ,{
            $project: {
                __v: 0,
                createdAt: 0,
                lastModified: 0
                }
        }
    ]).exec()

    return response
}

const Estrutura = mongoose.model('Estrutura', estruturaSchema)

export { Estrutura }