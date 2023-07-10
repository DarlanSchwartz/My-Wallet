import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import { useRef, useState } from "react";
import { Login } from "../requests";
import { ThreeDots } from 'react-loader-spinner';


export default function SignInPage() {

  const email  = useRef();
  const password  = useRef();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  function login(e)
  {
    e.preventDefault();

    const userObj = {
      email:email.current.value.toString(),
      password:password.current.value.toString()
    }
    setLoading(true);
    Login(userObj,loginSucess);
  }

  function loginSucess(message,error)
  {
    setLoading(false);
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
          <button disabled={loading} className="sign-in-btn" data-test="sign-in-submit">{loading && <ThreeDots color="rgba(255, 255, 255, 1)" height={13} width={51} />}{!loading && 'Entrar'}</button>
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
  form {
    .sign-in-btn{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
   
  }
`
