import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useEffect, useState } from "react"
import { GetTransactions } from "../requests";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {

  const [transactions,setTransactions] = useState([]);
  const [user,setUser] = useState('Usuário');
  const [balance,setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(()=>{
    GetTransactions(localStorage.getItem('token'),updateTransactions);
  },[]);


  function updateTransactions(userTransactions,error)
  {
    console.log(userTransactions);
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

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {user}</h1>
        <BiExit onClick={logout} className="logout-btn"/>
      </Header>

      <TransactionsContainer>
        <ul>
        {transactions && transactions.length > 0 && transactions.map(transaction => {
            return (
              <ListItemContainer key={uuidv4()}>
                <div>
                  <span>{transaction.date}</span>
                  <strong>{transaction.description}</strong>
                </div>
                <Value color={transaction.type == 'out' ? "negativo" : "positivo"}>{Number(transaction.value).toFixed(2).toString().replace('.',',')}</Value>
              </ListItemContainer>
            );
          })}
         
        </ul>
        {transactions && transactions.length == 0 && <p className="none-registries">Não há registros de entrada ou saída</p>}
        <article>
          <strong>Saldo</strong>
          <Value color={balance < 0 ? "negativo": "positivo"}>{balance.toFixed(2).toString().replace('.',',')}</Value>
        </article>
      </TransactionsContainer>


      <ButtonsContainer>
        <button onClick={()=> navigate('/nova-transacao/in')}>
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </button>
        <button onClick={()=> navigate('/nova-transacao/out')}>
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
`