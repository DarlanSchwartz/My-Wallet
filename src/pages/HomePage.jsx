import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useEffect, useState } from "react"
import { GetTransactions } from "../requests";
import { useLocation, useNavigate } from "react-router-dom";

export default function HomePage() {

  const [transactions,setTransactions] = useState([]);
  const [user,setUser] = useState('UNDEFINED');
  const [balance,setBalance] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  /*

  */

  useEffect(()=>{
    GetTransactions(localStorage.getItem('token'),updateTransactions);
    setUser(location.state.split(',')[0]);
    setBalance(Number(location.state.split(',')[1]));
  },[]);


  function updateTransactions(transact,error)
  {
    if(error) return console.log(transact);
    
    setTransactions(transact);
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
              <ListItemContainer>
                <div>
                  <span>{transaction.date}</span>
                  <strong>{transaction.name}</strong>
                </div>
                <Value color={Number(transaction.value) < 0 ? "negativo" : "positivo"}>{transaction.value.toString().replace('.',',')}</Value>
              </ListItemContainer>
            );
          })}
        </ul>

        <article>
          <strong>Saldo</strong>
          <Value color={balance < 0 ? "negativo": "positivo"}>{balance.toFixed(2).toString().replace('.',',')}</Value>
        </article>
      </TransactionsContainer>


      <ButtonsContainer>
        <button>
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </button>
        <button>
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