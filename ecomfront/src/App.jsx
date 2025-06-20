import React from 'react'
import './App.css'
import Products from './components/products/Products'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home/Home'
import Navbar from './components/shared/Navbar.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import { Toaster } from 'react-hot-toast'
import Cart from './components/cart/Cart.jsx'
import Login from './components/auth/Login.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Register from './components/auth/Register.jsx'
import Checkout from './components/checkout/Checkout.jsx'
import Profile from './components/profile/Profile.jsx'
import ProfileOrders from './components/profile/ProfileOrders.jsx'
import AddProduct from './components/products/AddProduct.jsx'
function App() {

  return (
    <React.Fragment>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/products' element = {<Products/>}/>
        <Route path='/about' element = {<About/>}/>
        <Route path='/contact' element = {<Contact/>}/>
        <Route path='/cart' element = {<Cart/>}/>
        <Route path='/' element={<PrivateRoute />}>
          <Route path='/checkout' element = {<Checkout/>}/>
          <Route path='/profile' element = {<Profile/>}/>
          <Route path='/profile/addProduct' element = {<AddProduct/>}/>
          <Route path='/profile/orders' element = {<ProfileOrders/>}/>
          <Route path='/profile/order' element = {<ProfileOrders/>}/>
        </Route>
        <Route path='/' element={<PrivateRoute publicPage/>}>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Route>
      </Routes>
    </Router>
    <Toaster position='bottom-center' />
    </React.Fragment>
  )
}

export default App
