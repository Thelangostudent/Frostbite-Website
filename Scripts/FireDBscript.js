// JavaScript source code



    import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
    import {getDatabase, ref, set, onValue} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
    import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js'

    const firebaseConfig = {
        apiKey: "AIzaSyDdmHsJu_s8rE1dkcB3oLyyTLJQOI1ZVAg",
    authDomain: "frostbite-backend.firebaseapp.com",
    projectId: "frostbite-backend",
    storageBucket: "frostbite-backend.appspot.com",
    messagingSenderId: "388567472682",
    appId: "1:388567472682:web:893bbf2a74fe78bc4e8153",
    measurementId: "G-CMP5CEZ81E",
    databaseURL: "https://frostbite-backend-default-rtdb.europe-west1.firebasedatabase.app"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();

    document.body.onload = function() {getInfoFromServer()};
    function getInfoFromServer(){

        getTitleText();
        getUserStatus();

    }

    //Gets the frostbite text from the server on load
    function getTitleText(){
        const userStatus = ref(db, 'titleText/titleTextContent');
        onValue(userStatus, (snapshot) => {
        document.getElementById("aboutText").innerHTML = snapshot.val();
        });
    }

    function getUserStatus(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
        console.log("Update: You are logged in!");
    document.getElementById("adminContainer").style.display = "block";

            } else {
        console.log("Update: You are not logged in!");
    document.getElementById("adminContainer").style.display = "none";
            }
        });
    }










    document.getElementById("changeBackgroundImage").onclick = function(){changeBackgroundImage();}
    function changeBackgroundImage(){

        const newImage = "newImageSource";
    document.getElementById("frostbiteBackground").src = newImage;
        //TODO: change image function
    }












    document.getElementById("changeText").onclick = function(){changeText();}
    function changeText() {

        let newText = prompt("Please paste the new text:");
    if (newText == null || newText === "") {
        //closed
    } else {
        set(ref(db, 'titleText'), {
            titleTextContent: newText,
        });
        }
    }

    document.getElementById("logOutButton").onclick = function(){logOut();}
    function logOut(){
        console.log("Logout activated");

    const auth = getAuth();
        signOut(auth).then(() => {
        console.log("User is logged out")
    }).catch((error) => {
        console.log("Logout failed")
            console.log(error);
        });
    }

    document.getElementById("adminLogin").onclick = function(){login();}
    function login() {
        let email = prompt("Please enter your email address:");
    if (email == null || email === "") {
        //closed
    } else {
        let password = prompt("Please enter your password:");
    if (password == null || password === "") {
        //closed
    } else {
        loginDatabase(email, password);
            }
        }
    }

    function loginDatabase(email, password){
        const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
            .then((userInfo) => {
        alert("Successfully logged in");
    document.getElementById("adminContainer").style.display = "block";
            })
            .catch((error) => {
                const errorMessage = error.message;
    alert(errorMessage);
    document.getElementById("adminContainer").style.display = "none";
            });
    }

    /*
        function checkIfLoggedIn(){
            console.log("Checking for users")
    
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("Update: You are logged in!");
                } else {
                    console.log("Update: You are not logged in!");
                }
            });
        }*/

    //const email = "admin@outlook.com"
    //const password = "123Password123";

    /*    function createUser() {
            console.log("User creation activated!");

            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
                .then((userInfo) => {
                    console.log("User created!")
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    console.log(errorMessage);
                });
        }*/



