import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import { useRef } from "react";
import { Login } from "../requests";


export default function SignInPage() {

  const email  = useRef();
  const password  = useRef();
  const navigate = useNavigate();
  
  function login(e)
  {
    e.preventDefault();

    const userObj = {
      email:email.current.value.toString(),
      password:password.current.value.toString()
    }

    Login(userObj,loginSucess);
  }

  function loginSucess(message,error)
  {
    if(error)
    {
      console.log(message);
      return alert(message.response.data.message);
    }

    localStorage.setItem('token',message.data.token);
    navigate('/home',{state:`${message.data.name},${message.data.balance}`});
  }

  return (
    <SingInContainer>
      <form onSubmit={login}>
        <MyWalletLogo />
          <input data-test="email" required placeholder="E-mail" type="email" ref={email} autoComplete="true" name="email" id="email"/>
          <input data-test="password" required placeholder="Senha" type="password" autoComplete = 'true' ref={password} name="password" id="password"/>
          <button data-test="sign-in-submit">Entrar</button>
      </form>

      <Link to={'/cadastro'}>
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
