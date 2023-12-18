function aplanarEstrutura(hierarquia) {
    const flatHierarchy = [];
    
    function aplanar(item, prefix, level) {
        const { _id, children, ...rest } = item;

        const line = '-'
        let descrIdendata = ''
        if (level > 0) {
            descrIdendata = ''.concat('|', '-'.repeat(4 * level), rest.estrutura_descr)
        } else{
            descrIdendata = rest.estrutura_descr
        }

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
            descrIdendata
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

export { aplanarEstrutura }