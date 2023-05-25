import express from "express";
import getClientIndexPath from "../config/getClientIndexPath.js";

const router = new express.Router();

const clientRoutes = ["/user-sessions/new", "/users/new", "/users/new/:role", "/about"];
const authedClientRoutes = ["/ask", "/ask/:id", "/answer"];
const teacherRoutes = ["/answer"]

router.get("/", (req, res) => {
  if (!req.user) {
    res.sendFile(getClientIndexPath());
  } else if (req.user.role === "teacher") {
    res.redirect("/answer")
  } else {
    res.redirect("/ask")
  }
})

router.get(clientRoutes, (req, res) => {
  res.sendFile(getClientIndexPath());
});

router.get(authedClientRoutes, (req, res) => {
  if (req.user) {
    res.sendFile(getClientIndexPath());
  } else {
    res.redirect("/user-sessions/new")
  }
});

router.get(teacherRoutes, (req, res) => {
  if (!req.user) {
    res.redirect("/user-sessions/new")
  } else if (req.user.role === "teacher") {
    res.sendFile(getClientIndexPath());
  } else {
    res.redirect("/ask")
  }
});

export default router;
