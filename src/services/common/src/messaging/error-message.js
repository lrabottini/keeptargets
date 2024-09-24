class ErrorMessage {
    constructor () {
        this.errors = []
    }

    addError(type, value, message, path, location){
        this.errors.push({
            type: type,
            value: value,
            msg: message,
            path: path,
            location: location
        })
    }
}

export { ErrorMessage }
