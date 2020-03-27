import React, { useState, useEffect, Fragment } from 'react';
import firebase from 'firebase';
import Router from 'next/router';
import { useFirebaseUser } from '../helpers/util';

const Login = () => {
	const user = useFirebaseUser();
	useEffect(() => {
		if(user) Router.push('/board');
	}, [user]);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const handleSubmit = async (e) => {
		e.preventDefault();
		firebase.auth().signInWithEmailAndPassword(email, password).then(() => {}).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log('ERROR', errorCode, errorMessage);
		});
	}
	const handleEmailChange = (e) => setEmail(e.target.value);
	const handlePasswordChange = (e) => setPassword(e.target.value);
	return <Fragment> {
		user || user === undefined ? <Fragment></Fragment> :
		<div>
		Login Page
		<form onSubmit={handleSubmit}>
			<input type="email" value={email} onChange={handleEmailChange} />
			<input type="password" value={password} onChange={handlePasswordChange} />
			<input type="submit" />
		</form>
		</div>
	} </Fragment>;
}
export default Login;