import React, { useState, useEffect, Fragment } from 'react';
import firebase from 'firebase';
import firebaseConfig from '../firebase-config.json';
import Router from 'next/router';

const Login = () => {
	const [user, setUser] = useState<firebase.User | undefined | null>(undefined);
	if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
	useEffect(() => firebase.auth().onAuthStateChanged(function (us) {
		setUser(us);
		if(us){
			Router.push('/board');
		}
	}));
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const handleSubmit = async (e) => {
		e.preventDefault();
		firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
			console.log('OK');
		}).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});
	}
	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	}
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	}
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