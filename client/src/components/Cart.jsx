import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion';
import { buttonClick, slideIn, staggerFadeInOut } from '../animations';
import { FcClearFilters, HiCurrencyDollar, HiMinus, HiPlus, HiX, MdShoppingCartCheckout } from '../assets/icons'
import { BiChevronsRight } from '../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCartOff } from '../context/actions/displayCartAction';
import { baseURL, getAllCartItems, incrementItemQuantity } from '../api';
import { alertInfo, alertNull, alertSuccess, alertWarning } from '../context/actions/alertActions'
import { setCartItems } from '../context/actions/cartAction'
import axios from 'axios';


const Cart = () => {
  const cart = useSelector((state)=>state.cart);
  const user = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);



  useEffect(()=>{
    let sum = 0;
    if(cart){
      cart.map((data)=>{
        sum = sum + data.product_price * data.quantity;
        setTotal(sum);
      })
    }
  },[cart]);

  const handleCheckOut = () => {
    const data = {
      user:user,
      cart: cart,
      total: total,
    }
    if(user === "" || user === null) {
      dispatch(alertWarning('Please login to proceed to checkout'));
      setTimeout(() =>{
        dispatch(alertNull());
      },3000)
    }else{
      axios
      .post(`${baseURL}/api/products/create-checkout-session`,{data})
      .then((res) => {
        if(res.data.url){
          window.location.href = res.data.url;
        }
      }).catch((err) => console.log(err));
    }
   
  };


  return (
    <motion.div
      {...slideIn}
      className='fixed z-50 top-0 right-0 w-300 md:w-508 bg-lightOverlay backdrop-blur-md shadow-md h-screen'
    >
      <div
        className='w-full flex items-center justify-between py-4 pb-12 px-6'
      >
      <motion.i
        {...buttonClick}
        className='cursor-pointer'
        onClick={()=> dispatch(setCartOff())}
      >
        <BiChevronsRight className='text-[50px] text-textColor'/>
      </motion.i>

      <p className='text-2xl text-headingColor font-semibold'>
        Your Cart
      </p>
        <motion.i {...buttonClick} className='cursor-pointer' >
          <FcClearFilters className='text-[30px] text-textColor'/>
        </motion.i>
      </div>

      <div className="flex-1 flex flex-col items-start justify-start rounded-t-3xl h-full py-6  gap-3 relative">
        
            {cart && cart?.length >0 ? 
           ( 
           <>
            <div className="flex flex-col w-full items-start justify-start gap-3 h-[65%] overflow-y-scroll scrollbar-none px-4">
                {cart && cart?.length>0 && cart?.map((item,i)=>(
                  <CartItem key={i} index={i} data={item}/>
                ))}

            </div>
           
            <div className='bg-[#fffefa] rounded-t-[60px] w-full h-[25%] flex flex-col items-center justify-center px-4 py-6 gap-24 shadow-inner'>
                <div className='text-sm text-textColor flex'>
                  <p>*Shortern URL not Working in database, please Checkout only one item</p>
                </div>

                <div className="w-full flex items-center justify-evenly">
                  <p className='text-3xl text-zinc-500 font-semibold"'>Total</p>
                  <p className='text-3xl text-primaryColor font-semibold flex items-center justify-center gap-1'>
                      <HiCurrencyDollar className='text-primaryColor'/>{total}
                  </p>
                </div>
                  
        <motion.div
          {...buttonClick}
          className='bg-primaryColor w-[70%] px-4 py-3 text-xl text-headingColor font-semibold hover:bg-[#c25c5c] hover:text-white drop-shadow-md rounded-2xl mb-20 cursor-pointer text-center '
                onClick={handleCheckOut}
               
          >
           <span className='flex flex-wrap items-center justify-center gap-5'>Check Out <MdShoppingCartCheckout/> </span>
          </motion.div>

      </div>
            </>
            )
            :
           ( 
            <>
              <h1 className='text-3xl text-primaryColor font-bold'>Empty Cart</h1>
            </>
            )
           }
      </div>
   
    </motion.div>
  )
}

export const CartItem = ({index,data})=>{
  const cart = useSelector((state)=>state.cart)
  const user = useSelector((state)=>state.user)

  const [itemTotal, setItemTotal] = useState(0);

  const dispatch  = useDispatch();

  const decrementCart = (product_id) =>{
    dispatch(alertSuccess('Updated cart item'));
    incrementItemQuantity(user?.user_id, product_id, "decrement").then((data)=>{
      getAllCartItems(user?.user_id).then((items)=>{
        dispatch(setCartItems(items))

        dispatch(alertNull())
      })
    })
  }
  const incrementCart = (product_id)=>{
    dispatch(alertSuccess('Updated cart item'));
    incrementItemQuantity(user?.user_id, product_id, "increment").then((data)=>{
      getAllCartItems(user?.user_id).then((items)=>{
        dispatch(setCartItems(items))
        dispatch(alertNull())
      })
    })
  }

  const removeItem = (product_id)=>{
    dispatch(alertInfo('Item Removed'));
    incrementItemQuantity(user?.user_id, product_id, "removeItem").then((data)=>{
      getAllCartItems(user?.user_id).then((items)=>{
        dispatch(setCartItems(items))
        dispatch(alertNull())
      })
    })
  }

  useEffect(()=>{
    setItemTotal(data.product_price * data.quantity);
  },[itemTotal, cart]);

  return(
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      className='w-full flex items-center justify-start bg-[#fffefa] rounded-md drop-shadow-md px-4 gap-4'
    >
      
     <img
      src={data?.imageURL}
      className='w-24 min-w-[94px] h-24 object-contain'
      alt=''
     />
     <div className="flex items-center justify-start gap-1 w-full">
      <p className='text-lg text-textHeading font-semibold'>
        {data?.product_name}
        <span className='text-sm block capitalize text-textColor'>
          {data?.product_category}
        </span>
      </p>
      <p className='text-md flex items-center justify-center gap-1 font-semibold text-green-600  ml-auto'>
        <HiCurrencyDollar/>{itemTotal}
      </p>
      </div>
      <div className='ml-auto flex items-center justify-center gap-3'>
       
          <motion.div 
            {...buttonClick}
            onClick={()=>decrementCart(data?.product_id)}
            className='w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md  hover:bg-zinc-400 bg-zinc-200 cursor-pointer'>
            <p className='text-xl font-semibold text-zinc-800'><HiMinus/></p>
          </motion.div>
          <p className='text-lg text-primaryColor font-semibold'>{data?.quantity}</p>

        <motion.div 
        {...buttonClick}
        onClick={()=>incrementCart(data?.product_id)}
        className='w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md  hover:bg-zinc-400 bg-zinc-200 cursor-pointer'>
          <p className='text-xl font-semibold text-zinc-800 '><HiPlus/></p>
        </motion.div>
      </div>
      
     
        <motion.div 
          onClick={()=>removeItem(data?.product_id)}
          {...buttonClick} 
          className="absolute top-1 right-1 hover:text-primaryColor">
          <HiX/>
        </motion.div>
     
    </motion.div>
  )
}
 
export default Cart