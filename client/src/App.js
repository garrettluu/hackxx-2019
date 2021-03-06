//React import
import React, { Component } from 'react';

//Routing
import {Route, NavLink, BrowserRouter} from "react-router-dom";
import Home from './Home';
import Rides from './Rides';
import Drive from './Drive';
import Signup from './Signup';

//CSS stuff
import logo from './images/sports-car.svg';
import './stylesheets/App.css';

//Parallax scrolling
import { ParallaxProvider } from 'react-scroll-parallax';

class App extends Component {
    render() {
        return (
            <ParallaxProvider>
                <div className="App">
                    <BrowserRouter>
                        <div id="header">

                            {/* Renders Navigation bar */}
                            <div id="title-bar" className="nav-bar">
                                <div className="nav-group">
                                    <NavLink id="company" className="nav-link" to="/"> Carpool </NavLink>
                                    <NavLink id="logo-link" to="/">
                                        <img src={logo} height="60px" alt="logo">
                                        </img>
                                    </NavLink>
                                    <NavLink id="rides-link" className="nav-link" to="/rides"> Rides </NavLink>
                                    <NavLink id="drive-link" className="nav-link" to="/drive"> Drive </NavLink>
                                </div>
                                <div className="nav-group">
                                    <NavLink id="signup-link" className="nav-link" to="/signup"> Sign Up </NavLink>
                                    <NavLink id="login-link" className="nav-link" to="/login"> Login </NavLink>
                                </div>
                            </div>
                        </div>

                        {/* Specifies which page to navigate to with each path */}
                        <div className="content">
                            <Route exact path="/" component={Home}/>
                            <Route exact path="/rides" component={Rides}/>
                            <Route exact path="/drive" component={Drive}/>
                            <Route exact path="/signup" component={Signup}/>
                        </div>
                    </BrowserRouter>
                </div>
            </ParallaxProvider>
        );
    }
}

export default App;
