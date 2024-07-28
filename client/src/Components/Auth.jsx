import React, { useState } from 'react'
import { useCookies } from 'react-cookie'

const Auth = () => {

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  console.log(cookies)
  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    const response = await fetch(`${import.meta.env.VITE_SERVERURL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({email, password})
    })
    const data = await response.json()

    if (data.detail) {
      setError(data.detail)
    } else {
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)

      window.location.reload()
    }
    
  }
  return (
    <div className='auth-container'>
      <div className="auth-container-box">
        <form action="">
          <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
          <input type="email" placeholder = "email" onChange = {(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder='password'
          onChange = {(e) => setPassword(e.target.value)}
          />
          {!isLogin && <input type="password" placeholder='confirm passowrd'
          onChange = {(e) => setConfirmPassword(e.target.value)}
          />}
          <input type="submit" className = 'create' onClick={(e) => handleSubmit(e, isLogin ? "login" : "signup")}/>
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options"><button 
        onClick = {() => viewLogin(false)}
        style = {{backgroundColor : !isLogin ? 'white' : 'rgb(188, 188, 188)'}}
        >
          Sign Up

        </button>
        <button 
        onClick = {() => viewLogin(true)}
        style = {{backgroundColor : isLogin ? 'white' : 'rgb(188, 188, 188)'}}
        >Login</button>
        </div>
      </div>
    </div>
  )
}

export default Auth