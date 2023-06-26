import React, { useEffect, useState } from 'react';
import { Route, Routes} from 'react-router-dom';
import {Main, Login, Dashboard} from './containers/Index.js';
import { getAuth } from 'firebase/auth';
import { app } from './config/firebase.config.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCartItems, validateUserJWTToken } from './api/index.js';
import { setUserDetails } from './context/actions/userActions.js';
import { motion } from 'framer-motion';
import { fadeInOut } from './animations/index.js';
import MainLoader from './components/MainLoader.jsx';
import Alert from './components/Alert.jsx';
import { setCartItems } from './context/actions/cartAction.js';
import {CheckOutSuccess, UserOrders} from './components';





const App = () => {
  const fireBaseAuth = getAuth(app);
  const [isLoading, setIsLoading] = useState(false);
  const alert = useSelector(state=>state.alert);
  const dispatch = useDispatch();

  useEffect(()=>{
    setIsLoading(true);
    fireBaseAuth.onAuthStateChanged(cred =>{
      if(cred){
        cred.getIdToken().then(token=>{
          validateUserJWTToken(token).then(data=>{
            if(data){
              getAllCartItems(data.user_id).then((items)=>{
                console.log(items);
                dispatch(setCartItems(items));
              })
            }
            dispatch(setUserDetails(data));
          });
        })
      }
      setInterval(()=>{
        setIsLoading(false);
      },3000)
      
    })
  },[])
  
  return (
    <div className='w-screen min-h-screen h-auto flex flex-col items-center justify-center'>
      {isLoading && (
        <motion.div  
          {...fadeInOut}
          className='fixed z-50 inset-0 bg-lightOverlay backdrop-blur-md flex items-center justify-center w-full'  
        >
         
          <MainLoader/>

        </motion.div>
      )}
        <Routes>
            <Route path='/*' element={<Main/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/dashboard/*' element={<Dashboard/>}/>
            <Route path='/checkout-success' element={<CheckOutSuccess/>}/>
            <Route path='/user-orders' element={<UserOrders/>}/>

        </Routes>
        {alert?.type && <Alert type={alert?.type} message={alert?.message}/>}
    </div>
  )
}

export default App