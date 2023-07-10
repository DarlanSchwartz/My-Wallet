import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import {BsFillTrash3Fill} from "react-icons/bs";
import { useEffect, useState } from "react"
import { DeleteTransaction, GetTransactions } from "../requests";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import trashIcon from '/trash.png';
import logoutIcon from '/logout.svg';

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
    if(error){
      console.log(userTransactions);
      return;
    }
    
    console.log(`Sucess getting ${userTransactions.username} info.`);
    setTransactions(userTransactions.transactions.reverse());
    setUser(userTransactions.username);
    setBalance(userTransactions.balance);
  }

  function logout()
  {
    Swal.fire({
      title: `<span style="font-family: 'Raleway', sans-serif;font-size: 20px;color:black">Deseja sair?</span>`,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#8c11be',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      width: 300,
      heightAuto: false,
      imageUrl: logoutIcon,
      imageWidth: 200,
      imageHeight: 100,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        navigate('/');
      }
    });
  }

  function deleteTransaction(id,name)
  {
    Swal.fire({
      title: `<span style="font-family: 'Raleway', sans-serif;font-size: 20px;color:white">Remover ${name}?</span>`,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#8c11be',
      confirmButtonText: 'Remover',
      cancelButtonText: 'Cancelar',
      width: 300,
      heightAuto: false,
      imageUrl: trashIcon,
      imageWidth: 100,
      imageHeight: 100,
      background:'#1f1f1f'
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteTransaction(localStorage.getItem('token'), finishDelete,id);
      }
    });
  }

  function finishDelete(message,error){
    if(error) return alert(message.data.response.message);
    setTransactions(message.transactions.reverse());
    setBalance(message.balance);
    
    toast.error( 'Transação removida com sucesso!', {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "colored",
      });
  }

  function editTransaction(id,tipo,value,description)
  {
    navigate(`/editar-registro/${tipo}`,{state:`${value},${description},${id}`})
  }

  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Olá, {user}</h1>
        <BiExit data-test="logout" onClick={logout} className="logout-btn"/>
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
                  <BsFillTrash3Fill data-test="registry-delete" className="delete-btn" onClick={()=>deleteTransaction(transaction.id,transaction.description)}/>
                </div>
              </ListItemContainer>
            );
          })}
          {transactions && transactions.length == 0 && <p className="none-registries">Não há registros de entrada ou saída</p>}
        </ul>
       
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
    transition: all 200ms;
    &:hover{
      color: #c29cd3;
    }
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
    min-height: 350px;
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
    position: absolute;
    width: 300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    
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
  color: ${(props) => (props.color === "positivo" ? "rgb(24, 224, 24)" : "rgb(255, 26, 26)")};
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