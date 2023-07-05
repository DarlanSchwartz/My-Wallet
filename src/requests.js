import axios from "axios";

export function Login(loginObj,callback)
{
	axios.post(`${import.meta.env.VITE_API_URL}`,loginObj)
	.then((res)=>{
		callback(res,false);
	})
	.catch((err)=>{
		callback(err,true);
	});
}

export function Singup(singupObj,callback)
{
	axios.post(`${import.meta.env.VITE_API_URL}/cadastro`,singupObj)
	.then((res)=>{
		callback(res,false);
	})
	.catch((err)=>{
		callback(err,true);
	});
}


export function GetTransactions(token,callback)
{
	axios.get(`${import.meta.env.VITE_API_URL}/home`,{headers:`Bearer ${token}`})
	.then((res)=>{
		callback(res,false);
	})
	.catch((err)=>{
		callback(err,true);
	});
}