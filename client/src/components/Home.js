import React from "react";

const Home = props => {

    return (
        <div className ="home">

            <div className =" callout large home-banner">
                <span>chtAI</span>
                <h2 className ="subheader">An AI Teaching Assistant</h2>
            </div>

            <article className ="grid-container student-signup">
                <div className ="grid-x align-middle align-center">
                    <div className ="cell small-4">
                        <h2>Sign up as a student</h2>
                                <p>Discover the future of learning with our AI Chatbot, your personal guide to academic success. Don't miss out – sign up today and unlock your potential!</p>
                        <button className ="button large">Sign up now!</button>
                    </div>
                    <div className ="cell small-4">
                        <div className ="blog-post">
                            <img className ="thumbnail" src="/student.jpg" alt="Student" />
                        </div>
                    </div>
                </div>
            </article>

            <article className ="grid-container teacher-signup">
                <div className ="grid-x align-middle align-center">
                    <div className ="cell small-4">
                        <div className ="blog-post">
                            <img className ="thumbnail" src="/teacher.jpg" alt="Teacher" />
                        </div>
                    </div>
                    <div className ="cell small-4">
                        <h2>Register as a teacher</h2>
                            <div className ="callout>">
                                <p>Supercharge your teaching with our AI Chatbot, tailored to answer student queries round the clock. Register now to multiply your reach, save precious time, and focus more on fostering growth. Embrace this innovation in teaching – make your work simpler and more efficient!</p>
                            </div>
                        <button className ="button large">Register now!</button>
                    </div>
                </div>
            </article>
            
        </div>
    )
}

export default Home