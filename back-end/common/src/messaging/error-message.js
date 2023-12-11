class ErrorMessage {
    constructor () {
        this.errors = []
    }

    addError(type, value, message, path, location){
        const error = {
            type: type,
            value: value,
            msg: message,
            path: path,
            location: location
        }

        this.errors.push(error)
    }
}

export { ErrorMessage }
