export const messageShow = (message) => {
    const allowedAttributes = ["id", "content", "reviewed"]

    let returnMessage = {}
    let returnMessageAnswers = []
    for (const attribute of allowedAttributes) {
        if (message[attribute]) {
            returnMessage[attribute] = message[attribute]
        }
    }
    if (message.answers) {
        message.answers.map(answer => {
            returnMessageAnswers.push({
                id: answer.id,
                content: answer.content,
                reviewed: answer.reviewed
            })
        })
    }
    return { ...returnMessage, answers: returnMessageAnswers }
}

export const messagesArrayShow = (messages) => {
    const returnedArray = messages.map(message => {
        return messageShow(message)
    })
    returnedArray.sort((a, b) => a.id - b.id)
    return returnedArray
}

export const messagesArrayShowStudent = (messages) => {
    messages.sort((a, b) => a.id - b.id)
    const returnedArray = messages.map(message => {
        message.answers.map(answer => {
            if (!answer.reviewed) {
                answer.content = "The answer to this question is pending review."
            }
        })
        return messageShow(message)
    })
    returnedArray.sort((a, b) => a.id - b.id)
    return returnedArray
}

export const unreviewedSerializer = (answers) => {
    const pairs = answers.map(answer => {
        return {
            questionId: answer.question.id,
            questionContent: answer.question.content,
            answerId: answer.id,
            answerContent: answer.content
        }
    })
    pairs.sort((a, b) => a.questionId - b.questionId)
    return pairs
}