export const messageShow = (message) => {
    const allowedAttributes = ["id", "content", "messageType", "reviewed"]

    let returnMessage = {}
    for (const attribute of allowedAttributes) {
        if (message[attribute]) {
            returnMessage[attribute] = message[attribute]
        }
    }
    return returnMessage
}

export const messagesArrayShow = (messages) => {
    const returnedArray = messages.map(message => {
        return messageShow(message)
    })
    return returnedArray
}