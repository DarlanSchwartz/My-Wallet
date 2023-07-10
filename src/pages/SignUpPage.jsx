import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import { Singup } from "../requests";
import { useRef, useState } from "react";
import { ThreeDots } from 'react-loader-spinner';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpPage() {
  const email  = useRef();
  const password  = useRef();
  const password2  = useRef();
  const name  = useRef();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  
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
    setLoading(true);
    Singup(userObj,singupSucess);
  }

  function singupSucess(message,error)
  {
    setLoading(false);
    if(error) return alert(message.response.data.message);

    toast.info( 'Cadastrado com sucesso!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "colored",
      });

      navigate('/');
  }

  return (
    <SingUpContainer>
      <form onSubmit={singup}>
        <MyWalletLogo />
        <input data-test="name" ref={name} required placeholder="Nome" type="text" name="name" id="name"/>
        <input data-test="email" ref={email} required placeholder="E-mail" type="email" name="email" id="email"/>
        <input data-test="password" ref={password} required placeholder="Senha" type="password" autoComplete='true' name="password" id="password" minLength={3}/>
        <input data-test="conf-password" ref={password2} required placeholder="Confirme a senha" type="password" autoComplete='true' name="password2" id="password2" minLength={3}/>
        <button disabled={loading} className="sign-up-btn" data-test="sign-up-submit">{loading && <ThreeDots color="rgba(255, 255, 255, 1)" height={13} width={51} />}{!loading && 'Cadastrar'}</button>
      </form>

      <Link to={'/'}>
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  form {
    .sign-up-btn{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  }
`
