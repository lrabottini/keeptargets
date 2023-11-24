export const parseMessage = (msg) => {
    const data =  msg.getData()
    return typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf-8'))
}

export const onMessage = (data, msg) => {
    process.stdout.write(`Message received: ${msg.subscription.subject}\n`)
    msg.ack()
}