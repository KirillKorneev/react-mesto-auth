import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Auth from '../../utils/auth.js';

function Register() {

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
        const { email, password } = data;
        Auth.register(email, password)
        .then((res) => {
            if (res.statusCode !== 400) {
                setMessage({
                    message: ''
                }, () => {
                   history.push('/login');
                })
            }
            else {
                setMessage({
                    message: 'Что-то пошло не так!'
                }); 
            }
        })
    }

    return (
        <main className="content">
            <section className="auth">
                <form noValidate onSubmit={handleSubmit} name="formAuth" className="authform" action="#" method="post">
                    <h2 className="authform__title">Регистрация</h2>
                    <input id="email-input" onChange={handleChange} value={data.email} name="inputEmail" required className="authform__input authform__input_el_email" type="text" minLength="2" maxLength="200" placeholder="Email"/>
                    <input id="pass-input" onChange={handleChange} value={data.password} name="inputPass" required className="authform__input authform__input_el_pass" type="text" minLength="2" maxLength="200" placeholder="Пароль"/>
                    <button name="buttonAuth" className="authform__button">Зарегистироваться</button>
                </form>
                <p className="auth__login" >
                <Link to="/login" className="auth__link">Уже зарегистрированы? Войти</Link>
                </p>
            </section>
        </main>
    );
}

export {Register};