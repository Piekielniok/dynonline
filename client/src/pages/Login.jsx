import { useState } from 'react';

function Login() {
  const [selectedForm, setSelectedForm] = useState('login');
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
    email: "",
    repeatPassword: ""
  });

  return (
    <div className="login-container">
      <div className="login-switch-container">
        <button className={selectedForm === 'login' ? 'selected' : ''} onClick={e => setSelectedForm('login')}>Logowanie</button>
        <button className={selectedForm === 'register' ? 'selected' : ''} onClick={e => setSelectedForm('register')}>Rejestracja</button>
      </div>
      {selectedForm === 'login' ? (
        <div className="login-form-container">
          <h1>Logowanie</h1>
          <label htmlFor="loginInput">Login: </label>
          <input value={loginData.login} type="text" name="login" id="loginInput" onChange={e => setLoginData(prevState => { return {...prevState, login: e.target.value}})} />
          <label htmlFor="password">Hasło: </label>
          <input value={loginData.password} type="password" name="password" id="passwordInput" onChange={e => setLoginData(prevState => { return {...prevState, password: e.target.value}})} />
          <button className={loginData.login !== '' && loginData.password !== '' ? 'form-filled' : ''}>Zaloguj się</button>
        </div>
      ) : ''}
      {selectedForm === 'register' ? (
        <div className="register-form-container">
          <h1>Rejestracja</h1>
          <label htmlFor="loginInput">Login: </label>
          <input value={loginData.login} type="text" name="login" id="loginInput" onChange={e => setLoginData(prevState => { return {...prevState, login: e.target.value}})} />
          <label htmlFor="emailInput">Email: </label>
          <input value={loginData.email} type="email" name="email" id="emailInput" onChange={e => setLoginData(prevState => { return {...prevState, email: e.target.value}})} />
          <label htmlFor="passwordInput">Hasło: </label>
          <input value={loginData.password} type="password" name="password" id="passwordInput" onChange={e => setLoginData(prevState => { return {...prevState, password: e.target.value}})} />
          <label htmlFor="repeatPasswordInput">Powtórz hasło: </label>
          <input value={loginData.repeatPassword} type="password" name="repeat_password" id="repeatPasswordInput" onChange={e => setLoginData(prevState => { return {...prevState, repeatPassword: e.target.value}})} />
          <button className={loginData.login !== '' && loginData.password !== '' && loginData.repeatPassword !== '' ? 'form-filled' : ''}>Zarejestruj się</button>
        </div>
      ) : ''}
    </div>
  );
}

export default Login;