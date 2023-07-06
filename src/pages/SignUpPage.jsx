import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import { Singup } from "../requests";
import { useRef } from "react";

export default function SignUpPage() {
  const email  = useRef();
  const password  = useRef();
  const password2  = useRef();
  const name  = useRef();
  
  function singup(e)
  {
    e.preventDefault();

    if(password.current.value !== password2.current.value)
    {
      alert('Os campos de senhas precisam ser iguais!');
      return;
    }

    const userObj = {
      name:name.current.value,
      email:email.current.value,
      password:password.current.value,
    }

    Singup(userObj,singupSucess);
  }

  function singupSucess(message,error)
  {
    if(error) return alert(message.response.data.message);
  }

  return (
    <SingUpContainer>
      <form onSubmit={singup}>
        <MyWalletLogo />
        <input ref={name} required placeholder="Nome" type="text" name="name" id="name"/>
        <input ref={email} required placeholder="E-mail" type="email" name="email" id="email"/>
        <input ref={password} required placeholder="Senha" type="password" autoComplete='true' name="password" id="password"/>
        <input ref={password2} required placeholder="Confirme a senha" type="password" autoComplete='true' name="password2" id="password2" />
        <button>Cadastrar</button>
      </form>

      <Link to={'/'}>
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
