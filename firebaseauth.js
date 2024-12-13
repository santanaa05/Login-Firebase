// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDmGCPgbqmkiBEikCbEzmWXnGUQYmPbtwY",
    authDomain: "loginpdw2.firebaseapp.com",
    projectId: "loginpdw2",
    storageBucket: "loginpdw2.firebasestorage.app",
    messagingSenderId: "731767179592",
    appId: "1:731767179592:web:c4f4791dce0939e1954b7d"
  };
// Começar a iniciar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(); // Configurar serviço de autenticação
const db = getFirestore(); // Aqui irá conectar ao Firestore

//Exibir mensagens temporárias na interface para as pessoas
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000); // A mensagem vai fica apenas em 5 segundos, depois disso vai sair
}

// Lógica de cadastro de novos usuários que vai querer entrar
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault(); // Previnir o comportamento padrão do botão

    // Aqui obterá os dados do formulário de cadastro da pessoa
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth(); // Configura o serviço de autenticação
    const db = getFirestore(); // Conecta ao Firestore

    // Cria uma conta com e-mail e senha
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user; // Usuário autenticado
        const userData = { email, firstName, lastName }; // Dados do usuário para salvar

        showMessage('Conta criada com sucesso', 'signUpMessage'); // Exibe mensagem de sucesso

        // Salva os dados do usuário no Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = 'index.html'; // Redireciona para a página de login após cadastro
        })
        .catch((error) => {
            console.error("Error writing document", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
            showMessage('Endereço de email já existe', 'signUpMessage');
        } else {
            showMessage('Não é possível criar usuário', 'signUpMessage');
        }
    });
});

// Lógica de login de usuários existentes
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do botão

    // Captura os dados do formulário de login
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth(); // Configura o serviço de autenticação

    // Realiza o login com e-mail e senha
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Usuário logado com sucesso', 'signInMessage'); // Exibe mensagem de sucesso
        const user = userCredential.user;

        // Salva o ID do usuário no localStorage
        localStorage.setItem('loggedInUserId', user.uid);

        window.location.href = 'homepage.html'; // Redireciona para a página inicial
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            showMessage('Email ou Senha incorreta', 'signInMessage');
        } else {
            showMessage('Essa conta não existe', 'signInMessage');
        }
    });
});

// O seu Login com Google
const provider = new GoogleAuthProvider();

const botaoGoogle = document.getElementById("loginGoogle");
botaoGoogle.addEventListener("click", function() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
        
        // Aqui irá ocoorer a Armazenagem de dados do usuario logado no localstorage

            localStorage.setItem('nomeUsuarioGoogle', user.displayName);
            localStorage.setItem('emailUsuarioGoogle', user.email);
            localStorage.setItem('loggedInUserIdGoogle', user.uid);

        // Ajudar o usuario ir para a pagina de login

            })
            .then(() => {
                window.location.href = 'homepage.html';
            })

        // Coloca um erro nos registros do console, se não acontecer de salvar a senha do usuario

            .catch((error) => {
                console.error("Ocorreu um erro ao salvar os dados do usuario", error);
            });

        });

// Aqui ira ocorrer a redefinição de senha 

const RecuperarSenha = document.getElementById("SubmitRecoverPassword")
RecuperarSenha.addEventListener("click", function () {
    const emailRecuperação = document.getElementById("recoverEmail");
    const email = emailRecuperação.value;

    sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log('Email enviado');
    })
    .catch((error) => {
        console.log('Email NÃO enviado');
    });
});