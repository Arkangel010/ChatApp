import logo from './logo.svg';
import './App.css';
import './output.css'
import Form from './modules/Form';
import Dashboard from './modules/Dashboard';
import { Routes, Route, Navigate} from 'react-router-dom'
import { Children } from 'react';

const ProtectedRoute = ({children}) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null; 

  if(!isLoggedIn){
    return <Navigate to={'/users/sign_in'}/>
  }
  else if(isLoggedIn && ['/users/sign_in', '/users/sign_up'].includes(window.location.pathname)){
    return <Navigate to={'/'}/>
  }

  return children
}

const AuthRoute = ({children}) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null; 

  if(isLoggedIn){
    return <Navigate to={'/'}/>
  }

  return children
}
function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }/>
      <Route path='/users/sign_in' element={
        <AuthRoute>
          <Form isSignInPage={true}/>
        </AuthRoute>
      }/>
      <Route path='/users/sign_up' element={
        <AuthRoute>
          <Form isSignInPage={false}/>
        </AuthRoute>
      }/>
    </Routes>
    
  );
}

export default App;
