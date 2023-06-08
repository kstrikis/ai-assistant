import React, { useState, useEffect } from "react";
import ErrorList from "../layout/ErrorList"
import FormError from "../layout/FormError";
import config from "../../config";
import translateServerErrors from "../../services/translateServerErrors";
import { fetchClassrooms } from "../../services/api";

const RegistrationForm = (props) => {
  const paramsRole = props.match.params.role
  const defaultRole = paramsRole ? paramsRole : ""
  const [userPayload, setUserPayload] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    role: defaultRole,
    classroomId: null,
    classroomName: ""
  })
  const [errors, setErrors] = useState({})
  const [serverErrors, setServerErrors] = useState({})
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [classrooms, setClassrooms] = useState([])

  const getClassrooms = async () => {
    const retrievedClassrooms = await fetchClassrooms()
    setClassrooms(retrievedClassrooms.classrooms)
  }

  useEffect(() => {
    getClassrooms()
  }, [])

  const validateInput = (payload) => {
    setErrors({});
    const { email, password, passwordConfirmation, classroomId, classroomName, role } = payload;
    const emailRegexp = config.validation.email.regexp.emailRegex;
    let newErrors = {};
    
    if (!email.match(emailRegexp)) {
      newErrors = {
        ...newErrors,
        email: "is invalid",
      }
    }
    
    if (password.trim() == "") {
      newErrors = {
        ...newErrors,
        password: "is required",
      }
    }
    
    if (passwordConfirmation.trim() === "") {
      newErrors = {
        ...newErrors,
        passwordConfirmation: "is required",
      }
    } else {
      if (passwordConfirmation !== password) {
        newErrors = {
          ...newErrors,
          passwordConfirmation: "does not match password",
        };
      }
    }
    
    if (!classroomId && role === "student") {
      newErrors = {
        ...newErrors,
        classroomId: "must choose a classroom",
      };
    }

    if (classroomName.trim() === "" && role === "teacher") {
      newErrors = {
        ...newErrors,
        classroomName: "new class name is required",
      };
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      return true
    }
    return false
  };
  
  const onSubmit = async (event) => {
    event.preventDefault();
    if (validateInput(userPayload)) {
      try {
        if (Object.keys(errors).length === 0) {
          const response = await fetch("/api/v1/users", {
            method: "post",
            body: JSON.stringify(userPayload),
            headers: new Headers({
              "Content-Type": "application/json",
            }),
          });
          if (!response.ok) {
            if (response.status === 422) {
              const errorBody = await response.json()
              const newServerErrors = translateServerErrors(errorBody.errors)
              setServerErrors(newServerErrors)
            }
            const errorMessage = `${response.status} (${response.statusText})`;
            const error = new Error(errorMessage);
            throw error;
          }
          setShouldRedirect(true);
        }
      } catch (err) {
        console.error(`Error in fetch: ${err.message}`);
      }
    }
  };
  
  const onInputChange = (event) => {
    if (event.currentTarget.name === "role" && event.currentTarget.value === "teacher") {
      setUserPayload({
        ...userPayload,
        [event.currentTarget.name]: event.currentTarget.value,
        "classroomId": null
      })
    } else (
      setUserPayload({
        ...userPayload,
        [event.currentTarget.name]: event.currentTarget.value,
        })
    )
  };
  
  if (shouldRedirect) {
    location.href = "/";
  }
  
  let registrationWelcome = ""
  if (paramsRole === "student") {
    registrationWelcome = "Students: "
  }
  if (paramsRole === "teacher") {
    registrationWelcome = "Teachers: "
  }
  const hasRoleHide = (paramsRole === "student" || paramsRole === "teacher") ? "hide" : ""
  const isStudentHide = (userPayload.role === "student" || !userPayload.role) ? "hide" : ""
  const isTeacherHide = (userPayload.role === "teacher" || !userPayload.role) ? "hide" : ""

  const classroomDropdown = (
    <div className={`${isTeacherHide}`}>
      Select a classroom to join:
      <select name="classroomId" onChange={onInputChange}>
        <option key="none" value={null} name="classroomId">
        </option>
        {classrooms.map(classroom => {
          return(
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
            )
          })}
      </select>
    </div>
  )
  
  return (
    <div className="grid-container">
      <h1>{registrationWelcome}Get started now!</h1>
      <ErrorList errors={serverErrors} />
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Email
            <input type="text" name="email" autoComplete="username" value={userPayload.email} onChange={onInputChange} />
            <FormError error={errors.email} />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={userPayload.password}
              onChange={onInputChange}
            />
            <FormError error={errors.password} />
          </label>
        </div>
        <div>
          <label>
            Password Confirmation
            <input
              type="password"
              name="passwordConfirmation"
              autoComplete="new-password"
              value={userPayload.passwordConfirmation}
              onChange={onInputChange}
            />
            <FormError error={errors.passwordConfirmation} />
          </label>
        </div>
        <div>
          <fieldset className={`${hasRoleHide}`}>
            <legend>Role</legend>
            <input
              type="radio"
              name="role"
              value="student"
              id="roleStudent"
              onChange={onInputChange}
              />
            <label htmlFor="roleStudent">Student</label>
            <input
              type="radio"
              name="role"
              value="teacher"
              id="roleTeacher"
              onChange={onInputChange}
              />
            <label htmlFor="roleTeacher">Teacher</label>
            <FormError error={errors.role} />
          </fieldset>
        </div>
        <div className={`${isStudentHide}`}>
          <label>
            New Classroom Name
            <input
              type="text"
              name="classroomName"
              value={userPayload.classroomName}
              onChange={onInputChange}
            />
            <FormError error={errors.classroomName} />
          </label>
        </div>
        {classroomDropdown}
        <FormError error={errors.classroomId} />
        <div>
          <input type="submit" className="button" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;