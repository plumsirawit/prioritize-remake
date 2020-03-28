import React, { Fragment, useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { useFirebaseUser, mapCoordinateToScreen, vmin, getRandomColor } from '../helpers/util';
import { Button, IconButton, Paper, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const Circle = (props) => {
	const [x, y] = mapCoordinateToScreen(props.x, props.y);
	const r = props.r * vmin(100);
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
const Index = () => {
	const user = useFirebaseUser();
	if (user) Router.push('/board');
	let extraButtons = [];
	const createButton = () => {
		const x = Math.random()*2-1;
		const y = Math.random()*2-1;
		const r = Math.random()/25 + 0.01;
		const col = getRandomColor();
		return <Circle x={x} y={y} r={r} color={col} disabled />
	}
	for(let i = 0; i < 50; i++){
		extraButtons.push(createButton())
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
				  
				.swing {
					transform-origin: center center;
					animation-name: swing;
				}

				.animated {
					animation-duration: 0.75s;
					animation-fill-mode: both;
					animation-iteration-count: infinite;
				}
				
				@media (print), (prefers-reduced-motion: reduce) {
					.animated {
						animation-duration: 1ms !important;
						transition-duration: 1ms !important;
						animation-iteration-count: 1 !important; 
					}
				}
			`}</style>
			{
			user === null ? (
				<Fragment>
					{extraButtons}
					<div style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center"
					}}>
						<Paper style={{
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
						}}>
							<Paper style={{
								width: "40vmin",
								height: "40vmin",
								position: "relative",
								backgroundColor: "white",
								borderRadius: "50%",
								fontSize: "5vmin",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}} elevation={5}>
								<Button style={{
									width: "40vmin",
									height: "40vmin",
									position: "relative",
									backgroundColor: "white",
									borderRadius: "50%",
									fontSize: "5vmin"
								}} href="/login" className="animated infinite swing">
									Prioritize
								</Button>
							</Paper>
						</Paper>
						<Button
						style={{
							width: "45vmin",
							zIndex: 1,
							position: "relative",
							backgroundColor: "white",
							marginTop: "5vh"
						}}
						href="/register"
						variant="contained"
						>
							Register
						</Button>
					</div>
				</Fragment>
			) : <Fragment />
			}
		</Fragment>
	)
}

export default Index;
