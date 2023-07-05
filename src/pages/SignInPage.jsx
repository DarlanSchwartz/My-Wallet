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
      console.log(message.data.message);
      return alert(message);
    }

    localStorage.setItem('token',message.data.token);
    navigate('/home',{state:`${message.data.name},${message.data.balance}`});
  }

  return (
    <SingInContainer>
      <form onSubmit={login}>
        <MyWalletLogo />
          <input required placeholder="E-mail" type="email" ref={email} autoComplete="true"/>
          <input required placeholder="Senha" type="password" autoComplete = 'true' ref={password}/>
          <button>Entrar</button>
      </form>

      <Link to={'/cadastro'}>
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
