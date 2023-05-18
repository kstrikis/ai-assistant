import React, { useState, useEffect } from "react";
import { fetchUnreviewed } from "../services/api";

const TeacherMain = (props) => {
    const [messages, setMessages] = useState([])

    const getUnreviewed = async () => {
        const retrievedMessages = await fetchUnreviewed()
        setMessages(retrievedMessages.messages)
    }

    useEffect(() => {
        getUnreviewed()
    }, [])

    const showMessages = messages.map(message => {
        return (
            <>
                <div className="cell small-6 callout">{message.questionContent}</div>
                <div className="cell small-6 callout">{message.answerContent}</div>
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