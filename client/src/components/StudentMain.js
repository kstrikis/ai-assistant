import React, { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm.js";
import { fetchDialogs, fetchMessages, createNewDialog, postQuestion } from "../services/api.js";
import translateServerErrors from "../services/translateServerErrors.js";
import ErrorList from "./layout/ErrorList.js";
import { Link } from "react-router-dom";

const StudentMain = (props) => {
    const dialogId = props.match.params.id
    const [dialogs, setDialogs] = useState([])
    const [messages, setMessages] = useState([])
    const [noDialogMessage, setNoDialogMessage] = useState("")
    const [errors, setErrors] = useState([])
    const [shouldRefresh, setShouldRefresh] = useState(false)
    const refreshTime = 5000

    let refreshCheck = false
    const showMessages = messages.map(question => {
        const answers = question.answers.map(answer => {
            if (!answer.reviewed) {
                refreshCheck = true
            }
            return (
                <div key={answer.id} className="answer">{answer.content}</div>
            )
        })
        return(
            <tr key={question.id} className="table-row">
                <td key={question.id}>
                    {question.content}
                </td>
                <td>
                    {answers}
                </td>
            </tr>
        )
    })
    if (refreshCheck) { 
        setTimeout(setShouldRefresh, refreshTime, !shouldRefresh)
    }

    const showDialogs = dialogs.map(dialogListId => {
        const inactive = <Link className="dialog-numbers" to={`/ask/${dialogListId}`} >{dialogListId}</Link>
        const active = <Link className="dialog-active" to={`/ask/${dialogListId}`} >{dialogListId}</Link>
        return (
            <button key={dialogListId}>
                {dialogId === dialogListId ? active : inactive}
            </button>
        )
    })

    const getMessages = async () => {
        if (dialogId) {
            const retrievedMessages = await fetchMessages(dialogId)
            return setMessages(retrievedMessages.messages)
        } else {
            setMessages([])
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
                return setMessages(messages.concat(newQuestion))
            }
        } catch (err) {
            return console.error("Error in fetch", err)
        }
    }

    useEffect(() => {
        getDialogs()
        getMessages(dialogId)
    }, [props.user, dialogId, shouldRefresh])

    const questionForm = <QuestionForm addQuestion={handleAddQuestion} />

    return(
        <div className="student-main">
            <h4>Select a dialog to begin the conversation:</h4>
            <ul>
                {showDialogs}
            <button className="dialog-numbers" onClick={handleNewDialog}>Make a new dialog</button>
            </ul>
            {noDialogMessage}
            <div className="messages">
                <table className="message-dialog">
                    <thead>
                        <tr className="table-header">
                            <th width="300">Question</th>
                            <th>Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showMessages}
                    </tbody>
                </table>
            </div>
                <ErrorList errors={errors} />
            <div>
                {dialogId && questionForm}
            </div>
        </div>
    )
}

export default StudentMain