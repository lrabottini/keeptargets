import { format } from 'date-fns'

class ExecutionMessage {
    constructor (level, messageType, action, messageDesc, attrs, errors) {
        this.level = level
        this.date = format(Date.now(), 'dd/MM/yyyy HH:mm:ss')
        this.action = action
        this.messageType = messageType
        this.messageDesc = messageDesc
        this.attrs = attrs
        this.errors = errors
    }
}

export { ExecutionMessage }