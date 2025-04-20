let processados = properties.paramlist1.get(0, properties.paramlist1.length());
let carregados = properties.paramlist2.get(0, properties.paramlist2.length());

processados.forEach((obj1) => {
    const nomeArquivo = obj1.get('nome_text');

    carregados = carregados.filter(item => !item.includes(nomeArquivo));
});

bubble_fn_validaProcessados(carregados);