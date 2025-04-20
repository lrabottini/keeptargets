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
        generatePresignedUrls(fileList, files);  // Passando também o array de arquivos para validação
    }
});

// Dispara o diálogo de seleção de arquivos
fileInput.click();

// Função para gerar URLs pré-assinadas
function generatePresignedUrls(fileList, files) {
    const uploadPromises = fileList.map((name, index) => {
        return fetch('https://8qo9zlerhj.execute-api.sa-east-1.amazonaws.com/prod/geraurlassinada', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: name, fileType: files[index].type })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)

            // Caso o tipo de arquivo seja inválido
            if (data.status && data.status === 'falha: Tipo de arquivo inválido') {
                console.log('Tipo de arquivo inválido')
                throw new Error(`Tipo de arquivo inválido`);
            }

            // Caso o arquivo já exista
            if (!data.presignedUrl && data.fileUrl) {
                console.log('Arquivo já existe')
                return {
                    fileName: name,
                    fileUrl: data.fileUrl,
                    status: data.status,
                    contexto: data.contexto,
                    mensagem: data.mensagem
                }
            }
            
            // Caso a URL não seja retornada
            if (!data.presignedUrl && !data.fileUrl) {
                console.log('URL não retornada')
                throw new Error(`URL não retornada`);
            }

            // Realiza o upload do arquivo para o S3
            console.log('Realiza o upload')
            return uploadFileToS3(name, data.presignedUrl, files[index]).then((response) => ({
                fileName: name,
                fileUrl: data.fileUrl,
                status: response.status,
                contexto: response.contexto,
                mensagem: response.mensagem
            }));
        })
        .catch(error => {
            console.error(`Erro ao processar o arquivo ${name}:`, error);
            return {
                fileName: name,
                fileUrl: fileUrl,
                status: "falha",
                contexto: '',
                mensagem: error.message
            }
        });
    });

    Promise.all(uploadPromises)
        .then((uploadedFiles) => {
            let situacao = ""
            let notFoundCount = 0

            console.log('Conta quantidade de falhas')
            const fileUrls = uploadedFiles.map(file => {
                console.log(file)
                // Valida se processo terminou com sucesso, falha parcial ou geral
                notFoundCount += file.status
                situacao = notFoundCount === 0
                    ? "sucesso"
                    : notFoundCount === uploadedFiles.length
                    ? "falha"
                    : "falha parcial";
    
                return `${file.status};${file.fileName};${file.fileUrl || 'null'};'';${file.mensagem}`;
            });
            
            fileUrls.unshift(situacao)
            bubble_fn_fileList(fileUrls); // Envia a lista final para o Bubble
        })
        .catch(error => {
            console.error('Erro durante o processamento dos arquivos:', error);
            return {
                fileName: null,
                fileUrl: null,
                status: "falha",
                contexto: '',
                mensagem: error.message
            }
        });
    
}

// Função para upload do arquivo para o S3
function uploadFileToS3(fileName, presignedUrl, file) {
    let status = ""
    let mensagem = ""

    return fetch(presignedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    })
    .then(response => {
        if (!response.ok) {
            status = "falha"
            mensagem = new Error('Erro no upload para o S3')
        } else {
            status = "sucesso"
            mensagem = "Arquivo carregado com sucesso"
        }
        console.log(response)
        return {
            fileName: fileName,
            fileUrl: '',
            status: status,
            contexto: '',
            mensagem: mensagem
        }
    });
}
