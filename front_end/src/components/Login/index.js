import React, { useState } from "react";
import Moment from 'moment'
import { login } from "../../services/auth"
import { useHistory } from 'react-router-dom'
import api from '../../services/api.js'
import { isAuthenticated } from '../../services/auth'

import './styles.css'

const Login = () => {
    // email: 'estela.nunes@agaxtur.com.br',
    // senha: 'EstAgaxNunes',
    // expire_date: '2020-08-12 00:00:00'
    const history = useHistory()

    const [email, setEmail]            = useState('')
    const [senha, setSenha]            = useState('')
    const [expire_date, setExpireDate] = useState('') 
    const [error, setError]            = useState('')
    const [timeOut, setTimeOut]        = useState(0)

    const onAuth = () => {
        if (isAuthenticated()) {
            history.push('/')
        }
    }
    
    const onErros = () => {

        setTimeOut(setTimeout( () => { 
            setError('')
        }, 4000))

        clearTimeout(timeOut)
    } 
    
    const onLogin = (e) => {

        setError('')

        e.preventDefault()
        
        setExpireDate(Moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))

        api.post('login', { email, senha, expire_date })
        
        .then( response => { 
            login(response.data)  
            history.push('/') 
        })
        .catch( (error) =>{
            setError(error.response && error.response.data.msg)
            onErros()
        })        
    }
    onAuth()
    return (
        <div className="backgrounImage">
            <div className="container d-flex justify-content-center align-items-center h-100" >
                <form id="login-form" onSubmit={onLogin}>
                    <div className="card" >
                        <div className="card-body">
                            <h2 className="card-title text-center">W3inova</h2>
                            { error && 
                                <div id="error" className="alert alert-danger">
                                    {error}
                                </div>
                            }
                            <div className="form-group">
                                <label htmlFor="email" className="text-uppercase ">Email</label>
                                <input className="form-control mb-4" type="email" name="email" label="Email" onChange={ e => setEmail(e.target.value) }/>
                            </div>
                            
                            <div className="form-group">    
                                <label htmlFor="senha" className="text-uppercase">Senha</label>
                                <input className="form-control mb-4" type="password" name="senha" label="Senha" onChange={ e => setSenha(e.target.value) } />
                                <button className="btn btn-success btn-block" type="submit" >Entrar</button>
                            </div>
                        </div>
                    </div>                
                
                </form>
            </div>
        </div>
    )
}


export default Login
