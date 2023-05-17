import express from "express"
import { ValidationError } from "objection"
import { Dialog, User } from "../../../models/index.js"
import { dialogsForList } from "./serializers/dialogsSerializer.js"

const dialogsRouter = new express.Router()

dialogsRouter.get("/", async (req, res) => {
    try {
        if (!req.user) {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(401)
                .json({ errors: "must be logged in" })
            )
        } 
        
        const requestingUser = parseInt(req.user.id)
        const userToRetrieve = req.query.user_id ? parseInt(req.query.user_id) : requestingUser
        if ( (requestingUser !== userToRetrieve) && (req.user.role !== "teacher") ) {
            return (
                res
                .set({"Content-Type": "application/json"})
                .status(401)
                .json({ errors: "unauthorized" })
            )
        }
        
        const userObject = await User.query().findById(userToRetrieve)
        const dialogs = await userObject.$relatedQuery("dialogs")
        return (
            res
            .set({"Content-Type": "application/json"})
            .status(200)
            .json({ dialogs: dialogsForList(dialogs) })
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

dialogsRouter.post("/new", async (req, res) => {
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
        const newDialog = await Dialog.query().insertAndFetch({userId})
        return (
            res
            .set({"Content-Type": "application/json"})
            .status(201)
            .json({ dialogId: newDialog.id })
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

export default dialogsRouter