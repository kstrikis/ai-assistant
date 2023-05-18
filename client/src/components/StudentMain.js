import React, { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm.js";
import { fetchDialogs, fetchMessages, createNewDialog, postQuestion } from "../services/api.js";
import translateServerErrors from "../services/translateServerErrors.js";
import ErrorList from "./layout/ErrorList.js";
import { Link } from "react-router-dom";

const StudentMain = (props) => {
    const dialogId = props.match.params.id
    const [dialogs, setDialogs] = useState([])
    const [questions, setQuestions] = useState([])
    const [noDialogMessage, setNoDialogMessage] = useState("")
    const [errors, setErrors] = useState([])

    const showQuestions = questions.map(question => {
        return (
            <li className="question" key={question.id}>
                {question.content}
            </li>
        )
    })

    const showDialogs = dialogs.map(dialogListId => {
        return (
            <li className="dialog" key={dialogListId}>
                <Link to={`/ask/${dialogListId}`} >{dialogListId}</Link>
            </li>
        )
    })

    const getMessages = async () => {
        if (dialogId) {
            const retrievedMessages = await fetchMessages(dialogId)
            return setQuestions(retrievedMessages.messages)
        }
    }

    const getDialogs = async () => {
        if (props.user) {
            const retrievedDialogs = await fetchDialogs()
            return setDialogs(retrievedDialogs.dialogs)
        }
    }

    const handleNewDialog = async () => {
        const response = await createNewDialog()
        return setDialogs(dialogs.concat(response.dialogId))
    }
    
    const handleAddQuestion = async (question) => {
        if (!dialogId) {
            setNoDialogMessage("You must choose a dialog before you can do that")
            return false
        }
        try {
            const newQuestion = await postQuestion(dialogId, question)
            if (newQuestion.errors) {
                return setErrors(translateServerErrors(newQuestion.errors))
            } else {
                setErrors([])
                return setQuestions(questions.concat(newQuestion))
            }
        } catch (err) {
            return console.error("Error in fetch", err)
        }
    }

    useEffect(() => {
        getDialogs()
        getMessages(dialogId)
    }, [props.user, dialogId])

    return(
        <div className="student-main">
            <div className="callout messages">
                Showing questions for dialog: {dialogId}
                <ul>
                    {showQuestions}
                </ul>
            </div>
            <ErrorList errors={errors} />
            <QuestionForm addQuestion={handleAddQuestion} />
            {noDialogMessage}
            <p>Switch to another dialog:</p>
            <ul>
                {showDialogs}
            </ul>
            <button className="button" onClick={handleNewDialog}>Make a new dialog</button>
        </div>
    )
}

export default StudentMain