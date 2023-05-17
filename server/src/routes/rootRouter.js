import express from "express";
import userSessionsRouter from "./api/v1/userSessionsRouter.js";
import usersRouter from "./api/v1/usersRouter.js";
import clientRouter from "./clientRouter.js";
import dialogsRouter from "./api/v1/dialogsRouter.js";
import messagesRouter from "./api/v1/messagesRouter.js";

const rootRouter = new express.Router();
rootRouter.use("/", clientRouter);
rootRouter.use("/api/v1/user-sessions", userSessionsRouter);
rootRouter.use("/api/v1/users", usersRouter);
rootRouter.use("/api/v1/dialogs", dialogsRouter);
rootRouter.use("/api/v1/messages", messagesRouter);

export default rootRouter;
