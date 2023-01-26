
import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import "../App.css";

const api = axios.create({
    baseURL: "https://andersonssh.pythonanywhere.com/",
  });
  

function GenerateQuizPage() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [text, setText] = useState('')
  const [correctAlternatives, setCorrectAlternatives] = useState('')
  const [isSuccess, setIsSuccess] = useState(null)

  // User Login info
  const database = [
    {
      username: "user1",
      password: "pass1"
    },
    {
      username: "user2",
      password: "pass2"
    }
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmitLogin = (event) => {
    //Prevent page reload
    event.preventDefault();
    var { uname, pass } = document.forms[0];

    api.post(
        '/login',
        {username: uname.value, password: pass.value}
    ).then((response)=>{
        setIsSubmitted(true)
        sessionStorage.setItem('token', response.data.token)
    })
    .catch(()=> setErrorMessages({name: 'pass', message: 'usuario ou senha invalidos'}))
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmitLogin}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );
  const handleSubmitGenerateQuiz = (event) => {
    event.preventDefault();
    let correctAlts = getCorrectAlternativesInDict(correctAlternatives)
    api.post(
        '/generate_quiz',
         {text: text, correct_alternatives: correctAlts},
         {headers: {'Authorization': 'Bearer ' + sessionStorage.token}}
    ).then((response)=> {
        setIsSuccess(true)
        navigator.clipboard.writeText(response.data.result)})
    .catch(()=> setIsSuccess(false))
  }
  function getCorrectAlternativesInDict(){
    let correct_alt = correctAlternatives.replaceAll(' ', '').toLowerCase().split('/')
    console.log(correct_alt)
    let result = {}
    for(let c_alt of correct_alt){
      if(c_alt.length < 2) {
        continue
      }
      let question_number = c_alt.slice(0, -1)
      let correct_letter = c_alt.slice(-1)
      result[question_number] = correct_letter
    }
    return result
  }
  return (
    <div className="app">
        {!isSubmitted ? <div className="login-form"><div className="title">Login</div>{renderForm}</div>: 
        
        
        
        <div>

            <textarea onChange={(e) => setText(e.target.value)} form="formm" cols="100" rows="30"></textarea>
            <form onSubmit={handleSubmitGenerateQuiz} id="formm">
                <input type="text" onChange={(e) => setCorrectAlternatives(e.target.value)} size="40"/>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="submit"/>
            </form>
            <br />
            <br />

            {isSuccess ? 'SUCESSO!!!!!!. os dados foram copiados para a área de transferência!': isSuccess === false ? 'FALHOUU :(': ''}
        </div>

        }
      
    </div>
  );
}

export default GenerateQuizPage