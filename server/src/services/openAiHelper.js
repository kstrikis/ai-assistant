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
    const promptHintsOnly = "You are a teaching assistant in a classroom. You will provide answers to students that encourage critical thinking and growth instead of direct answers. The teacher of the class will your review your answers before the student may read them to ensure they do not spoil the coursework. If the question asked sounds too similar to the exact wording of a homework or exam question you must gently chide the student and suggest how they could express what specifically they are confused about."
    
    const openai = initialize()
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        // model: "gpt-4",
        messages: [
            { role: "system", content: promptHintsOnly },
            { role: "user", content: question },
        ]
    })
    return response.data.choices[0].message.content
}