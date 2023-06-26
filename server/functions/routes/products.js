const router = require('express').Router();
const admin = require('firebase-admin');

const db = admin.firestore();

db.settings({ignoreUndefinedProperties:true});

const stripe = require('stripe')(process.env.STRIPE_KEY);
const express = require('express');


router.post('/create',async(req,res)=>{
    try{
        const id = Date.now();
        const data = {
            product_id: id,
            product_name: req.body.product_name,
            product_category: req.body.product_category,
            product_price: req.body.product_price,
            imageURL:req.body.imageURL,
          };

          const response = await db.collection('products').doc(`/${id}/`).set(data);
          console.log(response);
          return res.status(200).send({success:true, data:response});

    }catch(err){
        return res.send({success:false, msg:`Error : ${err}`});
    }
})

//GET ALL THE PRODUCTS

router.get('/all',async(req,res)=>{
    (async()=>{
        try {
            let query = db.collection("products");
            let response = []
            await query.get().then((querySnap)=>{
                let docs = querySnap.docs;
                docs.map(doc=>{
                    response.push({...doc.data()})
                })
                return response;
            });
            return res.status(200).send({success:true, data:response});
        } catch (error) {
            return res.send({success:false, msg:`Error : ${error}`});
        }
    })();

});

/// DELETE A PRODUCT

router.delete('/delete/:product_id', async(req,res)=>{
    const productID = req.params.product_id;
    try {
        await db.collection("products").doc(`/${productID}/`).delete().then((result)=>{
            return res.status(200).send({success:true, data:result});
        });
    } catch (error) {
        return res.send({success:false, msg:`Error : ${error}`});
    }
})

// CREATING A CART

