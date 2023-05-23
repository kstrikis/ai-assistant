import express from "express"
import { ValidationError } from "objection"
import { Dialog, Message } from "../../../models/index.js"
import { messagesArrayShow, messagesArrayShowStudent, unreviewedSerializer } from "./serializers/messagesSerializer.js"
import cleanUserInput from "../../../services/cleanUserInput.js"
import { retrieveAnswer } from "../../../services/openAiHelper.js"


const messagesRouter = new express.Router({ mergeParams: true })

messagesRouter.get("/", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ errors: "must be logged in" })
        } 
        if (!req.query.dialog_id) {
            return res.status(400).json({ errors: "dialog_id required" })
        } 

        const requestingUser = parseInt(req.user.id)
        const dialogId = req.query.dialog_id
        const dialog = await Dialog.query().findById(dialogId)
        const dialogUserId = parseInt(dialog.userId)
        if (requestingUser !== dialogUserId) {
            return res.status(403).json({ errors: "forbidden" })
        }

        const messages = await Message
            .query()
            .where('dialogId', dialogId)
            .withGraphFetched('answers')
            .whereNull('parentMessageId')
        if (req.user.role === "teacher") {
            return res.status(200).json({ messages: messagesArrayShow(messages) })
        } else {
            return res.status(200).json({ messages: messagesArrayShowStudent(messages) })
        }
    } catch (err) {
        return res.status(500).json({ errors: err.message })
    }
})

messagesRouter.get("/unreviewed", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ errors: "must be logged in" })
        } 
        if (req.user.role !== "teacher") {
            return res.status(403).json({ errors: "forbidden" })
        }

        const answers = await Message
            .query()
            .where('messageType', 'answer')
            .where('reviewed', false)
            .withGraphFetched('question')
        return res.status(200).json({ messages: unreviewedSerializer(answers) })
    } catch (err) {
        return res.status(500).json({ errors: err.message })
    }
})

const createAnswer = async (question) => {
    const answer = await retrieveAnswer(question.content)
    const answerObject = {
        content: answer,
        messageType: "answer",
        reviewed: false,
        dialogId: question.dialogId,
        parentMessageId: question.id
    }
    await Message.query().insert(answerObject)
}

messagesRouter.post("/", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ errors: "must be logged in" })
        }

        const userId = parseInt(req.user.id)
        const dialogId = parseInt(req.query.dialog_id)
        const dialog = await Dialog.query().findById(dialogId)
        const dialogUserId = parseInt(dialog.userId)
        if (userId !== dialogUserId) {
            return res.status(403).json({ errors: "forbidden" })
        }
        const content = req.body.content
        const messageType = "question"
        const reviewed = false
        const questionData = {
            content,
            messageType,
            reviewed,
            dialogId,
        }
        const cleanQuestionData = cleanUserInput(questionData)
        const newQuestion = await Message.query().insertAndFetch(cleanQuestionData)

        createAnswer(newQuestion).catch((err) => {
            console.error("error in API query: ",err)
        })

        return res.status(201).json(newQuestion)
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(422).json({ errors: err.data })
        } else {
            return res.status(500).json({ errors: err.message })
        }
    }
})

messagesRouter.patch("/:id", async (req, res) => {
    const id = req.params.id
    try {
        if (!req.user) {
            return res.status(401).json({ errors: "must be logged in" })
        }
        if (req.user.role !== "teacher") {
            return res.status(403).json({ errors: "must be a teacher to perform this action" })
        }
        if (!req.query.pass) {
            return res.status(400).json({ errors: "parameter missing" })
        }
        
        const answer = await Message.query().findOne({ id: id })
        if (req.query.pass === "pass") {
            await Message
                .query()
                .findOne({ id: id })
                .patch({ reviewed: true })
        } else {
            await Message
                .query()
                .findOne({ id: id })
                .patch({
                    reviewed: true,
                    content: "The answer was rejected. Please rephrase the question and try again."
                })
        }
        await Message
            .query()
            .findById(answer.parentMessageId)
            .patch({ reviewed: true })
        return res.status(200).json({ messages: "Answer reviewed successfully" })
    } catch(err) {
        return res.status(500).json({ errors: err.message })
    }
})

export default messagesRouter