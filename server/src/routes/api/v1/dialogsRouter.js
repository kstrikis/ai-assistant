import express from "express"
import { Dialog, User } from "../../../models/index.js"
import { dialogsForList } from "./serializers/dialogsSerializer.js"

const dialogsRouter = new express.Router()

dialogsRouter.get("/", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ errors: "must be logged in" })
        }
        
        const requestingUser = parseInt(req.user.id)
        const userToRetrieve = req.query.user_id ? parseInt(req.query.user_id) : requestingUser
        if ( (requestingUser !== userToRetrieve) && (req.user.role !== "teacher") ) {
            return res.status(403).json({ errors: "forbidden" })
        }
        
        const userObject = await User.query().findById(userToRetrieve)
        const dialogs = await userObject.$relatedQuery("dialogs").orderBy('id')
        return res.status(200).json({ dialogs: dialogsForList(dialogs) })
    } catch (err) {
        return res.status(500).json({ errors: err.message })
    }
})

dialogsRouter.post("/", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ errors: "must be logged in" })
        }

        const userId = req.user.id
        const newDialog = await Dialog.query().insertAndFetch({userId})
        return res.status(201).json({ dialogId: newDialog.id })
    } catch (err) {
        return res.status(500).json({ errors: err.message })
    }
})

dialogsRouter.delete("/:id", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ errors: "must be logged in" })
        }
        const dialogId = req.params.id
        const userId = req.user.id
        const dialog = await Dialog.query().findById(dialogId)
        if (dialog.userId !== userId) {
            return res.status(403).json({ errors: "forbidden" })
        }
        await Dialog.query().deleteById(dialogId)
        return res.status(200).json({ message: "dialog deleted" })
    } catch (err) {
        return res.status(500).json({ errors: err.message })
    }
})

export default dialogsRouter