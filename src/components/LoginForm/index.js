import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showSubmitError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      showSubmitError: true,
      errorMsg,
    })
  }

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {username, password, showSubmitError, errorMsg} = this.state

    return (
      <div className="login-bg-container">
        <form className="login-form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />

          <label htmlFor="username" className="input-label">
            USERNAME
          </label>

          <input
            id="username"
            type="text"
            value={username}
            className="input-field"
            onChange={this.onChangeUsername}
            placeholder="Username"
          />

          <label htmlFor="password" className="input-label">
            PASSWORD
          </label>

          <input
            id="password"
            type="password"
            value={password}
            className="input-field"
            onChange={this.onChangePassword}
            placeholder="Password"
          />

          <button type="submit" className="login-button">
            Login
          </button>

          {showSubmitError && (
            <p className="error-message">*{errorMsg}</p>
          )}
        </form>
      </div>
    )
  }
}

export default LoginForm