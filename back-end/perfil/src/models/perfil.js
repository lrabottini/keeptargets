import mongoose, { SchemaTypes } from "mongoose"

const perfilSchema = new mongoose.Schema({
    perfil_org: mongoose.Types.ObjectId,
    perfil_nome: String,
    perfil_descr: String,
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
    collection: 'perfil'
})

perfilSchema.statics.returnTree = async function (id) {
    const response = await this.aggregate([
        {
            $match: {
                centrocusto_org : new mongoose.Types.ObjectId(id),
                centrocusto_parent: 0
            }
        }
        ,{
            $graphLookup: {
                from: 'centro_de_custo',
                startWith: '$_id',
                connectFromField: '_id',
                connectToField: 'centrocusto_parent',
                depthField: "level",
                as: 'children'
            }
        }
        ,{
            $unwind: {
              path: "$children",
              preserveNullAndEmptyArrays: true,
              includeArrayIndex: "index"
            }
        }
        ,{
            $sort: {
                "children.level": -1
            }
        }    
        ,{
            $group: {
                _id: "$_id",
                centrocusto_parent: { $first: "$centrocusto_parent" },
                centrocusto_descr: { $first: "$centrocusto_descr" },
                centrocusto_cod: { $first: "$centrocusto_cod" },
                centrocusto_org: { $first: "$centrocusto_org" },
                children: { $push: "$children" }
            }
        }
        ,{
            $addFields: {
                children: {
                    $reduce: {
                        input: "$children",
                        initialValue: { level: -1, presentChild: [], prevChild: [] },
                        in: {
                            $let: {
                                vars: {
                                    prev: {
                                        $cond: [
                                            { 
                                                $eq: ["$$value.level", "$$this.level"]
                                            },
                                            "$$value.prevChild",
                                            "$$value.presentChild"
                                        ]
                                    },
                                    current: {
                                        $cond: [
                                            { 
                                                $eq: ["$$value.level", "$$this.level"]
                                            },
                                            "$$value.presentChild",
                                            []
                                        ]
                                    }
                                },
                                in: {
                                    level: "$$this.level",
                                    prevChild: "$$prev",
                                    presentChild: {
                                        $concatArrays: [
                                            "$$current",
                                            [
                                                {
                                                    $mergeObjects: [
                                                        "$$this",
                                                        {
                                                            children: {
                                                                $filter: {
                                                                    input: "$$prev",
                                                                    as: "e",
                                                                    cond: {
                                                                        $eq: ["$$e.centrocusto_parent", "$$this._id"]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                children: "$children.presentChild"
            }
        },
        {
            $sort: {
                "level": 1,
                "_id": 1
            }

        }
    ])        
    
    return response
}

const Perfil = mongoose.model('Perfl', perfilSchema)

export { Perfil }