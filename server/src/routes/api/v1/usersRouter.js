import express from "express";
import { ValidationError } from "objection";

import { User, Classroom } from "../../../models/index.js";

const usersRouter = new express.Router();

usersRouter.post("/", async (req, res) => {
  const { email, password, role, classroomId, classroomName } = req.body;
  try {
    const persistedUser = await User.query().insertAndFetch({ email, password, role, classroomId });
    if (persistedUser.role === "teacher") {
      const newClassroom = await Classroom.query().insertAndFetch({ 'name': classroomName })
      await persistedUser.$query().patch({ 'classroomId': newClassroom.id })
    }
    return req.login(persistedUser, () => {
      return res.status(201).json({ user: persistedUser });
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data });
    }
    return res.status(500).json({ errors: error.message });
  }
});

export default usersRouter;