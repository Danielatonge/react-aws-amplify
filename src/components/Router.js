import { BrowserRouter,Route,Switch} from "react-router-dom";
import {Dashboard } from './Dashboard'
import {Navigation} from './Navigation'
import {RegisterData} from './Register'
import {Integration} from './Integration'

export const Router = props => {

  return (
    <BrowserRouter>
      <Navigation />
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/register' component={RegisterData} />
        <Route exact path='/integration' component={Integration} />
      </Switch>
    </BrowserRouter>
  )
}