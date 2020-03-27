import React, { useState, useEffect, Fragment } from 'react';
import firebase from 'firebase';
import Router from 'next/router';
import { useFirebaseUser } from '../helpers/util';
import { Paper, Typography, TextField, Button } from '@material-ui/core';

const Login = () => {
	const user = useFirebaseUser();
	useEffect(() => {
		if (user) Router.push('/board');
	}, [user]);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const handleSubmit = async (e) => {
		e.preventDefault();
		firebase.auth().signInWithEmailAndPassword(email, password).then(() => { }).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log('ERROR', errorCode, errorMessage);
		});
	}
	const handleEmailChange = (e) => setEmail(e.target.value);
	const handlePasswordChange = (e) => setPassword(e.target.value);
	return <Fragment>
		<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet" />
		<style jsx global>{`
			body {
				background: gray;
				margin: 0px;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100vw;
				height: 100vh;
			}
		`}</style>
		{
			user || user === undefined ? <Fragment></Fragment> :
				<Paper
					style={{
						width: "30vw",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						padding: "20px"
					}}
				>
					<Typography variant="h3">Login</Typography>
					<form onSubmit={handleSubmit}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							width: "100%",
							padding: "10px 10px 0px 10px"
						}}
					>
						<TextField
							style={{
								marginBottom: "20px"
							}}
							fullWidth label="Email" type="email" value={email} onChange={handleEmailChange} />
						<TextField
							style={{
								marginBottom: "20px"
							}}
							fullWidth label="Password" type="password" value={password} onChange={handlePasswordChange} />
						<Button
							style={{
								marginTop: "60px",
								width: "100%" 
							}}
							variant="contained" color="primary" type="submit">Login</Button>
					</form>
				</Paper>
		}
	</Fragment>;
}
export default Login;