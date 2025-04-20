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
        fileList = Array.from(files).map(file => file.name); // Armazena apenas os nomes dos arquivos
        
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
            // Caso o tipo de arquivo seja inválido
            if (data.status && data.status === 'falha: Tipo de arquivo inválido') {
                return {
                    fileName: data.fileName,
                    fileUrl: null,
                    status: data.status, // "falha: Tipo de arquivo inválido"
                };
            }

            const presignedUrl = data.presignedUrl;
            const fileUrl = data.fileUrl; // URL final de acesso ao arquivo no S3
            
            if (!presignedUrl || !fileUrl) {
                throw new Error(`URL não retornada para ${name}`);
            }

            // Realiza o upload do arquivo para o S3
            return uploadFileToS3(name, presignedUrl, files[index]).then(() => ({
                fileName: name,
                fileUrl: fileUrl,
                status: 'sucesso', // Status de sucesso
            }));
        })
        .catch(error => {
            console.error(`Erro ao processar o arquivo ${name}:`, error);
            return {
                fileName: name,
                fileUrl: null,
                status: `falha: ${error.message}`,
            };
        });
    });

    Promise.all(uploadPromises)
        .then((uploadedFiles) => {
            const fileUrls = uploadedFiles.map(file => {
                return `${file.fileName};${file.fileUrl || 'null'};${file.status}`;
            });
            
            bubble_fn_fileList(fileUrls); // Envia a lista final para o Bubble
        })
        .catch(error => {
            console.error('Erro durante o processamento dos arquivos:', error);
        });
}

// Função para upload do arquivo para o S3
function uploadFileToS3(fileName, presignedUrl, file) {
    return fetch(presignedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro no upload para o S3');
        }
    });
}