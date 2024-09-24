import nats from 'node-nats-streaming'

class NatsConnector {
    get connection() {
        return this._connection
    }
    
    connect(clusterId, clientId, url){
        if (!NatsConnector.instance){
            this._connection = nats.connect(clusterId, clientId,  { url })
            
            this._connection.on('connect', () => {
              console.log('Conectado com sucesso ao servidor NATS.')
            })
            
            this._connection.on('error', (err) => {
              console.error(`Erro ao conectar no servidor NATS: ${err}`)
            })
        }
    }
    
    close() {
        if (this._connection){
            this._connection.close()
            console.log('Desconectado com sucesso do servidor NATS')
        }
    }
    
}

export const natsConnector = new NatsConnector()