import React, {Fragment, useState, useEffect} from 'react';
import firebase from 'firebase';
import Router from 'next/router';
import Link from 'next/link';
import firebaseConfig from '../firebase-config.json';
import { useFirebaseUser } from '../helpers/util';

const Index = () => {
	const user = useFirebaseUser();
	if(user) Router.push('/board');
	return (
		<React.Fragment>
			{user === null ? (
				<Fragment>
					<Link href="/">Home</Link>
					<Link href="/login">Login</Link>
					<Link href="/register">Register</Link>
				</Fragment>
			) : null}
		</React.Fragment>
	)
}

export default Index;
