class BasePublisher {
    constructor (singleton) {
        this.cliente = singleton
    }

    publish (assunto, mensagem) {
        try {
            const msg = JSON.stringify(mensagem)

            this.cliente.publish(assunto, msg, (e) => {
                if(e){
                    process.stdout.write(`Falha ao publicar mensagem: ${e}.\n`)
                } else {
                    process.stdout.write(`Evento ${assunto}, id = ${mensagem_corrId} publicado com sucesso.\n`)
                }
            })
        } catch (e) {
            process.stdout.write(e.stack + '\n')
        }
    }
}

export { BasePublisher }