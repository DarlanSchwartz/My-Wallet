import axios from "axios";

export function Login(loginObj, callback) {
	axios.post(`${import.meta.env.VITE_API_URL}`, loginObj)
		.then((res) => {
			callback(res, false);
		})
		.catch((err) => {
			callback(err, true);
		});
}

export function Singup(singupObj, callback) {
	axios.post(`${import.meta.env.VITE_API_URL}/cadastro`, singupObj)
		.then((res) => {
			callback(res, false);
		})
		.catch((err) => {
			callback(err, true);
		});
}


export function GetTransactions(token, callback) {
	axios.get(`${import.meta.env.VITE_API_URL}/home`, {headers:{Authorization: `Bearer ${token}`}})
		.then((res) => {
			callback(res.data, false);
		})
		.catch((err) => {
			callback(err, true);
		});
}

export function NewTransaction(token, callback, type,transactionObj) {
	axios.post(`${import.meta.env.VITE_API_URL}/nova-transacao/${type}`, transactionObj,{headers:{Authorization: `Bearer ${token}`}})
	.then((res) => {
		callback(res.data, false);
	})
	.catch((err) => {
		callback(err, true);
	});
}

export function DeleteTransaction(token, callback,id) {
	axios.delete(`${import.meta.env.VITE_API_URL}/deletar-registro/${id}`,{headers:{Authorization: `Bearer ${token}`}})
	.then((res) => {
		callback(res.data, false);
	})
	.catch((err) => {
		callback(err, true);
	});
}

export function EditTransaction(token, callback, id,newValues,type) {
	axios.put(`${import.meta.env.VITE_API_URL}/editar-registro/${type}/${id}`, newValues,{headers:{Authorization: `Bearer ${token}`}})
	.then((res) => {
		callback(res.data, false);
	})
	.catch((err) => {
		callback(err, true);
	});	
}