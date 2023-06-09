const baseUrl = "/api/v1"

const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options)
        if (!response.ok) {
            const errorBody = await response.json()
            if (response.status === 422) {
                return errorBody
            } else {
                throw new Error(`Error in fetch: ${response.status} (${response.statusText}) ${errorBody.errors}`)
            }
        }
        return (await response.json())
    } catch (err) {
        return console.error(err.message)
    }
}

export const fetchDialogs = async (userId) => {
    const url = userId ? `${baseUrl}/dialogs?user_id=${userId}` : `${baseUrl}/dialogs`
    return await fetchData(url)
}

export const fetchMessages = async (dialogId) => {
    return await fetchData(`${baseUrl}/messages?dialog_id=${dialogId}`)
}

export const fetchUnreviewed = async () => {
    return await fetchData(`${baseUrl}/messages/unreviewed`)
}

export const createNewDialog = async () => {
    const url = `${baseUrl}/dialogs`
    const options = {
        method: "POST"
    }
    return await fetchData(url, options)
}

export const deleteDialog = async (dialogId) => {
    const url = `${baseUrl}/dialogs/${dialogId}`
    const options = {
        method: "DELETE"
    }
    return await fetchData(url, options)
}

export const postQuestion = async (dialogId, question) => {
    const url = `${baseUrl}/messages?dialog_id=${dialogId}`
    const options = {
        method: "POST",
        body: JSON.stringify({ content: question }),
        headers: new Headers({"Content-Type": "application/json"})
    }
    return await fetchData(url, options)
}

export const patchAnswer = async (answerId, passStatus, answerContent) => {
    const url = `${baseUrl}/messages/${answerId}?pass=${passStatus}`
    const options = {
        method: "PATCH",
        body: JSON.stringify({ answerContent }),
        headers: new Headers({"Content-Type": "application/json"})
    }
    return await fetchData(url, options)
}

export const fetchClassrooms = async () => {
    return await fetchData(`${baseUrl}/classrooms`)
}