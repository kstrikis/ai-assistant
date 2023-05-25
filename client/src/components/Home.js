import React from "react";
import { Link } from "react-router-dom";

const Home = () => {

    return (
        <div className ="home">

            <div className =" callout large home-banner">
                <span>Welcome to chtAI!</span>
                <h2 className ="subheader">An AI Teaching Assistant</h2>
            </div>

            <div className ="grid-container">
                <div className ="grid-x align-center">
                    <div className ="cell small-4">
                        <h3>What is chtAI?</h3>
                        <h5>chtAI bridges students, teachers, and AI. It provides students the benefit of ChatGPT-style learning and makes teachers more effective in giving assistance and individualized feedback to an entire class.</h5>
                    </div>
                    <div className ="cell small-4 small-offset-1">
                        <h3>How does chtAI work?</h3>
                        <ol>
                            <h5><li>Students submit any question related to their coursework</li></h5>
                            <h5><li>The question is passed to the AI, and its answer is held for review</li></h5>
                            <h5><li>The teacher reviews the answer</li></h5>
                            <h5><li>The teacher approves, denies, or edits the answer, and it is immediately forwarded back to the student!</li></h5>
                        </ol>
                    </div>
                </div>
            </div>

            <div className ="grid-container student-signup">
                <div className ="grid-x align-middle align-center">
                    <div className ="cell small-4">
                        <h2>Sign up as a student</h2>
                                <p>Discover the future of learning with our AI Chatbot, your personal guide to academic success. Don't miss out – sign up today and unlock your potential!</p>
                        <Link to="/users/new/student" className ="button large">Sign up now!</Link>
                    </div>
                    <div className ="cell small-4">
                        <div className ="blog-post">
                            <img className ="thumbnail" src="/student.jpg" alt="Student" />
                        </div>
                    </div>
                </div>
            </div>

            <div className ="grid-container teacher-signup">
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
                        <Link to="/users/new/teacher" className ="button large">Register now!</Link>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Home