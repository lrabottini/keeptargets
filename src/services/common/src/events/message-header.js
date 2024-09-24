import { format } from 'date-fns'

class MessageHeader {
    constructor(){
        this.subject = '',
        this.date = format(Date.now(), 'dd/mm/yyyy HH:mm:ss')
        this.corrId = ''
    }
}

export { MessageHeader }