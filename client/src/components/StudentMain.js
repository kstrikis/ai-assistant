import React, { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm.js";
import { fetchDialogs, fetchMessages, createNewDialog, deleteDialog, postQuestion } from "../services/api.js";
import translateServerErrors from "../services/translateServerErrors.js";
import ErrorList from "./layout/ErrorList.js";
import { Link, useHistory } from "react-router-dom";

const StudentMain = (props) => {
    const [dialogs, setDialogs] = useState([])
    const [messages, setMessages] = useState([])
    const [errors, setErrors] = useState([])
    const [shouldRefresh, setShouldRefresh] = useState(false)

    const dialogId = props.match.params.id
    const history = useHistory()
    const refreshTime = 1000

    const showMessages = messages.map(question => {
        if(question.answers.length===0 && !shouldRefresh) {
            setShouldRefresh(true)
        }
        const answers = question.answers.map(answer => {
            if (!answer.reviewed && !shouldRefresh) {
                setShouldRefresh(true)
            }
            return <div key={answer.id} className="answer">{answer.content}</div>
        })
        return(
            <tr className="table-row" key={question.id}>
                <td>{question.content}</td>
                <td colSpan="2">{answers}</td>
            </tr>
        )
    })

    const showDialogs = dialogs.map((dialogListId, arrayIndex) => {
        const inactive = <Link className="dialog-numbers" to={`/ask/${dialogListId}`} >{arrayIndex+1}</Link>
        const active = <Link className="dialog-active" to={`/ask/${dialogListId}`} >{arrayIndex+1}</Link>
        return (
            <button key={dialogListId}>
                {dialogId === dialogListId ? active : inactive}
            </button>
        )
    })

    const getMessages = async () => {
        if (dialogId) {
            const retrievedMessages = await fetchMessages(dialogId)
            if (!retrievedMessages) {
                return history.push("/ask/")
            }
            return setMessages(retrievedMessages.messages)
        } else {
            setMessages([])
        }
    }

    const getDialogs = async () => {
        if (props.user) {
            const retrievedDialogs = await fetchDialogs()
            if (retrievedDialogs.dialogs.length===0) {
                handleNewDialog()
            } else if (!dialogId) {
                return history.push(`/ask/${retrievedDialogs.dialogs.slice(-1)[0]}`)
            }
            return setDialogs(retrievedDialogs.dialogs)
        }
    }

    const handleNewDialog = async () => {
        await createNewDialog()
        return getDialogs()
    }
    
    const handleAddQuestion = async (question) => {
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

    const handleDeleteDialog = async () => {
        if (!dialogId) {
            return false
        }
        await deleteDialog(dialogId)
        const nextDialog = dialogs[dialogs.indexOf(dialogId)+1] || dialogs[dialogs.indexOf(dialogId)-1]
        if (nextDialog){
            return history.push(`/ask/${nextDialog}`)
        } else {
            handleNewDialog()
            return history.push("/ask/")
        }
    }

    useEffect(() => {
        getDialogs()
        getMessages(dialogId)
        setErrors([])
    }, [props.user, dialogId])

    useEffect(() => {
        if (shouldRefresh) { 
            setShouldRefresh(false)
            const timeoutId = setTimeout(() => {
                getMessages(dialogId)
            }, refreshTime)
            return () => {
                clearTimeout(timeoutId)
            }
        }
    },[shouldRefresh])

    const questionForm = <QuestionForm addQuestion={handleAddQuestion} />

    return(
        <div className="student-main">
            <h4>Select a dialog to begin the conversation:</h4>
            <ul className="dialog-number-group">
                {showDialogs}
                <button className="dialog-numbers" onClick={handleNewDialog}>Make a new dialog</button>
            </ul>
            <div className="messages">
                <table className="message-dialog">
                    <thead>
                        <tr className="table-header">
                            <th width="30%">Question</th>
                            <th width="65%">Answer</th>
                            <th className="button alert delete-button" onClick={handleDeleteDialog}>Delete this dialog</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showMessages}
                    </tbody>
                </table>
            </div>
                <ErrorList errors={errors} />
            <div>
                {questionForm}
            </div>
        </div>
    )
}

export default StudentMain