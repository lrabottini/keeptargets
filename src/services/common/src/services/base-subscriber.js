class BaseSubscriber{
    constructor(client, assunto, grupo) {
        this.client = client
        this.assunto = assunto
        this.grupo = grupo
        this.ackWait = 5 * 1000
        }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.grupo)
            .setStartWithLastReceived()
    }

    listen() {
        const subscription = this.client.subscribe(
            this.assunto,
            this.grupo,
            this.subscriptionOptions()
        )

        subscription.on('ready', () => {
            subscription.on('message', (msg) => {
                const parseData = this.parseMessage(msg)
                this.onMessage(parseData, msg)
            })
        });

        subscription.on('error', (err) => {
            console.log('subscription failed', err);
        });

        subscription.on('timeout', (err) => {
            console.log('subscription timeout', err)
        });
        
        subscription.on('unsubscribed', () => {
            console.log('subscription unsubscribed')
        });
    }

    parseMessage(msg) {
        const data =  msg.getData()
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'))
    }

    onMessage(data, msg) {
        process.stdout.write(`Message received: ${this.assunto} / ${this.grupo}\n`)
        msg.ack()
    }
}

export { BaseSubscriber }