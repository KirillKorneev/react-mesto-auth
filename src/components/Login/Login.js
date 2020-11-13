import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Auth from '../../utils/auth.js'
import { setToken } from '../../utils/token.js';

function Login({handleLogin}) {

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const [message, setMessage] = useState('');
    const history = useHistory();

    function handleChange(e) {
        const {name, value} = e.target;
        setData((prevData) =>( {
            ...prevData,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const { username, password } = data;

        if (!username || !password){
            return;
        }

        Auth.authorize(username, password)
        .then((data) => {
            if (!data){
                setMessage('Что-то пошло не так!')
            }

            if (data.jwt) {
                setToken(data.jwt);
                setData({ username: '', password: ''});
                setMessage('');
                handleLogin(data.user);
                history.push('/ducks');
            }
        })
        .catch(err => console.log(err));

    }

    return (
        <main className="content">
            <section className="auth">
                <form noValidate onSubmit={handleSubmit} name="formAuth" className="authform" action="#" method="post">
                    <h2 className="authform__title">Вход</h2>
                    <input onChange={handleChange} value={data.email} id="email-input" name="inputEmail" required className="authform__input authform__input_el_email" type="text" minLength="2" maxLength="200" placeholder="Email"/>
                    <input onChange={handleChange} value={data.password} id="pass-input" name="inputPass" required className="authform__input authform__input_el_pass" type="text" minLength="2" maxLength="200" placeholder="Пароль"/>
                    <button name="buttonAuth" className="authform__button">Войти</button>
                </form>
                <p className="auth__login" >
                </p>
            </section>
        </main>
    );
}

export {Login};