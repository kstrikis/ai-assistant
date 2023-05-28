import { Configuration, OpenAIApi } from "openai"

const initialize = () => {
    const apiKey = process.env.OPENAI_API_KEY
    const org = process.env.OPENAI_ORG
    const configuration = new Configuration({
        organization: org,
        apiKey: apiKey,
    })
    
    return new OpenAIApi(configuration)
}

export const retrieveAnswer = async (question) => {
    const promptGiveHints = "You are a teaching assistant in a classroom. You will provide answers to students that encourage critical thinking and growth instead of direct answers. Generally, your first response of the conversation will be a helpful hint toward solving the problem. If, however, the question is asking for technical assistance like how to access the course material itself you will respond very directly and concisely. If, however, the question resembles a direct copy+paste of a homework problem, you will be sure to advise the student on how to better formulate their question, and give an example of how to do so."
    const prompt = [{ role: "system", content: promptGiveHints}]
    const dialogHistory = await question.messagesForApi()
    const messages = prompt.concat(dialogHistory, { role: "user", content: question.content })
    const openai = initialize()
    const response = await openai.createChatCompletion({
        // model: "gpt-3.5-turbo",
        model: "gpt-4",
        messages: messages
    })
    return response.data.choices[0].message.content
}