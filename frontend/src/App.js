import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Create from './components/Create';
import MyPlanner from './components/MyPlanner';
import Suggest from './components/Suggest';
import Map from './components/Map';
import Kakao from './components/Kakao';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/Login" element={<Login />} />
      <Route path='/Register' element={<Register />}/>
      <Route path='/Create' element={<Create />}/>
      <Route path='/MyPlanner' element={<MyPlanner />}/>
      <Route path='/Suggest' element={<Suggest />}/>
      <Route path='/Map' element={<Map />}/>
      <Route path='/Kakao' element={<Kakao />}/>
      </Routes>
    </Router>
  );
}

export default App;
