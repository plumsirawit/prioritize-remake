import React, {Fragment, useState, useEffect} from 'react';
import firebase from 'firebase';
import Router from 'next/router';
import Link from 'next/link';
import firebaseConfig from '../firebase-config.json';

const Index = () => {
	const [user, setUser] = useState<undefined | firebase.User>();
	if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
	useEffect(() => firebase.auth().onAuthStateChanged(function (us) {
		setUser(us);
	}));
	useEffect(() => {
		if(user){
			Router.push('/board');
		}
	}, [user]);

	return (
		<React.Fragment>
			{user === undefined ? (
				<Fragment>
					<Link href="/">Home</Link>
					<Link href="/login">Login</Link>
					<Link href="/register">Register</Link>
				</Fragment>
			) : null}
		</React.Fragment>
	)
	// return <div>
	// 	{
	// 	user ? <Fragment></Fragment> :
		// <Fragment>
		// 	<Link href="/">Home</Link>
		// 	<Link href="/login">Login</Link>
		// 	<Link href="/register">Register</Link>
		// </Fragment>
	// 	}
	// </div>;
}

export default Index;
