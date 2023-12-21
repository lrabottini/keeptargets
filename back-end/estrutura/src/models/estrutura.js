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

estruturaSchema.statics.returnTree = async function (id) {
    // const response = await this.aggregate([
    //     {
    //         $match: {
    //             estrutura_org : new mongoose.Types.ObjectId(id),
    //             estrutura_parent: 0
    //         }
    //     }
    //     ,{
    //         $graphLookup: {
    //             from: 'estrutura',
    //             startWith: '$_id',
    //             connectFromField: '_id',
    //             connectToField: 'estrutura_parent',
    //             depthField: "level",
    //             as: 'children'
    //         }
    //     }
    //     ,{
    //         $unwind: {
    //           path: "$children",
    //           preserveNullAndEmptyArrays: true,
    //           includeArrayIndex: "index"
    //         }
    //     }
    //     ,{
    //         $sort: {
    //             "children.level": -1
    //         }
    //     }    
    //     ,{
    //         $group: {
    //             _id: "$_id",
    //             estrutura_parent: { $first: "$estrutura_parent" },
    //             estrutura_descr: { $first: "$estrutura_descr" },
    //             estrutura_cod: { $first: "$estrutura_cod" },
    //             estrutura_org: { $first: "$estrutura_org" },
    //             estrutura_responsavel: { $first: "$estrutura_responsavel" },
    //             children: { $push: "$children" }
    //         }
    //     }
    //     ,{
    //         $addFields: {
    //             children: {
    //                 $reduce: {
    //                     input: "$children",
    //                     initialValue: { level: -1, presentChild: [], prevChild: [] },
    //                     in: {
    //                         $let: {
    //                             vars: {
    //                                 prev: {
    //                                     $cond: [
    //                                         { 
    //                                             $eq: ["$$value.level", "$$this.level"]
    //                                         },
    //                                         "$$value.prevChild",
    //                                         "$$value.presentChild"
    //                                     ]
    //                                 },
    //                                 current: {
    //                                     $cond: [
    //                                         { 
    //                                             $eq: ["$$value.level", "$$this.level"]
    //                                         },
    //                                         "$$value.presentChild",
    //                                         []
    //                                     ]
    //                                 }
    //                             },
    //                             in: {
    //                                 level: "$$this.level",
    //                                 prevChild: "$$prev",
    //                                 presentChild: {
    //                                     $concatArrays: [
    //                                         "$$current",
    //                                         [
    //                                             {
    //                                                 $mergeObjects: [
    //                                                     "$$this",
    //                                                     {
    //                                                         children: {
    //                                                             $filter: {
    //                                                                 input: "$$prev",
    //                                                                 as: "e",
    //                                                                 cond: {
    //                                                                     $eq: ["$$e.estrutura_parent", "$$this._id"]
    //                                                                 }
    //                                                             }
    //                                                         }
    //                                                     }
    //                                                 ]
    //                                             }
    //                                         ]
    //                                     ]
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $addFields: {
    //             children: "$children.presentChild"
    //         }
    //     },
    //     {
    //         $sort: {
    //             "level": 1,
    //             "_id": 1
    //         }

    //     }
    //     /** Faz o lookup para trazer o proprietario */
    //     ,{
    //         $lookup: {
    //             from: 'usuario',
    //             localField: 'estrutura_responsavel',
    //             foreignField: '_id',
    //             let: {
    //                 usuario_nomeCompleto: {
    //                     $concat: ["$nomeCompleto", " ", "$usuario_sobrenome"]
    //                 }
    //             },
    //             pipeline:[
    //                 {
    //                     $project: {
    //                         usuario_nome: 1,
    //                         usuario_sobrenome: 1
    //                     }
    //                 },
    //                 {
    //                     $addFields: {
    //                         usuario_nomeCompleto: {
    //                         $concat: ["$usuario_nome", " ", "$usuario_sobrenome"]
    //                         }
    //                     }
    //                 }
    //             ],
    //             as: 'responsavel'
    //         }
    //     }
    //     ,{
    //         $unwind: {
    //             path: '$responsavel',
    //             preserveNullAndEmptyArrays: true
    //         }
    //     },
    //     {
    //         $addFields: {
    //             "responsavel_estrutura": {
    //                 $mergeObjects: [
    //                     {
    //                         $arrayElemAt: ["$responsavel", 0]
    //                     },
    //                     {
    //                         $cond: {
    //                             if: { $eq: ["$estrutura_responsavel", "$_id"] },
    //                             then: "$$ROOT",
    //                             else: {}
    //                         }
    //                     }
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         $addFields: {
    //             "children.responsavel_estrutura": {
    //                 $map: {
    //                     input: "$children",
    //                     as: "child",
    //                     in: {
    //                         $mergeObjects: [
    //                             "$$child",
    //                             {
    //                                 $cond: {
    //                                     if: { $eq: ["$$child.estrutura_responsavel", "$$child._id"] },
    //                                     then: "$$ROOT",
    //                                     else: {}
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             estrutura_parent: 1,
    //             estrutura_descr: 1,
    //             estrutura_cod: 1,
    //             estrutura_org: 1,
    //             estrutura_responsavel: 1,
    //             children: 1,
    //             responsavel_estrutura: {
    //                 $cond: {
    //                     if: { $eq: ["$estrutura_responsavel", "$_id"] },
    //                     then: "$$ROOT",
    //                     else: {}
    //                 }
    //             }
    //         }
    //     }
    //     ])        
    const response = await this.aggregate([
        {
            $match: {
                estrutura_org: new mongoose.Types.ObjectId(id),
                estrutura_parent: 0
            }
        },
        {
            $graphLookup: {
                from: 'estrutura',
                startWith: '$_id',
                connectFromField: '_id',
                connectToField: 'estrutura_parent',
                depthField: 'level',
                as: 'children'
            }
        },
        {
            $lookup: {
                from: 'usuario',
                localField: 'estrutura_responsavel',
                foreignField: '_id',
                as: 'responsavel'
            }
        },
        {
            $unwind: {
                path: '$responsavel',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                'responsavel_estrutura': {
                    $cond: {
                        if: { $eq: ['$estrutura_responsavel', '$responsavel._id'] },
                        then: {
                            _id: '$responsavel._id',
                            nomeCompleto: { $concat: ['$responsavel.usuario_nome', ' ', '$responsavel.usuario_sobrenome'] }
                        },
                        else: {}
                    }
                }
            }
        },
        {
            $addFields: {
                'children': {
                    $map: {
                        input: '$children',
                        as: 'child',
                        in: {
                            $mergeObjects: [
                                '$$child',
                                {
                                    'responsavel_estrutura': {
                                        $cond: {
                                            if: { $eq: ['$$child.estrutura_responsavel', '$responsavel._id'] },
                                            then: {
                                                _id: '$responsavel._id',
                                                nomeCompleto: { $concat: ['$responsavel.usuario_nome', ' ', '$responsavel.usuario_sobrenome'] }
                                            },
                                            else: {}
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                'children': {
                    $map: {
                        input: '$children',
                        as: 'child',
                        in: {
                            $mergeObjects: [
                                '$$child',
                                {
                                    'createdAt': '$$REMOVE',
                                    'lastModified': '$$REMOVE'
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project: {
                '_id': 1,
                'estrutura_parent': 1,
                'estrutura_descr': 1,
                'estrutura_cod': 1,
                'estrutura_org': 1,
                'estrutura_responsavel': 1,
                'responsavel_estrutura': 1,
                'children': {
                    $map: {
                        input: '$children',
                        as: 'child',
                        in: {
                            $mergeObjects: [
                                '$$child',
                                {
                                    'createdAt': '$$REMOVE',
                                    'lastModified': '$$REMOVE'
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $sort: {
                'level': 1,
                '_id': 1
            }
        }
    ]);
          
            
    return response
}

const Estrutura = mongoose.model('Estrutura', estruturaSchema)

export { Estrutura }