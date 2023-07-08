import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { NewTransaction } from "../requests";
import dayjs from "dayjs";
import { ThreeDots } from 'react-loader-spinner';
import { toast } from "react-toastify";

export default function TransactionsPage() {

  const {tipo} = useParams(); // in || out
  const navigate = useNavigate();
  const [value,setValue]  = useState('');
  const [loading,setLoading] = useState(false);
  const description  = useRef();

  useEffect(()=>{
    if(localStorage.getItem('token') == undefined) navigate('/');
    return;
  },[])

  function newTransactionEvent(e)
  {
    e.preventDefault();
    setLoading(true);
    NewTransaction(localStorage.getItem('token'),transactionSucess,tipo,{value,description:description.current.value,date:dayjs().format('DD/MM')});
  }

  function transactionSucess(message,error)
  {
    if(error) return alert(message.response.data.message);

    toast.success( 'Sucesso ao enviar transação!', {
      position: "bottom-left",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "colored",
      });
    navigate('/home');
  }

  return (
    <TransactionsContainer>
      <h1>Nova {tipo == 'entrada'? 'entrada' : 'saída'}</h1>
      <form onSubmit={newTransactionEvent}>
        <input data-test="registry-amount-input" value={value} onChange={(e)=> {setValue(e.target.value.replace(/[^0-9.-]/g, ''))}} required placeholder="Valor" type="text"/>
        <input data-test="registry-name-input" ref={description} required placeholder="Descrição" type="text" />
        <button className="save-btn" data-test="registry-save" >{loading && <ThreeDots color="rgba(255, 255, 255, 1)" height={13} width={51} />}{!loading && 'Salvar '}{!loading && (tipo == 'entrada'? 'entrada' : 'saída')}</button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }

  form {
    .save-btn{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`
