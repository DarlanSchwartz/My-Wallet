import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { EditTransaction } from "../requests";
import dayjs from "dayjs";

export default function EditTransactionPage() {

  const {tipo,id} = useParams(); // in || out
  const navigate = useNavigate();
  const [value,setValue]  = useState('');
  const description  = useRef();
  const location = useLocation();

  useEffect(()=>{
    if(localStorage.getItem('token') == undefined) return navigate('/');

    setValue(location.state.split(',')[0]);
    description.current.value = location.state.split(',')[1];
  },[])

  function editTransactionEvent(e)
  {
    e.preventDefault();
    EditTransaction(localStorage.getItem('token'),transactionSucess,id,{value,description:description.current.value});
  }

  function transactionSucess(message,error)
  {
    if(error) return alert(message.response.data);

    console.log('Sucesso ao editar transação');
    navigate('/home');
  }

  return (
    <TransactionsContainer>
      <h1>Editar {tipo == 'entrada'? 'entrada' : 'saída'}</h1>
      <form onSubmit={editTransactionEvent}>
        <input data-test="registry-amount-input" value={value} onChange={(e)=> {setValue(e.target.value.replace(/[^0-9.-]/g, ''))}} required placeholder="Valor" type="text"/>
        <input data-test="registry-name-input" ref={description} required placeholder="Descrição" type="text" />
        <button data-test="registry-save" >Atualizar {tipo == 'entrada'? 'entrada' : 'saída'}</button>
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
`
