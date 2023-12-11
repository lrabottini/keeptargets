class ErrorMessage {
    constructor () {
        this.errors = []
    }

    set function addError(message){
        const error = {
            type: "ERROR"
            value: ""
            msg: message
            path: ""
            location: ""
        }

        this.errors.push(error)
    }
}

export { ErrorMessage }
