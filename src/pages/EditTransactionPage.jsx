import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { EditTransaction } from "../requests";
import dayjs from "dayjs";
import { ThreeDots } from 'react-loader-spinner';
import { toast } from "react-toastify";


export default function EditTransactionPage() {

  const {tipo} = useParams(); // in || out
  const navigate = useNavigate();
  const [value,setValue]  = useState('');
  const description  = useRef();
  const location = useLocation();
  const [id,setId] = useState();
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem('token') == undefined) return navigate('/');

    setValue(location.state.split(',')[0]);
    setId(location.state.split(',')[2]);
    description.current.value = location.state.split(',')[1];
  },[])

  function editTransactionEvent(e)
  {
    e.preventDefault();
    setLoading(true);
    EditTransaction(localStorage.getItem('token'),transactionSucess,id,{value,description:description.current.value},tipo);
  }

  function transactionSucess(message,error)
  {
    setLoading(false);
    if(error) return alert(message.response.data);
    toast.success( 'Sucesso ao editar transação!', {
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
      <h1>Editar {tipo == 'entrada'? 'entrada' : 'saída'}</h1>
      <form onSubmit={editTransactionEvent}>
        <input data-test="registry-amount-input" value={value} onChange={(e)=> {setValue(e.target.value.replace(/[^0-9.-]/g, ''))}} required placeholder="Valor" type="text"/>
        <input data-test="registry-name-input" ref={description} required placeholder="Descrição" type="text" />
        <button className="update-btn" data-test="registry-save" >{loading && <ThreeDots color="rgba(255, 255, 255, 1)" height={13} width={51} />}{!loading && 'Atualizar '}{!loading && (tipo == 'entrada'? 'entrada' : 'saída')}</button>
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
    .update-btn{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`
