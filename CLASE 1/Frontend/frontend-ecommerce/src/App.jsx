import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { CardProduct } from './components/CardProduct.jsx'
import './App.css'
import { BrowserRouter,Route,Routes,Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout.jsx'
import { Home } from './pages/Home.jsx'
import { Contact } from './pages/Contact.jsx'
import { NotFound } from './pages/NotFound.jsx'
import { Productos } from './pages/Products.jsx'
import { DetailProduct } from './pages/DetailProduct.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import { Categorias } from './pages/Categorias.jsx'
import { Carrito } from './pages/Carrito.jsx'
import {CartProvider} from './services/ContextCart.jsx'
import { AdminProductos } from './pages/AdminProductos.jsx'
import { ChatBot } from './pages/ChatBot.jsx'

function App() {

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/Login" replace />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='/contacto' element={<Contact />} />
            <Route path='/productos' element={<Productos />} />
            <Route path='/productos/:id' element={<DetailProduct />} />
            <Route path='/categorias' element={<Categorias />}/>
            <Route path='/adminProductos' element={<AdminProductos />}/>
            <Route path='/chatbot' element={<ChatBot />}/>
            <Route path='/carrito' element={<Carrito />}/>
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App;