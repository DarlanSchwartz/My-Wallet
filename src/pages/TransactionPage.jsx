import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { NewTransaction } from "../requests";
import dayjs from "dayjs";

export default function TransactionsPage() {

  const {tipo} = useParams(); // in || out

  const value  = useRef();
  const description  = useRef();

  function newTransactionEvent(e)
  {
    e.preventDefault();
    NewTransaction(localStorage.getItem('token'),transactionSucess,tipo,{value:value.current.value,description:description.current.value,date:dayjs().format('DD/MM')});
  }

  function transactionSucess(message,error)
  {
    if(error) return alert(message.response.data.message);

    console.log('Sucesso ao enviar transação' + message.data.status)
  }

  return (
    <TransactionsContainer>
      <h1>Nova TRANSAÇÃO</h1>
      <form onSubmit={newTransactionEvent}>
        <input ref={value} required placeholder="Valor" type="number" pattern="^[0-9.]+$"/>
        <input ref={description} required placeholder="Descrição" type="text" />
        <button>Salvar TRANSAÇÃO</button>
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
