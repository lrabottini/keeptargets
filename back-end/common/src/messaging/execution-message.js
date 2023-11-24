import { format } from 'date-fns'

class ExecutionMessage {
    constructor (messageType, action, messageDesc, params, errors) {
        this.date = format(Date.now(), 'dd/MM/yyyy HH:mm:ss')
        this.action = action
        this.messageType = messageType
        this.messageDesc = messageDesc
        this.params = params
        this.errors = errors
    }
}

export { ExecutionMessage }