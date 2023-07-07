import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import {BsFillTrash3Fill} from "react-icons/bs";
import { useEffect, useState } from "react"
import { DeleteTransaction, GetTransactions } from "../requests";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {

  const [transactions,setTransactions] = useState([]);
  const [user,setUser] = useState('Usuário');
  const [balance,setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('token') == undefined){
      navigate('/');
      return;
    }
    GetTransactions(localStorage.getItem('token'),updateTransactions);
  },[]);


  function updateTransactions(userTransactions,error)
  {
    if(error) return console.log(userTransactions);
    
    
    setTransactions(userTransactions.transactions.reverse());
    setUser(userTransactions.username);
    setBalance(userTransactions.balance);
  }

  function logout()
  {
    localStorage.removeItem('token');
    navigate('/');
  }

  function deleteTransaction(id)
  {
    if(window.confirm('Excluir registro de transação?')){
      DeleteTransaction(localStorage.getItem('token'), finishDelete,id);
    }
  }

  function finishDelete(message,error){
    if(error) return alert(message.data.response.message);
    setTransactions(message.transactions.reverse());
    setBalance(message.balance);
  }

  function editTransaction(id,tipo,value,description)
  {
    navigate(`/editar-registro/${tipo}/${id}`,{state:`${value},${description}`})
  }

  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Olá, {user}</h1>
        <BiExit  data-test="logout" onClick={logout} className="logout-btn"/>
      </Header>

      <TransactionsContainer len={transactions.length}>
        <ul>
        {transactions && transactions.length > 0 && transactions.map(transaction => {
            return (
              <ListItemContainer key={uuidv4()}>
                <div>
                  <span>{transaction.date}</span>
                  <strong onClick={()=> editTransaction(transaction.id,transaction.type,transaction.value,transaction.description)} data-test="registry-name">{transaction.description}</strong>
                </div>
                <div className="value-delete-container">
                  <Value data-test="registry-amount" color={transaction.type == 'saida' ? "negativo" : "positivo"}>{Number(transaction.value).toFixed(2).toString().replace('.',',')}</Value>
                  <BsFillTrash3Fill data-test="registry-delete" className="delete-btn" onClick={()=>deleteTransaction(transaction.id)}/>
                </div>
              </ListItemContainer>
            );
          })}
         
        </ul>
        {transactions && transactions.length == 0 && <p className="none-registries">Não há registros de entrada ou saída</p>}
        <article>
          <strong>Saldo</strong>
          <Value data-test="total-amount" color={balance < 0 ? "negativo": "positivo"}>{balance.toFixed(2).toString().replace('.',',')}</Value>
        </article>
      </TransactionsContainer>


      <ButtonsContainer>
        <button data-test="new-income" onClick={()=> navigate('/nova-transacao/entrada')}>
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </button>
        <button data-test="new-expense" onClick={()=> navigate('/nova-transacao/saida')}>
          <AiOutlineMinusCircle />
          <p>Nova <br />saída</p>
        </button>
      </ButtonsContainer>

    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
  .logout-btn{
    cursor: pointer;
  }
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
 
  ul{
    overflow-y: scroll;
    max-height: 650px;
    min-height: 650px;
  }

  ul::-webkit-scrollbar {
  display: ${(props) => props.len <= 27 ? 'none' : 'auto'}; /* Oculta a barra de rolagem */
}
  article {
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }

  .none-registries{
    align-self: center;
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }

  div strong{
    cursor: pointer;
    &:hover{
      color: #8c11be;
    }
  }

  .value-delete-container{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .delete-btn{
      cursor: pointer;
      transition: all 200ms;
      &:hover{
        color: #8c11be;
      }
    }
  }
`