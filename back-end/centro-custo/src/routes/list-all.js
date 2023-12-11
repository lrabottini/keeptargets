import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { CentroCusto } from '../models/centro-custo.js'

const router = express.Router()

// function aplanarEstrutura(hierarquia) {
//     const flatHierarchy = [];
//     let ordem = 100000
    
//     function aplanar(item, depth, ordem) {
//         const { _id, centrocusto_parent, centrocusto_descr, centrocusto_cod, centrocusto_org, children } = item;
//         const centrocusto_hasChildren = children.length > 0
//         //const index = ordem + depth
        
//         flatHierarchy.push({ _id, centrocusto_parent, centrocusto_descr, centrocusto_cod, centrocusto_org, centrocusto_hasChildren, depth, ordem });
        
//         ordem = ordem + 1
            
//         if (children && children.length > 0) {

//             children.forEach(child => aplanar(child, depth + 1, ordem));
//         }
//     }

//     hierarquia.forEach(item => {
//         aplanar(item, 0, ordem)

//         ordem = ordem + 100000
//     });
//     return flatHierarchy;
// }

function aplanarEstrutura(hierarquia) {
    const flatHierarchy = [];
    const prefixStack = [];

    function aplanar(item, prefix, level) {
        const { _id, children, ...rest } = item;

        const hasChildren = children && children.length > 0;

        const currentSuffix = flatHierarchy.length + 1;
        const currentPrefix = prefix ? prefix + currentSuffix.toString() : currentSuffix;

        flatHierarchy.push({
            _id,
            ...rest,
            suffix: currentSuffix,
            prefix: currentPrefix.toString(),
            level,
            hasChildren,
        });

        if (hasChildren) {
            children.forEach((child, index) => {
                aplanar(child, currentPrefix, level + 1);
            });
        }
    }

    hierarquia.forEach(item => {
        aplanar(item, '', 0);
    });

    return flatHierarchy;
}

router.get('/centrocusto/all/:org', async (req, res) => {
    try {
        const centrocusto = await CentroCusto.returnTree(req.params.org)

        const estruturaAplanada = aplanarEstrutura(centrocusto);
        
        res.send(estruturaAplanada)
    } catch (e) {
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar centros de custo.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllCentroCusto }