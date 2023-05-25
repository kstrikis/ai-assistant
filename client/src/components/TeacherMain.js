import React, { useState, useEffect } from "react";
import { fetchUnreviewed, patchAnswer } from "../services/api.js";
import { TransitionGroup, CSSTransition } from "react-transition-group"
import AnswerTile from "./AnswerTile.js";

const TeacherMain = (props) => {
    const [messages, setMessages] = useState([])
    const [shouldRefresh, setShouldRefresh] = useState(false)
    const refreshTime = 1000

    const getUnreviewed = async () => {
        const retrievedMessages = await fetchUnreviewed()
        setMessages(retrievedMessages.messages)
    }

    useEffect(() => {
        getUnreviewed()
        const timeoutId = setTimeout(setShouldRefresh, refreshTime, !shouldRefresh)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [shouldRefresh])

    const handlePassRejectClick = (answerId, passStatus, answerContent) => {
        patchAnswer(answerId, passStatus, answerContent).catch((err) => {
            console.error("error in patch",err)
        })
        const newMessages = messages.filter(message => message.answerId !== answerId)
        return setMessages(newMessages)
    }

    const showMessages = messages.map(message => {
        return (
            <CSSTransition key={message.questionId} timeout={500} classNames="fade">
                <tr className="table-row">
                    <td>
                        {message.questionContent}
                    </td>
                    <td className="answer">
                        <AnswerTile 
                            message={message}
                            handlePassRejectClick={handlePassRejectClick}
                        />
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
                    <th width="25%">Question</th>
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