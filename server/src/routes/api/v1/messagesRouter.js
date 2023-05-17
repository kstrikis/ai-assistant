import express from "express"
import { ValidationError } from "objection"
import { Dialog, Message } from "../../../models/index.js"
import { messagesArrayShow } from "./serializers/messagesSerializer.js"
import cleanUserInput from "../../../services/cleanUserInput.js"

const messagesRouter = new express.Router({ mergeParams: true })

messagesRouter.get("/", async (req, res) => {
    try {
        if (!req.user) {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(401)
                .json({ errors: "must be logged in" })
            )
        } 
        if (!req.query.dialog_id) {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(400)
                .json({ errors: "dialog_id required" })
            )
        } 

        const requestingUser = parseInt(req.user.id)
        const dialogId = parseInt(req.query.dialog_id)
        const dialog = await Dialog.query().findById(dialogId)
        const dialogUserId = parseInt(dialog.userId)

        if (requestingUser !== dialogUserId) {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(401)
                .json({ error: "unauthorized" })
            )
        }

        const messages = await dialog.$relatedQuery("messages")
        return (
            res
            .set({"Content-Type": "application/json"})
            .status(200)
            .json({ messages: messagesArrayShow(messages) })
        )
    } catch (err) {
        return (
            res
            .set({"Content-Type": "application/json"})
            .status(500)
            .json({ errors: err.message })
        )
    }
})

messagesRouter.post("/", async (req, res) => {
    try {
        if (!req.user) {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(401)
                .json({ errors: "must be logged in" })
            )
        }

        const userId = parseInt(req.user.id)
        const dialogId = parseInt(req.query.dialog_id)
        const dialog = await Dialog.query().findById(dialogId)
        const dialogUserId = parseInt(dialog.userId)
        if (userId !== dialogUserId) {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(401)
                .json({ errors: "unauthorized" })
            )
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
        return (
            res
            .set({"Content-Type": "application/json"})
            .status(201)
            .json(newQuestion)
        )
    } catch (err) {
        if (err instanceof ValidationError) {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(422)
                .json({ errors: err.data })
            )
        } else {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(500)
                .json({ errors: err.message })
            )
        }
    }
})

export default messagesRouter