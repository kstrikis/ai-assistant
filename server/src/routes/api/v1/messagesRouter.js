import express from "express"
import { ValidationError } from "objection"
import { Dialog, Message } from "../../../models/index.js"
import { messageShow, messagesArrayShow, unreviewedSerializer } from "./serializers/messagesSerializer.js"
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
        if (!dialog) {
            return res.status(403).json({ errors: "forbidden" })
        }
        const dialogUserId = parseInt(dialog.userId)
        if (requestingUser !== dialogUserId) {
            return res.status(403).json({ errors: "forbidden" })
        }

        const messages = await Message
            .query()
            .where('dialogId', dialogId)
            .withGraphFetched('answers')
            .whereNull('parentMessageId')
        return res.status(200).json({ messages: messagesArrayShow(messages) })
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

        const teacherClassroomId = req.user.classroomId
        const answers = await Message
            .query()
            .join('dialogs', 'messages.dialogId', 'dialogs.id')
            .join('users', 'dialogs.userId', 'users.id')
            .where('messageType', 'answer')
            .andWhere('reviewed', false)
            .andWhere('users.classroomId', teacherClassroomId)
            .withGraphFetched('question')
            .select('messages.*')

        return res.status(200).json({ messages: unreviewedSerializer(answers) })
    } catch (err) {
        return res.status(500).json({ errors: err.message })
    }
})

const createAnswer = async (question) => {
    try {
        const answer = await retrieveAnswer(question)
        const answerObject = {
            content: answer,
            messageType: "answer",
            reviewed: false,
            dialogId: question.dialogId,
            parentMessageId: question.id
        }

    await Message.query().insert(answerObject)
    } catch(err) {
        const apiErrAnswer = {
            content: `Error in API request: ${err.message}`,
            messageType: "answer",
            reviewed: true,
            dialogId: question.dialogId,
            parentMessageId: question.id
        }
        await Message.query().insert(apiErrAnswer)
    }
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

        return res.status(201).json({...messageShow(newQuestion), answers: [{id: newQuestion.id, content: "Asking LLM..."}]})
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
    const answerContent = req.body.answerContent
    try {
        if (!req.user) {
            return res.status(401).json({ errors: "must be logged in" })
        }
        if (req.user.role !== "teacher") {
            return res.status(403).json({ errors: "must be a teacher to perform this action" })
        }
        if (!req.query.pass || !req.body.answerContent) {
            return res.status(400).json({ errors: "parameter missing" })
        }
        const rejectedMessage = "The answer was rejected. Please rephrase the question and try again."
        const newContent = req.query.pass === "pass" ? answerContent : rejectedMessage
        const answer = await Message.query().patchAndFetchById(id, { reviewed: true, content: newContent })
        await Message.query().patchAndFetchById(answer.parentMessageId, { reviewed: true })
        return res.status(200).json({ messages: "Answer reviewed successfully" })
    } catch(err) {
        return res.status(500).json({ errors: err.message })
    }
})

export default messagesRouter