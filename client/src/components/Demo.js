import React from "react"
import { TransitionGroup, CSSTransition } from "react-transition-group"

const Demo = (props) => {

    const questionForm = (
        <div className="question-form">
            <form onSubmit={true}>
                <label htmlFor="question">
                    Question content:
                    <textarea
                        rows="6"
                        name="question"
                        value=""
                        onChange={true}
                    />
                </label>
                <button className="button" type="submit" value="Submit">Submit</button>
            </form>
        </div>
    )

    const showMessages = (
        <tr className="table-row" key={"1"}>
            <td>What is the derivative of x^2?</td>
            <td colSpan="2">The answer to this question is pending review.</td>
        </tr>
    )

    const showDialogs = ([
        <button key="1" className="dialog-active">1</button>,
        <button key="2" className="dialog-numbers">2</button>
    ])

    const studentMain = (
        <div className="student-main">
            <h4>Select a dialog to begin the conversation:</h4>
            <ul className="dialog-number-group">
                {showDialogs}
                <button className="dialog-numbers" onClick={true}>Make a new dialog</button>
            </ul>
            <div className="messages">
                <table className="message-dialog">
                    <thead>
                        <tr className="table-header">
                            <th width="30%">Question</th>
                            <th width="65%">Answer</th>
                            <th className="button alert delete-button">Delete this dialog</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showMessages}
                    </tbody>
                </table>
                {questionForm}
            </div>
        </div>
    )

    const teacherMessage = (
        <CSSTransition key="1" timeout={500} classNames="fade">
            <tr className="table-row">
                <td>
                    test1
                </td>
                <td className="answer">
                    test2
                </td>
            </tr>
        </CSSTransition>
    )


    const teacherMain = (
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
                        {teacherMessage}
                    </TransitionGroup>
            </table>
        </div>
    )
    return (
        <div>
            {teacherMain}

        </div>
    )

    return (
        <div className="student-main">
            <h4>Select a dialog to begin the conversation:</h4>
            <ul className="dialog-number-group">
                {showDialogs}
                <button className="dialog-numbers" onClick={true}>Make a new dialog</button>
            </ul>
            <div className="messages">
                <table className="message-dialog">
                    <thead>
                        <tr className="table-header">
                            <th width="30%">Question</th>
                            <th width="65%">Answer</th>
                            <th className="button alert delete-button">Delete this dialog</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showMessages}
                    </tbody>
                </table>
                {questionForm}
            </div>
        </div>
    )
}

export default Demo