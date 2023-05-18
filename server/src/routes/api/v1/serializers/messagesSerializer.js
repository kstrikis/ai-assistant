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

export const messagesArrayShowStudent = (messages) => {
    const returnedArray = messages.map(message => {
        if (message.messageType === "answer" && !message.reviewed) {
            message.content = "The answer to this question is pending review."
        }
        return messageShow(message)
    })
    return returnedArray
}

export const questionAnswerPairShow = (question, answer) => {
    return {
        questionId: question.id,
        questionContent: question.content,
        answerId: answer.id,
        answerContent: answer.content
    }
}