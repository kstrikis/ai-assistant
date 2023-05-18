import React, { useState, useEffect } from "react";
import { fetchUnreviewed, patchAnswer } from "../services/api.js";

const TeacherMain = (props) => {
    const [messages, setMessages] = useState([])

    const getUnreviewed = async () => {
        const retrievedMessages = await fetchUnreviewed()
        setMessages(retrievedMessages.messages)
    }

    useEffect(() => {
        getUnreviewed()
    }, [])

    const handlePassRejectClick = (event) => {
        event.preventDefault()
        const answerId = event.currentTarget.getAttribute("answerid")
        const actionWord = event.currentTarget.getAttribute("value")
        patchAnswer(answerId, actionWord).catch((err) => {
            console.error("error in patch",err)
        })
        const newMessages = messages.filter(message => message.answerId !== answerId)
        return setMessages(newMessages)
    }

    const showMessages = messages.map(message => {
        const passButton = <button className="button" answerid={message.answerId} value="pass" onClick={handlePassRejectClick}>Pass</button>
        const rejectButton = <button className="button" answerid={message.answerId} value="reject" onClick={handlePassRejectClick}>Reject</button>
        return (
            <>
                <div className="cell small-4 callout">{message.questionContent}</div>
                <div className="cell small-6 callout">{message.answerContent}</div>
                <div className="cell small-2 callout">
                    {passButton}
                    {rejectButton}
                </div>
            </>
        )
    })

    return (
        <div className="teacher-main">
            <div className="grid-x">
                <div className="cell small-6 callout">Question</div>
                <div className="cell small-6 callout">Answer</div>
                {showMessages}
            </div>
        </div>
    )
}

export default TeacherMain