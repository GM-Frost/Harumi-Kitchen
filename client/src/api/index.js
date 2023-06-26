import axios from 'axios';

//getting base URL
export const baseURL = 'http://localhost:5001/harumi-kitchen/us-central1/app';
export const validateUserJWTToken = async(token)=>{
    try{
        const res = await axios.get(`${baseURL}/api/users/jwtVerification`,{
            headers:{Authorization:'Bearer '+token},
        })
        return res.data.data;
    }catch(error){
        return null;
    }
};

// SENDING AND RECEIVING NEW PRODUCT TO BACKEND

//add new product
export const addNewProduct = async(data)=>{
    try {
        const res = await axios.post(`${baseURL}/api/products/create`, {...data})
        return res.data.data;
    } catch (error) {
        return null;
    }
}

//Get ALL products
export const getAllProducts = async()=>{
    try {
        const res = await axios.get(`${baseURL}/api/products/all`)
        return res.data.data;
    } catch (error) {
        return null;
    }
}

//SEND PRODUCT ID TO BACKEND FOR DELETED PRODUCT

export const deleteProduct = async(productID)=>{
    try {
        const res = await axios.delete(`${baseURL}/api/products/delete/${productID}`)
        return res.data.data;
    } catch (error) {
        return null;
    }
}

//GETTING ALL USERS

export const getAllUsers = async ()=>{
    try {
        const res = await axios.get(`${baseURL}/api/users/all`);
        return res.data.data;
    } catch (error) {
        return null;
    }
}


//ADD ITEM TO CART
export const addNewItemToCart = async (user_id, data) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/products/addToCart/${user_id}`,
        { ...data }
      );
      return res.data.data;
    } catch (error) {
      return null;
    }
  };
  

//Get All Cart Items
export const getAllCartItems = async (user_id) => {
    try {
      const res = await axios.get(
        `${baseURL}/api/products/getCartItems/${user_id}`
      );
      return res.data.data;
    } catch (error) {
      return null;
    }
  };

//UPDATE CART INCREMENT & DECREMENT

export const incrementItemQuantity = async (user_id, product_id, type) => {
    console.log(user_id, product_id, type);
    try{
        const res = await axios.post(
            `${baseURL}/api/products/updateCart/${user_id}`
            ,null,
            {params:{product_id: product_id, type: type}}

        );

        return res.data.data;
    }catch(error){
        return null;
    }
}


//Get All ORDERS in DASHBOARD
export const getAllOrders = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/products/orders/`
      );
      return res.data.data;
    } catch (error) {
      return null;
    }
  };

  //UPDATE ORDER STATUS IN DASHBOARD
export const updateOrderStatus = async (order_id, sts) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/products/updateOrder/${order_id}`,null,{params:{sts:sts}}
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
};


