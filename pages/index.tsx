import React, { Fragment, useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { useFirebaseUser, mapCoordinateToScreen, vmin, getRandomColor } from '../helpers/util';
import { Button, IconButton, Paper, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

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
	}} className={props.rightPanelActivated ? "animated moveLeft" : ""}>
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
		}, props.rightPanelActivated ? {boxShadow: "none"} : {})
		} elevation={5}>
			<Button style={{
				width: "40vmin",
				height: "40vmin",
				position: "relative",
				backgroundColor: "white",
				borderRadius: "50%",
				fontSize: "5vmin",
				color: "black"
			}} onClick={props.onClick} className={"animated infinite " + (props.rightPanelActivated ? "stopSwing" : "swing")} disabled={props.rightPanelActivated}>
				Prioritize
			</Button>
		</Paper>
	</Paper>;
}
const RightPanel = (props) => {
	return <Paper style={{
		visibility: props.show ? "visible" : "hidden",
		position: "absolute",
		display: "flex",
		flexDirection: "column",
		width: "45vmin",
		padding: "10px"
	}} className={props.show ? "animated fadeInLeft" : ""}>
		<Button
			style={{
				position: "relative",
				height: "10vh"
			}}
			href="/login"
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
			href="/register"
			variant="outlined"
			size="large"
		>
			Register
		</Button>
	</Paper>
}
const Index = () => {
	const user = useFirebaseUser();
	if (user) Router.push('/board');
	const [extraButtons, setExtraButtons] = useState<Array<JSX.Element>>([]);
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
	const [showRightPanel, setShowRightPanel] = useState<boolean>(false);
	const handleClick = () => {
		console.log('Button clicked');
		setShowRightPanel(true);
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
					}
				  
					to {
					  opacity: 1;
					  transform: translate3d(30vmin, 0, 0);
					}
				  }
				  
				  .fadeInLeft {
					animation-name: fadeInLeft;
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
							<MainButton onClick={handleClick} rightPanelActivated={showRightPanel} />
							<RightPanel show={showRightPanel} />
						</div>
					</Fragment>
				) : <Fragment />
			}
		</Fragment>
	)
}

export default Index;
