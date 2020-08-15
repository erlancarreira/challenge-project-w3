import React, { useEffect, useState } from "react";
import Moment from 'moment'
import api from '../../services/api.js'
import { getUser, logout } from "../../services/auth"

const Panel = () => {
    // email: 'estela.nunes@agaxtur.com.br',
    // senha: 'EstAgaxNunes',
    // expire_date: '2020-08-12 00:00:00'
    //const history = useHistory()
    const [ leads, setLeads ] = useState([])
    const { email, nome, date_access } = JSON.parse(getUser())

    const onRead = () => {
    
        api.get('leads')
        
        .then( (response) => {        
            
            setLeads(response.data || [])
            
        })
        .catch( (error) =>{
            console.log(error)
        })        
    }
    
    useEffect( _ => {
        onRead()
    }, [])
    
    return (
        <>  
            <div className="bg-dark fixed-top">
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-dark ">
                        <a className="navbar-brand" href="/">Painel</a>  

                        <button  onClick={logout} className="btn btn-outline-success ml-auto">SAIR</button>   
                    </nav>
                </div>
            </div>

            <div className="container py-5 my-5" >
                
                <div className="form-row">
                    <div className="form-group mx-auto text-center w-100">
                        <div className="text-dark ">
                            <p className="text-capitalize">{ nome  }</p> 
                            <p>{ email } </p> 
                            <p>{ date_access && Moment(new Date(date_access)).format('DD/MM/YYYY HH:mm:ss') }</p>
                            
                        </div>
                    </div>
                    { 
                        leads.map( (lead, i) => {
                           
                            return (
                                <React.Fragment key={i}>
                                    
                                    <div className="form-group col-md-4" >
                                        <label htmlFor="id">Id</label>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            id="id" 
                                            value={lead.id}
                                            readOnly={true}
                                        />
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label htmlFor="id_origem">Id Origem</label>
                                        <input readOnly={true} className="form-control" type="text" id="id_origem" value={lead.id_origem}/>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label htmlFor="dataentrada">Data entrada</label>
                                        <input readOnly={true} className="form-control" type="date" id="dataentrada" value={lead.dataentrada}/>
                                    </div>
                                    
                                    <div className="form-group col-md-4">
                                        <label htmlFor="estagio">Estagio</label>
                                        <input readOnly={true} className="form-control" type="text" id="estagio" value={lead.estagio}/>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label htmlFor="dataproxatividade">Data Proxima Atividade</label>
                                        <input className="form-control" type="date" id="dataproxatividade"/>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label htmlFor="dataultatividade">Data Ult. Atividade</label>
                                        <input className="form-control" type="date" id="dataultatividade"/>
                                    </div>
                                    
                                
                                    <div className="form-group col-md-4">
                                        <label htmlFor="id_usuario">Id usuário</label>
                                        <input className="form-control" type="text" id="id_usuario"/>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label htmlFor="email">Email</label>
                                        <input readOnly={true} className="form-control" type="email" id="email" value={lead.email}/>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label htmlFor="qtadultos">Qt Adultos</label>
                                        <input className="form-control" type="text" id="qtadultos"/>
                                    </div>

                                
                                    <div className="form-group col-md-4">
                                        <label htmlFor="qtcriancas">Qt Criancas</label>
                                        <input className="form-control" type="text" id="qtcriancas"/>
                                    </div>

                                    <div className="form-group  col-md-4">
                                        <label htmlFor="nome">Nome</label>
                                        <input readOnly={true} className="form-control" type="text" id="nome" value={lead.nome}/>
                                    </div>

                                    <div className="form-group  col-md-4">
                                        <label htmlFor="empresa">Empresa</label>
                                        <input className="form-control" type="text" id="empresa"/>
                                    </div>
                                    

                                    <div className="form-group  col-md-4">
                                        <label htmlFor="telefone">Telefone</label>
                                        <input className="form-control" type="text" id="telefone"/>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <label htmlFor="celular">Celular</label>
                                        <input className="form-control" type="text" id="celular"/>
                                    </div>

                                    <div className="form-group  col-md-4">
                                        <label htmlFor="tipohotel">Tipo Hotel</label>
                                        <input className="form-control" type="text" id="tipohotel"/>
                                    </div>

                                
                                    <div className="form-group  col-md-4">
                                        <label htmlFor="destino">Destino</label>
                                        <input className="form-control" type="text" id="destino"/>
                                    </div>
                                    <div className="form-group  col-md-4">
                                        <label htmlFor="cidade">Cidade</label>
                                        <input className="form-control" type="text" id="cidade"/>
                                    </div>


                                    <div className="form-group  col-md-4">
                                        <label htmlFor="hotelpreferencia">Hotel Preferencia</label>
                                        <input className="form-control" type="text" id="hotelpreferencia"/>
                                    </div> 

                                    
                                    <div className="form-group  col-md-4">
                                        <label htmlFor="dataviagemprevista">Data Viagem Prevista</label>
                                        <input className="form-control" type="text" id="dataviagemprevista"/>
                                    </div>


                                    <div className="form-group  col-md-4">
                                        <label htmlFor="qtdnoites">Qt Noites</label>
                                        <input className="form-control" type="text" id="qtdnoites"/>
                                    </div>
                                
                            </React.Fragment>
                        )
                    })
                }
                </div>               
            </div>
        </>
    )
}


export default Panel
