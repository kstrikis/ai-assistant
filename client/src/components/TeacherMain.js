import React, { useState, useEffect } from "react";
import { fetchUnreviewed, patchAnswer } from "../services/api.js";
import { TransitionGroup, CSSTransition } from "react-transition-group"

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
        const passButton = <button
            className="button success review-button"
            answerid={message.answerId}
            value="pass"
            onClick={handlePassRejectClick}
            >
                Accept
            </button>
        const rejectButton = <button
            className="button secondary review-button"
            answerid={message.answerId}
            value="reject"
            onClick={handlePassRejectClick}
            >
                Reject
            </button>
        return (
            <CSSTransition key={message.questionId} timeout={500} classNames="fade">
                <tr className="table-row">
                    <td>
                        {message.questionContent}
                    </td>
                    <td className="answer">
                        <div className="grid-y">
                            <div>
                                {message.answerContent}
                            </div>
                            <div>
                                {passButton}{rejectButton}
                            </div>
                        </div>
                    </td>
                </tr>
            </CSSTransition>
        )
    })

    return (
        <div className="teacher-main">
            <h4>Answers from AI ready for review:</h4>
            <table className="message-review-list">
                <thead>
                <tr className="table-header">
                    <th width="300">Question</th>
                    <th>Answer</th>
                </tr>
                </thead>
                    <TransitionGroup component="tbody">
                        {showMessages}
                    </TransitionGroup>
            </table>
        </div>
    )
}

export default TeacherMain