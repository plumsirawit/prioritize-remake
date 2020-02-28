import React, { useState, useEffect, Fragment } from 'react';
import Draggable, { DraggableCore, ControlPosition } from 'react-draggable';
import firebaseConfig from '../firebase-config.json';
import firebase, { FirebaseError } from 'firebase';
import Router from 'next/router';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Popover, Typography, makeStyles, createStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core';

const VerticalLine = () => <div style={{ borderLeft: "2px solid black", height: "100%", position: "absolute", left: "50%", top: "0%" }}></div>;
const HorizontalLine = () => <div style={{ borderTop: "2px solid black", width: "100%", position: "absolute", left: "0%", top: "50%" }}></div>;
const TaskItem = (props) => {
	const classes = makeStyles((theme: Theme) =>
		createStyles({
			popover: {
				pointerEvents: 'none',
			},
			paper: {
				padding: theme.spacing(1),
			},
			pinButton: {
				height: "2vmin",
				minWidth: "2vmin",
				width: "2vmin",
				backgroundColor: props.data.color,
				borderRadius: "50%",
				float: "left",
				display: "block",
				position: "absolute",
				top: "calc(50% - 1vmin)",
				left: "calc(50% - 1vmin)",
				padding: "0px",
				border: "1px solid black"
			}
		}),
	)();
	const theme = useTheme();
	const [currentPos, setCurrentPos] = useState({ x: props.data.x || 0, y: props.data.y || 0 });
	const handleDrag = (e, position) => {
		const { x, y } = position;
		setCurrentPos({ x: x, y: y });
	};
	const [lastPos, setLastPos] = useState(currentPos);
	const handleStart = () => {
		setLastPos(currentPos);
	}
	const [dialogOpen, setDialogOpen] = useState(false);
	const handleStop = () => {
		if (lastPos === currentPos) {
			setDialogOpen(true);
			return;
		}
		props.updateDB(props.docId, { x: currentPos.x, y: currentPos.y });
	}
	const [currentTaskName, setCurrenntTaskName] = useState(props.data.name || "");
	const [currentTaskDescs, setCurrentTaskDescs] = useState(props.data.descs || "");
	const handleDialogClose = (confirm) => {
		setDialogOpen(false);
		if (confirm) {
			props.updateDB(props.docId, { name: currentTaskName, descs: currentTaskDescs });
		}
	}
	const handleHover = (e) => setAnchorEl(e.currentTarget);
	const handleOut = () => setAnchorEl(null);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const showInfo = Boolean(anchorEl);
	return <Fragment>
		<Draggable position={currentPos} onStart={handleStart} onDrag={handleDrag} onStop={handleStop}>
			<Button className={classes.pinButton}
				variant="contained"
				onMouseOver={handleHover}
				onMouseLeave={handleOut}> </Button>
		</Draggable>
		<Dialog open={dialogOpen} onClose={() => handleDialogClose(false)} aria-labelledby="form-dialog-title" fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}>
			<DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
			<DialogContent>
				<DialogContentText>You can edit task name and description below.</DialogContentText>
				<TextField
					margin="dense"
					id="name"
					label="Task Name"
					type="text"
					fullWidth
					value={currentTaskName}
					onChange={(e) => {
						setCurrenntTaskName(e.target.value);
					}}
				/>
				<TextField
					margin="dense"
					id="descs"
					label="Task Description"
					type="text"
					fullWidth
					multiline
					value={currentTaskDescs}
					onChange={(e) => {
						setCurrentTaskDescs(e.target.value);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleDialogClose(false)} color="primary">
					Cancel
			</Button>
				<Button onClick={() => handleDialogClose(true)} color="primary">
					Confirm
			</Button>
			</DialogActions>
		</Dialog>
		<Popover
			className={classes.popover}
			classes={{
				paper: classes.paper,
			}}
			open={showInfo}
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			onClose={handleOut}
			disableRestoreFocus
		>
			<Typography>{props.data.name}</Typography>
		</Popover>
	</Fragment>;
}
const Board = () => {
	const [user, setUser]: [String | firebase.User, any] = useState("unknown");
	if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
	useEffect(() => firebase.auth().onAuthStateChanged(function (u) {
		setUser(u);
	}));
	useEffect(() => {
		if (!user) Router.push('/login');
	}, [user]);
	const logout = () => {
		firebase.auth().signOut();
	}
	const [items, setItems] = useState([]);
	const isFirebaseUser = (us: String | firebase.User): us is firebase.User => {
		return true;
	}
	const updateDB = (docId, updData) => firebase.firestore().collection('tasks').doc(docId).update(updData);
	useEffect(() => {
		if (user && user !== "unknown" && isFirebaseUser(user)) {
			return firebase.firestore().collection('tasks').where("uid", "==", user.uid).onSnapshot((querySnapshot) => {
				let curItems = [];
				querySnapshot.forEach((doc) => {
					curItems.push(<TaskItem key={doc.id} docId={doc.id} data={doc.data()} updateDB={updateDB} />);
				});
				setItems(curItems);
			});
		}
	}, [user]);
	const addTask = () => {
		if (user && user !== "unknown" && isFirebaseUser(user)) {
			firebase.firestore().collection('tasks').add({
				color: "#000000",
				completed: "false",
				descs: "",
				name: "",
				uid: user.uid,
				vdeadline: null,
				x: 0,
				y: 0
			});
		}
	}
	return <Fragment>
		<style>@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');</style>
		{
			user === "unknown" || !user ? <Fragment /> :
				<div>
					<VerticalLine />
					<HorizontalLine />
					<button onClick={logout}>Logout</button>
					<button onClick={addTask}>New</button>
					{items}
				</div>
		} </Fragment>;
}
export default Board;