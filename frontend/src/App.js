import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Create from './components/Create';
import Edit from './components/Edit';
import MyPlanner from './components/MyPlanner';
import Suggest from './components/Suggest';
import Map from './components/Map';
import Kakao from './components/Kakao';
import Share from './components/Share';
import Bookmarks from './components/Bookmarks';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Login" element={<Login />} />
          <Route path='/Register' element={<Register />}/>
          <Route path='/Create' element={<Create />}/>
          <Route path='/Edit' element={<Edit />}/>
          <Route path='/MyPlanner' element={<MyPlanner />}/>
          <Route path='/Suggest' element={<Suggest />}/>
          <Route path='/Map' element={<Map />}/>
          <Route path='/Kakao' element={<Kakao />}/>
          <Route path='/Share' element={<Share />}/>
          <Route path='/Bookmarks' element={<Bookmarks />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
