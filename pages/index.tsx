import React, { Fragment, useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { useFirebaseUser, mapCoordinateToScreen, vmin, getRandomColor } from '../helpers/util';
import { Button, IconButton, Paper, Typography, TextField } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import firebase from 'firebase/app';
import 'firebase/auth';

const Circle = (props) => {
	const [x, setX] = useState<number>(0);
	const [y, setY] = useState<number>(0);
	const [r, setR] = useState<number>(0);
	const updateScreenSize = () => {
		const [curX, curY] = mapCoordinateToScreen(props.x, props.y);
		const curR = props.r * vmin(100);
		setX(curX);
		setY(curY);
		setR(curR);
	}
	useEffect(() => {
		window.addEventListener("resize", updateScreenSize);
		updateScreenSize();
		return () => window.removeEventListener("resize", updateScreenSize);
	}, []);
	return <div
		{...props}
		href={props.href}
		style={{
			height: (2 * r || 2).toString() + "px",
			width: (2 * r || 2).toString() + "px",
			backgroundColor: props.color || "black",
			borderRadius: "50%",
			float: "left",
			display: "flex",
			position: "absolute",
			top: "calc(50% - " + (r || 1).toString() + "px)",
			left: "calc(50% - " + (r || 1).toString() + "px)",
			padding: "0px",
			border: "1px solid black",
			transform: "translate(" + x.toString() + "px, " + y.toString() + "px)",
			minWidth: "0px"
		}}
	>
	</div>
}
enum ApplicationState {
	INIT,
	PANELI,
	PANELL,
	PANELR,
	LOGIN,
	REGIS
}
const MainButton = (props) => {
	return <Paper style={{
		width: "45vmin",
		height: "45vmin",
		position: "relative",
		backgroundColor: "white",
		borderRadius: "50%",
		borderStyle: "solid",
		borderWidth: "1px",
		fontSize: "5vmin",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}} className={props.appState === ApplicationState.PANELI ? "animated moveLeft" : props.appState !== ApplicationState.INIT ? "stayLeft" : ""}>
		<Paper style={Object.assign({
			width: "40vmin",
			height: "40vmin",
			position: "relative",
			backgroundColor: "white",
			borderRadius: "50%",
			fontSize: "5vmin",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}, props.appState !== ApplicationState.INIT ? { boxShadow: "none" } : {})
		} elevation={5}>
			<Button style={{
				width: "40vmin",
				height: "40vmin",
				position: "relative",
				backgroundColor: "white",
				borderRadius: "50%",
				fontSize: "5vmin",
				color: "black"
			}} onClick={props.onClick} className={"animated infinite " + (props.appState !== ApplicationState.INIT ? "stopSwing" : "swing")} disabled={props.appState !== ApplicationState.INIT}>
				Prioritize
			</Button>
		</Paper>
	</Paper>;
}
const RightPanel = (props) => {
	let currentClass = "";
	switch (props.appState) {
		case ApplicationState.INIT:
			currentClass = "";
			break;
		case ApplicationState.PANELI:
			currentClass = "animated fadeInLeft";
			break;
		case ApplicationState.PANELL:
		case ApplicationState.PANELR:
			currentClass = "animated fadeInRight";
			break;
		default:
			currentClass = "animated fadeOutRight";
	}
	return <Paper style={{
		visibility: "hidden",
		opacity: 0,
		position: "absolute",
		display: "flex",
		flexDirection: "column",
		width: "45vmin",
		padding: "10px"
	}} className={currentClass}>
		<Button
			style={{
				position: "relative",
				height: "10vh"
			}}
			onClick={props.handleLogin}
			variant="outlined"
			size="large"
		>
			Login
		</Button>
		<Button
			style={{
				position: "relative",
				marginTop: "10px",
				height: "10vh"
			}}
			onClick={props.handleRegister}
			variant="outlined"
			size="large"
		>
			Register
		</Button>
	</Paper>
}
const LoginFragment = (props) => {
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
	return <div
		style={{
			width: "45vmin",
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
	</div>;
}
const RegisFragment = (props) => {
	const user = useFirebaseUser();
	useEffect(() => {
		if (user) Router.push('/board');
	}, [user]);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const handleSubmit = async (e) => {
		e.preventDefault();
		firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
			console.log('OK');
			alert('OK');
		}).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});
	}
	const handleEmailChange = (e) => setEmail(e.target.value);
	const handlePasswordChange = (e) => setPassword(e.target.value);
	return <div
		style={{
			width: "45vmin",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			padding: "20px"
		}}
	>
		<Typography variant="h3">Registration</Typography>
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
				variant="contained" color="primary" type="submit">Register</Button>
		</form>
	</div>;
}
const LoginPanel = (props) => {
	let currentClass = "";
	switch (props.appState) {
		case ApplicationState.PANELL:
			currentClass = "animated fadeOutRight";
			break;
		case ApplicationState.LOGIN:
			currentClass = "animated fadeInRight";
			break;
		default:
			currentClass = "";
	}
	return <Paper style={{
		visibility: "hidden",
		opacity: 0,
		position: "absolute",
		display: "flex",
		flexDirection: "row",
		padding: "10px"
	}} className={currentClass}>
		<LoginFragment />
	</Paper>;
}
const RegisterPanel = (props) => {
	let currentClass = "";
	switch (props.appState) {
		case ApplicationState.PANELR:
			currentClass = "animated fadeOutRight";
			break;
		case ApplicationState.REGIS:
			currentClass = "animated fadeInRight";
			break;
		default:
			currentClass = "";
	}
	return <Paper style={{
		visibility: "hidden",
		opacity: 0,
		position: "absolute",
		display: "flex",
		flexDirection: "column",
		padding: "10px"
	}} className={currentClass}>
		<RegisFragment />
	</Paper>
}
const BackArrow = (props) => {
	let currentClass = "";
	switch (props.appState) {
		case ApplicationState.PANELL:
		case ApplicationState.PANELR:
			currentClass = "animated fadeOutArrow";
			break;
		case ApplicationState.REGIS:
		case ApplicationState.LOGIN:
			currentClass = "animated fadeInArrow";
			break;
		default:
			currentClass = "";
	}
	return <Paper style={{
		margin: "auto",
		visibility: "hidden",
		opacity: 0,
		position: "absolute",
		display: "flex",
		flexDirection: "row",
		padding: "10px",
		borderRadius: "50%"
	}} className={currentClass}>
		<IconButton onClick={props.onClick}>
			<ArrowBackIcon />
		</IconButton>
	</Paper>;
}
const Index = () => {
	const user = useFirebaseUser();
	if (user) Router.push('/board');
	const [extraButtons, setExtraButtons] = useState<Array<JSX.Element>>([]);
	const [applicationState, setApplicationState] = useState<ApplicationState>(ApplicationState.INIT);
	useEffect(() => {
		// Random is impure... only use inside effect.
		const createButton = (idx) => {
			const x = Math.random() * 2 - 1;
			const y = Math.random() * 2 - 1;
			const r = Math.random() / 25 + 0.01;
			const col = getRandomColor();
			return <Circle key={idx} x={x} y={y} r={r} color={col} disabled />
		}
		for (let i = 0; i < 50; i++) {
			extraButtons.push(createButton(i));
			setExtraButtons(extraButtons);
		}
	}, []);
	const handleClick = () => {
		console.log('Button clicked');
		setApplicationState(ApplicationState.PANELI);
	}
	const handleLogin = () => {
		console.log('Handling Login');
		setApplicationState(ApplicationState.LOGIN);
	}
	const handleRegister = () => {
		console.log('Handling Registration');
		setApplicationState(ApplicationState.REGIS);
	}
	const handleBack = () => {
		console.log('Handling Back');
		if(applicationState === ApplicationState.LOGIN) setApplicationState(ApplicationState.PANELL);
		else setApplicationState(ApplicationState.PANELR);
	}
	return (
		<Fragment>
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
			<style jsx global>{`
				body {
					overflow: hidden;
					display: flex;
					width: 100vw;
					height: 100vh;
					justify-content: center;
					align-items: center;
					background: black;
				}
				@keyframes swing {
					from {
						transform: rotate(-20deg);
					}

					50%{
						transform: rotate(20deg);
					}
				
					to {
					  	transform: rotate(-20deg);
					}
				}
				  
				.animated.swing {
					transform-origin: center center;
					animation-name: swing;
					animation-iteration-count: infinite;
					animation-duration: 0.75s;
				}

				@keyframes stopSwing {
					to {
						transform: rotate(0deg);
					}
				}

				.animated.stopSwing {
					transform-origin: center center;
					animation-name: stopSwing;
					animation-duration: 1s;
				}

				.animated {
					animation-duration: 1s;
					animation-fill-mode: both;
				}
				
				@media (print), (prefers-reduced-motion: reduce) {
					.animated {
						animation-duration: 1ms !important;
						transition-duration: 1ms !important;
						animation-iteration-count: 1 !important; 
					}
				}
				@keyframes fadeInLeft {
					from {
						opacity: 0;
						transform: translate3d(0, 0, 0);
						visibility: hidden;
					}
				  
					to {
						opacity: 1;
						transform: translate3d(30vmin, 0, 0);
						visibility: visible;
					}
				}
				  
				.fadeInLeft {
					animation-name: fadeInLeft;
				}
				
				@keyframes fadeInRight {
					from {
						opacity: 0;
						transform: translate3d(100%, 0, 0);
						visibility: hidden;
					}
				  
					to {
						opacity: 1;
						transform: translate3d(30vmin, 0, 0);
						visibility: visible;
					}
				}
				  
				.fadeInRight {
					animation-name: fadeInRight;
				}

				@keyframes fadeInArrow {
					from {
						opacity: 0;
						transform: translate3d(100%, 0, 0);
						visibility: hidden;
					}
				  
					to {
						opacity: 1;
						transform: translate3d(0, 0, 0);
						visibility: visible;
					}
				}
				  
				.fadeInArrow {
					animation-name: fadeInArrow;
				}

				@keyframes fadeOutArrow {
					from {
						opacity: 1;
						transform: translate3d(0, 0, 0);
						visibility: visible;
					}
				  
					to {
					  	opacity: 0;
						transform: translate3d(100%, 0, 0);
						visibility: hidden;
					}
				}
				  
				.fadeOutArrow {
					animation-name: fadeOutArrow;
				}

				@keyframes fadeOutRight {
					from {
						opacity: 1;
						transform: translate3d(30vmin, 0, 0);
						visibility: visible;
					}
				  
					to {
					  	opacity: 0;
						transform: translate3d(100%, 0, 0);
						visibility: hidden;
					}
				}
				  
				.fadeOutRight {
					animation-name: fadeOutRight;
				}

				@keyframes moveLeft {
					from {
						transform: translate3d(0, 0, 0);
					}
				  
					to {
						transform: translate3d(-30vmin, 0, 0);
					}
				}
				  
				.moveLeft {
					animation-name: moveLeft;
				}
				  
				.stayLeft {
					transform: translate3d(-30vmin, 0, 0);
				}
			`}</style>
			{
				user === null ? (
					<Fragment>
						{extraButtons}
						<div style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center"
						}}>
							<MainButton onClick={handleClick} appState={applicationState} />
							<RightPanel appState={applicationState} handleLogin={handleLogin} handleRegister={handleRegister} />
							<BackArrow appState={applicationState} onClick={handleBack}/>
							<LoginPanel appState={applicationState} />
							<RegisterPanel appState={applicationState} />
						</div>
					</Fragment>
				) : <Fragment />
			}
		</Fragment>
	)
}

export default Index;
