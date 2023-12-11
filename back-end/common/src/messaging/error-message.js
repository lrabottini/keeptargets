class ErrorMessage {
    constructor () {
        this.errors = []
    }

    static addError(message){
        const error = {
            type: 'ERROR',
            value: '',
            msg: message,
            path: '',
            location: ''
        }

        this.errors.push(error)
    }
}

export { ErrorMessage }
