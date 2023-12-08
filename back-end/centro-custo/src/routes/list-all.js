import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { CentroCusto } from '../models/centro-custo.js'

const router = express.Router()

function aplanarEstrutura(hierarquia) {
    const flatHierarchy = [];

    function aplanar(item, depth) {
        const { _id, centrocusto_parent, centrocusto_descr, centrocusto_cod, centrocusto_org, children } = item;
        flatHierarchy.push({ _id, centrocusto_parent, centrocusto_descr, centrocusto_cod, centrocusto_org, depth });
        
        if (children && children.length > 0) {
            children.forEach(child => aplanar(child, depth + 1));
        }
    }

    hierarquia.forEach(item => aplanar(item, 0));
    
    return flatHierarchy;
}

// Sua estrutura hierárquica
const estruturaHierarquica = [
    // ... a estrutura fornecida anteriormente ...
];

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