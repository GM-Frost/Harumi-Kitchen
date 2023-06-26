import React, { useState } from 'react'
import { kitchenCategory } from '../utils/styles'
import {Spinner} from '../components/index'
import { FaCloudUploadAlt, MdDelete } from '../assets/icons';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../config/firebase.config';
import { useDispatch, useSelector } from 'react-redux';

import {alertDanger, alertInfo, alertNull, alertSuccess, alertWarning} from '../context/actions/alertActions';
import { motion } from 'framer-motion';
import { buttonClick} from '../animations';
import { addNewProduct, getAllProducts } from '../api';

import {setAllProducts} from '../context/actions/productActions'

const DBNewItems = () => {
  const [itemName, setItemName] = useState("");
  const [category, setcategory] = useState(null);
  const [price, setPrice] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [progress, setProgress] = useState(null);

  const [imageDownloadUrl, setImageDownloadUrl] = useState(null);

  //Alert Message
  const alert = useSelector(state=>state.alert);
  const dispatch = useDispatch();

  const uploadImage = (e) =>{
    setIsLoading(true);
    const imageFile = e.target.files[0];

    //firebase upload image
    const storageRef = ref(storage, `Images/${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on('state_changed',
    (snapshot)=>{
      setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    },
    (error)=>{
      dispatch(alertDanger(`Error: ${error}`));

      setTimeout(()=>{
        dispatch(alertNull())
      },3000);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setImageDownloadUrl(downloadURL);
        setIsLoading(false);
        setProgress(null);
        dispatch(alertSuccess('Image successfully uploaded to cloud'));
        setTimeout(()=>{
          dispatch(alertNull());
        },3000);
      })
    }
    )
  };

  //DELETE IMAGE FROM FIREBASE

  const deleteImageFromFirebase = () =>{
    setIsLoading(true);
    const delRef = ref(storage, imageDownloadUrl);
    deleteObject(delRef).then(()=>{
      setImageDownloadUrl(null);
      setIsLoading(false);
      dispatch(alertInfo(`Image removed from the cloud`));
      setTimeout(()=>{
        dispatch(alertNull());
      },3000)
    }).catch((error)=>{
      dispatch(alertWarning(`Something went wrong. Please try again`));
      setTimeout(()=>{
        dispatch(alertNull());
      },3000)
    });
  }

  //Summiting new Data

  const submitNewData = () =>{
    const data = {
      product_name: itemName,
      product_category: category,
      product_price: price,
      imageURL:imageDownloadUrl,

    }
    //adding data to  the cloud
    addNewProduct(data).then((res)=>{
      console.log(res);
      dispatch(alertSuccess('New Product Added Successfully'))
      setTimeout(()=>{
        dispatch(alertNull());
      },3000);
      setImageDownloadUrl(null)
      setItemName("")
      setPrice("")
      setcategory(null)
    });
    getAllProducts().then((data)=>{
      dispatch(setAllProducts(data));
    });
  }

  return (
    <div className='flex items-center justify-center flex-col pt-6 px-24 w-full'>
      <div className='border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4'>
          <InputValueField
            type="text"
            placeholder={"Item Name"}
            stateFunction={setItemName}
            stateValue={itemName}
          />
          <div className='w-full flex items-center justify-around gap-3 flex-wrap'>
            {kitchenCategory && kitchenCategory?.map(data=>(
              <p 
              onClick={()=>setcategory(data.category)}
              key={data.id} 
              className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md ${data.category===category ? 'text-white bg-primaryColor ':'bg-transparent'}`}>{data.title}
              </p>
            ))}
          </div>
          <InputValueField
            type="number"
            placeholder={"Item Price"}
            stateFunction={setPrice}
            stateValue={price}
          />
          <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-secondaryColor cursor-pointer">
            {
            isLoading ? 
              (   
                <div className='w-full h-full flex flex-col items-center justify-evenly px-24'>
                  <Spinner/>
                  {Math.round(progress>0)&&(
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                      <div className="flex justify-between w-full">
                        <span className="text-base font-medium text-textColor">
                          Progress
                        </span>
                        <span className='text-sm font-medium text-textColor'>
                          {Math.round(progress)>0 && (
                            <>{`${Math.round(progress)}%`}</>
                          )}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-neutralColor h-2.5 rounded-full transition-all duration-300 ease-in-out"
                            style={{
                              width:`${Math.round(progress)}%`,
                            }}
                            >
                            </div>
                      </div>

                    </div>
                  )}
                </div>
              )
            :
              (
                <>
                  {!imageDownloadUrl ? (
                    <>
                        <label>
                            <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer hover:text-primaryColor">
                              <div className="flex flex-col justify-center items-center cursor-pointer">
                                <p className="font-bold text-4xl">
                                  <FaCloudUploadAlt className="-rotate-0 "/>
                                </p>
                                <p className='text-lg text-neutralColor'>
                                  Click to upload an image
                                </p>
                              </div>
                            </div>
                            <input
                            
                                type="file"
                                name="upload-image"
                                accept="image/*"
                                onChange={uploadImage}
                                className='w-0 h-0'
                              />
                        </label>
                    </>
                  )
                  :
                  (
                    <>
                      <div className="relative w-full h-full overflow-hidden">
                        <motion.img
                          whileHover={{scale:1.15}}
                          src={imageDownloadUrl}
                          className='w-full h-full object-fill'
                        />
                        <motion.button
                          {...buttonClick}
                          type='button'
                          className='absolute top-3 right-3 p-3 rounded-full bg-primaryColor text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out'
                          onClick={()=>deleteImageFromFirebase(imageDownloadUrl)}
                        >
                          <MdDelete className="-rotate-0"/>
                        </motion.button>
                      </div>
                    </>
                  )
                }
                
                </>
              )
           
            }
          </div>
          <motion.button
            onClick={submitNewData}
            {...buttonClick}
            className='w-9/12 py-2 rounded-md bg-primaryColor text-primary hover:bg-red-500'
          >
            Save
          </motion.button>
      </div>
    </div>
  )
}

export const InputValueField = ({type, placeholder, stateValue, stateFunction}) => {
  return (
    <>
    <input type={type} placeholder={placeholder} className='w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-primaryColor'
    value={stateValue}
    onChange={(e)=>stateFunction(e.target.value)}
    />
    </>
  )
}
export default DBNewItems