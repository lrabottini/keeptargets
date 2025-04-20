// Cria o input do tipo file
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'application/pdf'; // Aceita apenas arquivos PDF
fileInput.multiple = true; // Permite selecionar múltiplos arquivos

// Variável para armazenar a lista de arquivos
let fileList = [];

// Evento para capturar os arquivos selecionados
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;

    if (files.length > 0) {
        // Converte a lista de arquivos para um array de strings contendo o nome do arquivo
        fileList = Array.from(files).map(file => file.name.replaceAll(" ", "_")); // Armazena apenas os nomes dos arquivos
        
        // Chama a função para gerar as URLs pré-assinadas e fazer o upload
        bubble_fn_retornaArquivosSelecionados(fileList)
    }
});

// Dispara o diálogo de seleção de arquivos
fileInput.click();