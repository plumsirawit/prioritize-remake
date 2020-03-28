import React from 'react';
import Logo from './logo';
import { Paper, Typography } from '@material-ui/core';

const About = () => {
	return <div className="App">
		<header className="App-header">
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
			<div style={{ opacity: 0 }} className="fadeIn">
				<div style={{ width: "40vmin", margin: "auto" }}>
					<Paper elevation={3} style={{ fontSize: 0 }} className="logoPaper">
						<Logo />
					</Paper>
				</div>
				<br />
				<Typography variant="h6">
					Prioritize 1.1.0
					</Typography>
				<Typography variant="body1">
					An assistive application to help prioritize things
					</Typography>
				<br />
				<Typography variant="body2">
					© plumsirawit 2020
					</Typography>
				<a
					className="App-link"
					href="https://prioritize.plummmm.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Typography variant="body2">
						Prioritize 0.0.0
						</Typography>
				</a>
			</div>
		</header>
		<style>{`
		body {
			margin: 0;
			overflow: hidden;
		}
		.App {
			text-align: center;
		  }
		  
		  .App-logo {
			height: 40vmin;
			width: auto;
			pointer-events: none;
		  }
		  
		  .App-header {
			background-color: #282c34;
			min-height: 100vh;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: calc(10px + 2vmin);
			color: white;
		  }
		  
		  .App-link {
			color: #61dafb;
		  }
		  
		  @keyframes App-logo-spin {
			from {
			  transform: rotate(0deg);
			}
			to {
			  transform: rotate(360deg);
			}
		  }
		  
		  @-webkit-keyframes fadeIn {
			  from {
				opacity: 0;
			  }
			
			  to {
				opacity: 1;
			  }
			}
			
			@keyframes fadeIn {
			  from {
				opacity: 0;
			  }
			
			  to {
				opacity: 1;
			  }
			}
			
			.fadeIn {
			  -webkit-animation-name: fadeIn;
			  animation-name: fadeIn;
			  animation-duration: 3s;
				animation-delay: 0s;
				animation-fill-mode: forwards; 
				-webkit-animation-fill-mode: forwards;
			}
		  
			.logoPaper {
			  display: flex;
			  width: 100%;
			  height: 0;
			  padding-top: 50%;
			  padding-bottom: 50%;
			  align-items: center;
			  justify-content: center;
			}
		`}</style>
	</div>;
}

export default About;
