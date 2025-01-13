import { useState } from 'react';

function Login() {
  const [loginData, setLoginData] = useState({
    login: "",
    password: ""
  });

  return (
    <div>
      <h1>Logowanie</h1>
      <label htmlFor="loginInput">Login: </label>
      <input value={loginData.login} type="text" name="login" id="loginInput" onChange={e => setLoginData({ ...loginData, login: e.target.value})}/>
      <label htmlFor="password">Hasło: </label>
      <input value={loginData.password} type="password" name="password" id="passwordInput" onChange={e => setLoginData({ ...loginData, password: e.target.value})}/>
    </div>
  );
}

export default Login;