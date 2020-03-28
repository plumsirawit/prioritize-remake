import firebaseConfig from '../firebase-config.json';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useState, useEffect } from 'react';
export type NullableUndefinableUser = firebase.User | undefined | null;
export const useFirebaseUser = () => {
    useEffect(() => {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    });
    const [user, setUser] = useState<NullableUndefinableUser>(undefined);
    useEffect(() => firebase.auth().onAuthStateChanged(function (u) {
        setUser(u);
    }));
    return user;
}
export const logout = () => {
    firebase.auth().signOut();
}
export const updateDB = (docId, updData) => firebase.firestore().collection('tasks').doc(docId).update(updData);
export const deleteDB = (docId) => firebase.firestore().collection('tasks').doc(docId).delete();
export const vh = (v) => {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}
export const vw = (v) => {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (v * w) / 100;
}
export const vmin = (v) => {
    return Math.min(vh(v), vw(v));
}
export const vmax = (v) => {
    return Math.max(vh(v), vw(v));
}
export const mapCoordinateToScreen = (x, y) => {
    return [x * vw(50), y * vh(50)];
}
export const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}