import React, { useEffect, useState } from 'react'
import {LoginBg, Logo} from '../assets'
import {LoginInput} from '../components/index.js'
import {FaEnvelope, FaLock, FcGoogle, FaCheckDouble} from '../assets/icons/index.js'
import { motion } from 'framer-motion'
import { buttonClick, imageScale } from '../animations'

import {useNavigate} from 'react-router-dom';

import {getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {app} from '../config/firebase.config';
import { validateUserJWTToken } from '../api'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from '../context/actions/userActions'
import { alertDanger, alertInfo, alertNull, alertWarning } from '../context/actions/alertActions'

const Login = () => {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const fireBaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //getting user object

  const user = useSelector((state)=>state.user)


  useEffect(()=>{
    if(user){
      navigate('/',{replace: true})
    }
  },[user])

  //LOGIN WITH GOOGLE
  const loginWithGoogle = async () =>{
    await signInWithPopup(fireBaseAuth, provider).then(userCred =>{
      fireBaseAuth.onAuthStateChanged(cred =>{
        if(cred){
          cred.getIdToken().then(token=>{
            validateUserJWTToken(token).then(data=>{
              dispatch(setUserDetails(data));
            });
            navigate('/',{replace:true});
          })
        }
        
      })
    })
  }

  //ACTION

  //REDUCER

  //STORE -> GLOBALIZED STORE

  //DISPATCH


    //Validation Before Form Submit
    const signUpWithEmailPassword= async ()=>{
      if((userEmail==="")||(password==="")||(confirmPassword==="")){
         dispatch(alertInfo('Required Fields Should Not Be Empty'));
      }else{
        if(password===confirmPassword){
          setUserEmail("");
          setConfirmPassword("");
          setPassword("");

          try {
            await createUserWithEmailAndPassword(fireBaseAuth, userEmail, password).then(
              userCred=>{
                  fireBaseAuth.onAuthStateChanged(cred =>{
                    if(cred){
                      cred.getIdToken().then(token=>{
                        validateUserJWTToken(token).then(data=>{
                          dispatch(setUserDetails(data));
                        });
                        navigate('/',{replace:true});
                      })
                    }
                    
                  })
              }
            ).catch(error => {   
              if(error.code ==='auth/email-already-in-use'){
                dispatch(alertDanger('Email Already In Use'));
                setInterval(()=>{
                  dispatch(alertNull());
                },9000)
              }
           })
          } catch (error) {
            dispatch(alertDanger('Something went wrong'));
            setInterval(()=>{
              dispatch(alertNull());
            },9000)
          }
        }else{
          // alert message
          dispatch(alertWarning('Password donot Match!'));
        }
      }
  }

  //SIGN IN WITH EMAIL & PASSWORD

  const signInWithEmailPass = async () =>{
      if(userEmail!=="" && password!=="")
        {
          await signInWithEmailAndPassword(fireBaseAuth, userEmail, password).then((userCred)=>{
            fireBaseAuth.onAuthStateChanged(cred =>{
              if(cred){
                cred.getIdToken().then(token=>{
                  validateUserJWTToken(token).then(data=>{
                    dispatch(setUserDetails(data));
                  });
                  navigate('/',{replace:true});
                })
              }
            })
          }).catch(()=>{
            dispatch(alertDanger('Invalid email or password'));
            setInterval(()=>{
              dispatch(alertNull());
            },9000)
          })



        }else{
          //Alert Message
          dispatch(alertWarning('Required Fields Should Not Be Empty'));
          setInterval(()=>{
            dispatch(alertNull());
          },5000)
        }
      
      
  }
  return (
    <div className='w-screen h-screen relative overflow-hidden flex'>
                        {/** BACKGROUND IMAGES*/}
        <img src={LoginBg} className='w-full h-full object-fit absolute top-0 left-0' alt=''/>

                        {/** CONTENT BOX*/}
        <div className='flex flex-col items-center bg-cardOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-sm p-4 px-4 py-5 gap-2'>
            {/** LOGO SECTION*/}
            <div className="flex max-w-sm items-center justify-center w-full mt-10">
                <motion.img
                  {...imageScale}
                src={Logo} className='object-cover w-40 min-w-sm mb-10' alt=''
                />
            </div>

             {/** Welcome SECTION*/}
             <p className='text-3xl font-semibold text-headingColor'>Welcome !</p>
             <p className='text-xl text-center text-textColor -mt-4'>
              {isSignUp ? 'Sign Up with following':'Login Here'}
             
              </p>
             {/** INPUT SECTION*/}
             <div className='w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4'>
                
                <LoginInput 
                placeholder={"Email Here"} 
                icon={<FaEnvelope className='text-xl text-textColor'/>}
                inputState={userEmail} 
                inputStateFunction={setUserEmail} 
                type='email' 
                isSignUp={isSignUp}/>

                <LoginInput 
                placeholder={"Password Here"} 
                icon={<FaLock className='text-xl text-textColor'/>}
                inputState={password}  
                inputStateFunction={setPassword} 
                type='password' 
                isSignUp={isSignUp}/>

               {isSignUp &&(
                 <LoginInput 
                 placeholder={"Confirm Password"} 
                 icon={<FaCheckDouble className='text-xl text-textColor'/>}
                 inputState={confirmPassword} 
                 inputStateFunction={setConfirmPassword} 
                 type='password' 
                 isSignUp={isSignUp}/>
               )}

               {!isSignUp ? 
                  (<p>Doesn't have an account?&nbsp;
                  <motion.button {...buttonClick} 
                    className='text-red-400 underline cursor-pointer bg-transparent'
                    onClick={()=>setIsSignUp(true)}
                    >Create One Here</motion.button>
                </p> )
                  :
                  (<p>Already have an Account?&nbsp;
                    <motion.button {...buttonClick} 
                    className='text-neutralColor underline cursor-pointer bg-transparent'
                    onClick={()=>setIsSignUp(false)}
                    >Login Now!</motion.button>
                  </p> 
                  )
                }

                   {/** BUTTON SECTION*/}
                   
                  {isSignUp ?
                  <motion.button 
                  {...buttonClick}
                  className='w-full px-4 py-2 rounded-md bg-neutralColor cursor-pointer text-white text-xl capitalize hover:bg-[#11babf]  transition-all duration-150'
                  onClick={signUpWithEmailPassword}
                
                >Sign Up</motion.button>
                :
                <motion.button 
                    {...buttonClick}
                    className='w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500  transition-all duration-150'
                    onClick={signInWithEmailPass}
                  >Sign In</motion.button>
                }
             </div>

             <div className='flex items-center justify-between gap-16'>
                <div className="w-24 h-[1px] rounded-md bg-white"></div>
                <p className='text-white'> OR </p>
                <div className="w-24 h-[1px] rounded-md bg-white"></div>
             </div>

             <motion.div
              {...buttonClick}
              className='flex items-center justify-center px-20 py-2 bg-cardOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4 hover:bg-gray-400'
              onClick={loginWithGoogle}
             >
              <FcGoogle className='text-3xl'/>
              <p className='text-base text-color capitalize'>Sign in with Google</p>
             </motion.div>
        </div>
    </div>
  )
}

export default Login