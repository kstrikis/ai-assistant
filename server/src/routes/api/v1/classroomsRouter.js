import express from "express"
import { Classroom } from "../../../models/index.js"

const classroomsRouter = new express.Router()

classroomsRouter.get("/", async (req, res) => {
    try {
        const classrooms = await Classroom.query().select('id', 'name')
        return res.status(200).json({ classrooms: classrooms })
    } catch(err) {
        return res.status(500).json({ errors: err.message })
    }
})

export default classroomsRouter