import React from "react"

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