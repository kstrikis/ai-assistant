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
    const openai = initialize()
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: question },
        ]
    })
    return response.data.choices[0].message.content
}