import React from 'react'

import { BrowserRouter, Route, Switch, Redirect  } from 'react-router-dom'

import LoginForm from './components/Login'

import { isAuthenticated } from "./services/auth";
import PanelTable from './components/PanelTable';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            )
        }
    />
)

function Routes() {
    
    return (
        
        <BrowserRouter>
            <Switch>
                <Route path="/login"  component={LoginForm} />
                {/* <PrivateRoute path="/" exact component={Panel} />   */}
                <PrivateRoute path="/" exact component={PanelTable} />
                <Route path="*"       component={ _ =>
                    <div className="container"> 
                        <div className="row">
                            <div className="col">
                                <h1 className="text-center my-5">Page not found</h1>
                            </div>
                        </div> 
                    </div>} />
            </Switch>
        </BrowserRouter>
        
    )
}

export default Routes