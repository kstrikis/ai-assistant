import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../authentication/SignOutButton";

const TopBar = ({ user }) => {
  const unauthenticatedListItems = [
    <li key="sign-in">
      <Link to="/user-sessions/new">Sign In</Link>
    </li>,
    <li key="sign-up">
      <Link to="/users/new" className="button">
        Sign Up
      </Link>
    </li>,
  ];

  const authenticatedListItems = [
    <li key="ask">
      <Link to="/ask">Ask</Link>
    </li>,
    <li key="sign-out">
      <SignOutButton />
    </li>,
  ];

  const teacherListItems = [
    <li key="answer">
      <Link to="/answer">Answer</Link>
    </li>,
  ]

  let isTeacher = false
  if (user) {
    isTeacher = user.role === "teacher"
  }

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <ul className="menu top-bar-menu">
          <li>
            <img src="/chtAI-logo.gif" alt="chtAI logo" className="navlogo"></img>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
      <div className="top-bar-right">
        <ul className="menu">{isTeacher && teacherListItems}{user ? authenticatedListItems : unauthenticatedListItems}</ul>
      </div>
    </div>
  );
};

export default TopBar;
