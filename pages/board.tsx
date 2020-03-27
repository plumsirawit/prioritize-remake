import React, { useState, useEffect, Fragment, createRef, RefObject } from 'react';
import Draggable, { DraggableCore, ControlPosition } from 'react-draggable';
import firebase, { FirebaseError } from 'firebase';
import Router from 'next/router';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Popover, Typography, makeStyles, createStyles, Theme, useMediaQuery, useTheme, Checkbox } from '@material-ui/core';
import { useFirebaseUser, logout, updateDB, deleteDB, vmin } from '../helpers/util';
const VerticalLine = () => <div style={{ borderLeft: "2px solid black", height: "100%", position: "absolute", left: "50%", top: "0%" }}></div>;
const HorizontalLine = () => <div style={{ borderTop: "2px solid black", width: "100%", position: "absolute", left: "0%", top: "50%" }}></div>;
class TaskDialog extends React.Component<any, any> {
	constructor(props){
		super(props);
		this.state = {
			currentTaskName: props.data.name || "",
			currentTaskDescs: props.data.descs || "",
			currentTaskColor: props.data.color || "#FFFFFF"
		}
	}
	componentWillMount() {
		console.log('Dialog Rerender');
	}
	componentWillUpdate() {
		console.log('Dialog Update');
	}
	handleDialogClose(confirm) {
		if (confirm === "update" && !this.currentColorError()) {
			this.props.setDialogOpen(false);
			updateDB(this.props.docId, { name: this.state.currentTaskName, descs: this.state.currentTaskDescs, color: this.state.currentTaskColor });
		} else if (confirm === "destroy") {
			this.props.setDialogOpen(false);
			deleteDB(this.props.docId);
		} else {
			this.props.setDialogOpen(false);
		}
	}
	currentColorError(){
		let re = /#[a-fA-F0-9]{6}/;
		return this.state.currentTaskColor.length != 7 || !re.test(this.state.currentTaskColor);
	}
	shouldComponentUpdate(nextProps, nextState) {
		return this.state !== nextState || this.props.data !== nextProps.data || this.props.fullScreen !== nextProps.fullScreen || this.props.docId !== nextProps.docId || this.props.dialogOpen !== nextProps.dialogOpen;
	}
	render() {
		return <Dialog open={this.props.dialogOpen} onClose={() => this.handleDialogClose(false)} aria-labelledby="form-dialog-title" fullScreen={this.props.fullScreen}>
			<DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
			<DialogContent>
				<DialogContentText>You can edit task name and description below.</DialogContentText>
				<TextField
					margin="dense"
					id="name"
					label="Task Name"
					type="text"
					fullWidth
					value={this.state.currentTaskName}
					onChange={(e) => {
						this.setState({...this.state, currentTaskName: e.target.value});
					}}
				/>
				<TextField
					margin="dense"
					id="descs"
					label="Task Description"
					type="text"
					fullWidth
					multiline
					value={this.state.currentTaskDescs}
					onChange={(e) => {
						this.setState({...this.state, currentTaskDescs: e.target.value});
					}}
				/>
				<TextField
					margin="dense"
					id="color"
					label="Pin Color"
					type="text"
					fullWidth
					error={this.currentColorError()}
					helperText={this.currentColorError() && "Incorrect color HEX format"}
					value={this.state.currentTaskColor}
					onChange={(e) => {
						this.setState({...this.state, currentTaskColor: e.target.value});
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => this.handleDialogClose(false)} color="primary">
					Cancel
		</Button>
				<Button onClick={() => this.handleDialogClose("update")} color="primary">
					Confirm
		</Button>
				<Button onClick={() => this.handleDialogClose("destroy")} color="primary">
					Delete
		</Button>
			</DialogActions>
		</Dialog>;
	}
}
class TaskPopover extends React.Component<any,any> {
	constructor(props) {
		super(props);
	}
	componentWillMount(){
		console.log('Popover rerender');
	}
	componentWillUpdate(){
		console.log('Popover update');
	}
	shouldComponentUpdate(nextProps, nextState){
		return this.props.showInfo !== nextProps.showInfo || this.props.showInfo;
	}
	render() {
		return <Popover
			className={this.props.classes.popover}
			classes={{
				paper: this.props.classes.paper,
			}}
			open={this.props.showInfo}
			anchorReference="anchorPosition"
			anchorPosition={{left: window.innerWidth/2 + this.props.data.x, top: window.innerHeight/2 + this.props.data.y + vmin(1)}}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			onClose={this.props.handleOut}
			disableRestoreFocus
		>
			<Typography>{this.props.data.name}</Typography>
		</Popover>;
	}
}
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
	const [currentPos, setCurrentPos] = useState({ x: props.data.x || 0, y: props.data.y || 0 });
	const [isMouseDown, setIsMouseDown] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const handleStart = () => {
		setIsMouseDown(true);
	}
	const handleStop = (e, position) => {
		setIsMouseDown(false);
		const { x, y } = position;
		if (currentPos.x === x && currentPos.y === y) {
			setDialogOpen(true);
			return;
		}
		setCurrentPos({x: x, y: y});
		props.updateDB(props.docId, { x: x, y: y });
	}
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const handleHover = () => setIsHovering(true);
	const handleOut = () => setIsHovering(false);
	const showInfo: boolean = (isHovering || props.forceShowInfo) && !isMouseDown;
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
	return <Fragment>
		<Draggable defaultPosition={currentPos} onStart={handleStart} onStop={handleStop}>
			<Button className={classes.pinButton}
				variant="contained"
				onMouseOver={handleHover}
				onMouseLeave={handleOut}
				href=""
			></Button>
		</Draggable>
		<TaskDialog data={props.data} docId={props.docId} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} fullScreen={fullScreen}/>
		<TaskPopover data={props.data} classes={classes} showInfo={showInfo} handleOut={handleOut}/>
	</Fragment>;
}
const Board = () => {
	const user = useFirebaseUser();
	useEffect(() => {
		if (user === null) Router.push('/login');
	}, [user]);
	const [items, setItems] = useState([]);
	const [forceShowInfo, setForceShowInfo] = useState<boolean>(false);
	useEffect(() => {
		if (user) {
			return firebase.firestore().collection('tasks').where("uid", "==", user.uid).onSnapshot((querySnapshot) => {
				let curItems = [];
				querySnapshot.forEach((doc) => {
					curItems.push(<TaskItem key={doc.id} docId={doc.id} data={doc.data()} updateDB={updateDB} deleteDB={deleteDB} forceShowInfo={forceShowInfo} />);
				});
				setItems(curItems);
			});
		}
	}, [user, forceShowInfo]);
	const addTask = () => {
		if (user) {
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
		<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet" />
		{
			!user ? <Fragment /> :
				<div>
					<VerticalLine />
					<HorizontalLine />
					<div style={{
						right: "0px",
						top: "0px",
						margin: "10px",
						padding: "5px",
						position: "absolute",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						background: "white",
						borderRadius: "5px",
						borderStyle: "solid",
						width: "10vw",
						minWidth: "100px"
					}}>
						<div style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "row"
						}}>
							<Checkbox
								checked={forceShowInfo}
								onChange={(e) => setForceShowInfo(e.target.checked)}
								value="primary"
								inputProps={{ 'aria-label': 'primary checkbox' }}
							/>
							<Typography variant="caption">
								Display Names
							</Typography>
						</div>
						<div style={{
							borderBottomStyle: "solid",
							width: "100%",
							marginTop: "2px"
						}}></div>
						<Button style={{margin: "5px", width: "16ch"}} variant="outlined" onClick={addTask}>Create</Button>
						<Button style={{marginBottom: "5px", width: "16ch"}} variant="outlined" onClick={() => Router.push('/about')}>About</Button>
						<Button style={{width: "16ch"}} color="secondary" variant="outlined" onClick={logout}>Logout</Button>
					</div>
					{items}
				</div>
		} </Fragment>;
}
export default Board;