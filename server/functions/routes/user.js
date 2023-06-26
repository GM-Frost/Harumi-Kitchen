const router = require('express').Router();
const admin = require('firebase-admin');
let data = [];
router.get('/',(req,res)=>{
    return res.send('Inside the user router')
});

router.get('/jwtVerification',async(req,res)=>{
    if(!req.headers.authorization){
        return res.status(500).send({msg:'Token not Found'});
    }
    const token = req.headers.authorization.split(" ")[1];
    try{
        const decodedValue = await admin.auth().verifyIdToken(token);
        if(!decodedValue){
            return res.status(500).json({success:false, msg:'Unauthorized Access'});
        }
        return res.status(200).json({success:true, data:decodedValue});
    }catch(err){
        return res.send({success:false, msg:`Error in extracting the token: ${err}`})
    }
});


//LISTING ALL USERS
const listAllUsers = async (nextpagetoken) => {
    admin
      .auth()
      .listUsers(1000, nextpagetoken)
      .then((listuserresult) => {
        listuserresult.users.forEach((rec) => {
          data.push(rec.toJSON());
        });
        if (listuserresult.pageToken) {
            listAllUsers(listuserresult.pageToken);
        }
      })
      .catch((er) => console.log(er));
  };

// Start listing users from the beginning, 1000 at a time.
listAllUsers();

//manually calling list user
router.get('/all',async(req,res)=>{
    listAllUsers();
    try {
        return res.status(200).send({ success: true, data: data, dataCount: data.length });
    } catch (error) {
        return res.send({success:false, msg:`Error Listing the Users: ${err}`})
    }
});


module.exports = router;