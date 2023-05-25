import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize'

const AnswerTile = (props) => {
    const { message, handlePassRejectClick } = props
    const [answerText, setAnswerText] = useState(message.answerContent)
    const [errorDisplay, setErrorDisplay] = useState("hide")    

    const handleTextEdit = (event) => {
        setAnswerText(event.currentTarget.value)
        setErrorDisplay("hide")
    }
    const submitAccept = (event) => {
        event.preventDefault()
        if (answerText === "") {
            setErrorDisplay("")
        } else{
            handlePassRejectClick(message.answerId, "pass", answerText)
        }
    }
    const submitReject = (event) => {
        event.preventDefault()
        handlePassRejectClick(message.answerId, "reject", answerText)
    }
    return (
        <div className="grid-y">
            <div>
                <TextareaAutosize
                    onChange={handleTextEdit}
                    value={answerText}
                    />
            </div>
            <span className={`${errorDisplay}`}>Answer must not be blank</span>
            <div className="grid-x">
                <span className="cell small-1">
                    <button
                        className="button success review-button"
                        name="pass"
                        onClick={submitAccept}
                        >
                            Accept
                    </button>
                </span>
                <span className="cell small-1 small-offset-10 review-button-right">
                    <button
                        className="button secondary review-button"
                        name="reject"
                        onClick={submitReject}
                        >
                            Reject
                    </button>
                </span>
            </div>
        </div>
    )
}

export default AnswerTile