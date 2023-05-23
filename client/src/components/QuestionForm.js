import React, { useState, useEffect } from "react";

const QuestionForm = (props) => {
    const defaultFormData = {
        question: ""
    }
    const [formData, setFormData] = useState(defaultFormData)
    
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.currentTarget.name]: event.currentTarget.value
        })
    }
    
    const handleSubmit = (event) => {
        event.preventDefault()
        props.addQuestion(formData.question)
        setFormData(defaultFormData)
    }
    
    return (
        <div className="question-form">
            <form onSubmit={handleSubmit}>
                <label htmlFor="question">
                    Question content:
                    <textarea
                        rows="6"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                    />
                </label>
                <button className="button" type="submit" value="Submit">Submit</button>
            </form>
        </div>
    )
}

export default QuestionForm