router.post("/addToCart/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    const productId = req.body.product_id;
  
    try {
      const doc = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${productId}/`)
        .get();
  
      if (doc.data()) {
        const quantity = doc.data().quantity + 1;
        const updatedItem = await db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items")
          .doc(`/${productId}/`)
          .update({ quantity });
        return res.status(200).send({ success: true, data: updatedItem });
      } else {
        const data = {
          product_id: productId,
          product_name: req.body.product_name,
          product_category: req.body.product_category,
          product_price: req.body.product_price,
          imageURL: req.body.imageURL,
          quantity: 1,
        };
        const addItems = await db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items")
          .doc(`/${productId}/`)
          .set(data);
        return res.status(200).send({ success: true, data: addItems });
      }
    } catch (err) {
      return res.send({ success: false, msg: `Error :${err}` });
    }
  });

  //UPDATE CART QUANTITY

  router.post('/updateCart/:user_id', async (req, res) => {
    const userID = req.params.user_id;
    const product_id = req.query.product_id;
    const type = req.query.type;

    try {
      //getting product
      const doc = await db
      .collection('cartItems')
      .doc(`/${userID}/`)
      .collection('items')
      .doc(`/${product_id}/`)
      .get();

      if(doc.data()){
        if(type==='increment'){
          const quantity = doc.data().quantity + 1;
          const updatedItem = await db
            .collection("cartItems")
            .doc(`/${userID}/`)
            .collection("items")
            .doc(`/${product_id}/`)
            .update({ quantity });
          return res.status(200).send({ success: true, data: updatedItem });
        } 
        else if(type==='removeItem'){
          await db
          .collection("cartItems")
          .doc(`/${userID}/`)
          .collection("items")
          .doc(`/${product_id}/`)
          .delete()
          .then((result)=>{
            return res.status(200).send({ success: true, data: result });
          });
        
        }
        else{
          if(doc.data().quantity===1){
            await db
            .collection("cartItems")
            .doc(`/${userID}/`)
            .collection("items")
            .doc(`/${product_id}/`)
            .delete()
            .then((result)=>{
              return res.status(200).send({ success: true, data: result });
            });
          
          }else{
            const quantity = doc.data().quantity - 1;
            const updatedItem = await db
            .collection("cartItems")
            .doc(`/${userID}/`)
            .collection("items")
            .doc(`/${product_id}/`)
            .update({ quantity });
          return res.status(200).send({ success: true, data: updatedItem });
          }

        }
       
      }

    } catch (error) {
      return res.send({ success: false, msg: `Error :${err}` });
    }
  })

// GET ALL CART ITEMS FOR SPECIFIC USER

router.get("/getCartItems/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    (async () => {
      try {
        let query = db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items");
        let response = [];
  
        await query.get().then((querySnap) => {
          let docs = querySnap.docs;
  
          docs.map((doc) => {
            response.push({ ...doc.data()});
          });
          return response;
        });
        return res.status(200).send({ success: true, data: response });
      } catch (er) {
        return res.send({ success: false, msg: `Error :${er}` });
      }
    })();
  });



  router.post('/create-checkout-session', async (req, res) => {

    //creating own customer
    const customer = await stripe.customers.create({
      metadata:{
        user_id: req.body.data.user.user_id,
        cart: JSON.stringify(req.body.data.cart),
        total: req.body.data.total,

      }
    });
    const line_items = req.body.data.cart.map((item)=>{
      return{
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.product_name,
            images: [item.imageURL],
            metadata:{
              id:item.product_id
            }
          },
          unit_amount: item.product_price * 100,
        },
        quantity: item.quantity,
      }
    }) 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA','JP'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'cad',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      phone_number_collection:{
        enabled: true,
      },
      line_items,
      customer: customer.id,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });
  
    res.send({ url: session.url });
  });




  /// STRIPE WEB HOOK
  let endpointSecret;
 // const endpointSecret = process.env.WEBHOOK_SECRET;
  router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
  
    let eventType;
    let data;

    
    if(endpointSecret){
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    }else{
      data = req.body.data.object;
      eventType = req.body.type;
    }
    
    if(eventType === 'checkout.session.completed'){
      stripe.customers.retrieve(data.customer).then(customer=>{
        createOrder(customer,data,res);

      });

    }
    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  });

  
  /// CREATE ORDER

const createOrder = async(customer, intent, res)=>{
  try {
    const orderID = Date.now();
    const data = {
      intentId: intent.id,
      orderId: orderID,
      amount: intent.amount_total,
      created:intent.created,
      payment_method_types: intent.payment_method_types,
      status: intent.payment_status,
      customer: intent.customer_details,
      shipping_details: intent.shipping_details,
      userId: customer.metadata.user_id,
      items: JSON.parse(customer.metadata.cart),
      total: customer.metadata.total,
      sts: 'preparing',
    }
    await db.collection('orders').doc(`/${orderID}/`).set(data);
    deleteCart(customer.metadata.user_id, JSON.parse(customer.metadata.cart));

    return res.status(200).send({success:true});
    
  } catch (error) {
    console.log(error); 
  }
}


// DELETE CART AFTER

const deleteCart = async(user_id, items)=>{
  console.log(user_id);
  console.log('********************************');
  items.map(async(data)=>{
    console.log('----------------------- INSIDE -----------------------', user_id, data.product_id);
    await db
    .collection('cartItems')
    .doc(`/${user_id}/`)
    .collection('items')
    .doc(`/${data.product_id}/`)
    .delete()
    .then(()=> console.log("------------------------------ SUCCESS ---------------------"));
  })
}


// ORDERS TAB

router.get('/orders',async(req,res)=>{
  (async()=>{
      try {
          let query = db.collection("orders");
          let response = []
          await query.get().then((querySnap)=>{
              let docs = querySnap.docs;
              docs.map(doc=>{
                  response.push({...doc.data()})
              })
              return response;
          });
          return res.status(200).send({success:true, data:response});
      } catch (error) {
          return res.send({success:false, msg:`Error : ${error}`});
      }
  })();

});

// UPDATE THE ORDER STATE FROM ORDERS DASHBOARD

router.post('/updateOrder/:order_id', async (req,res)=>{
  const order_id = req.params.order_id;
  const sts = req.query.sts;
  try {
    const updatedStatus = await db
    .collection('orders')
    .doc(`/${order_id}/`)
    .update({sts})
    return res.status(200)({success:true, data:updatedStatus})
  } catch (error) {
    return res.send({success:false, msg:`Error : ${error}`});
  }
})

module.exports = router;