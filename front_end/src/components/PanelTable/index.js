import React, { useEffect, useState } from "react";
import Moment from 'moment'
import api from '../../services/api.js'
import { getUser, logout } from "../../services/auth"

const PanelTable = () => {
    // email: 'estela.nunes@agaxtur.com.br',
    // senha: 'EstAgaxNunes',
    // expire_date: '2020-08-12 00:00:00'
    //const history = useHistory()
    const [ leads, setLeads ] = useState([])
    const { email, nome, date_access } = JSON.parse(getUser())

    const onRead = () => {
    
        api.get('leads')
        
        .then( (response) => {        
            
            setLeads(response.data)
            
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
                        <a className="navbar-brand" href="/leads">Painel</a>   

                        <button  onClick={logout} className="btn btn-outline-success  ml-auto">SAIR</button> 
                    </nav>
                    
                </div>
            </div>

            <div className="container py-5 my-5" >
                
                <div className="form-row">
                    <div className="form-group mx-auto text-center w-100">
                        <div className="text-dark ">
                            <p className="text-capitalize">{ nome }</p> 
                            <p> {email}</p> 
                            <p>{ date_access && Moment(new Date(date_access)).format('DD/MM/YYYY HH:mm:ss') }</p>
                            
                        </div>
                    </div>
                    
                    { 
                        leads.map( (lead, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <div className="table-responsive">
                                        <table className="table table-hover ">
                                            
                                            <thead>
                                               
                                                <tr>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Data Entrada</th>
                                                    <th scope="col">Estagio</th>
                                                    <th scope="col">Nome</th>
                                                    <th scope="col">Destino</th>
                                                    <th scope="col">Data Viagem</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">{lead.id}</th>
                                                    <td>{lead.dataentrada && Moment(new Date(lead.dataentrada)).format('DD/MM/YYYY')}</td>
                                                    <td>{lead.estagio}</td>
                                                    <td>{lead.nome}</td>
                                                    <td>{lead.destino}</td>
                                                    <td>{lead.dataultviagem}</td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>
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


export default PanelTable
