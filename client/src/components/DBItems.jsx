import React from 'react'
import {DataTable} from '../components/index';
import { HiCurrencyDollar } from '../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { alertNull, alertSuccess } from '../context/actions/alertActions';

const DBItems = () => {
  const products = useSelector((state)=>state.products);
  const dispatch = useDispatch();
  return (
    <div className='flex items-center justify-self-center gap-4 pt-6 w-full'>
     <DataTable columns={[
        {
          title:"Image",
          field:"imageURL",
          render:(rowData)=>(
          <img src={rowData.imageURL}
          className='w-32 h-16 object-contain rounded-md'/>
        ),
      },
        { title: 'Name', field: 'product_name' },
        { title: 'Category', field: 'product_category' },
        { title: 'Price', field: 'product_price',
          render: (rowData)=>(
            <p className='text-2xl font-semibold text-textColor flex items justify-center'>
              <span className='text-primaryColor'><HiCurrencyDollar className='text-primaryColor'/></span>&nbsp;
              {parseFloat(rowData.product_price).toFixed(2)}
            </p>
          ),
        },
     ]}
     data={products}
     title="Products List"
     action={[
      {icon:'edit',
        tooltip:'Edit Product',
        onClick:(event, rowData)=>{
          alert('You want to edit this product '+rowData.product_id)
        },
      },
      {icon:'delete',
        tooltip:'Delete Product',
        onClick:(event, rowData)=>{
            if(window.confirm('Are you sure, you want to delete this product?')){
              deleteProduct(rowData.product_id).then((res)=>{
                dispatch(alertSuccess('Product deleted successfully'));
                setInterval(()=>{
                  dispatch(alertNull());
                },3000);
                getAllProducts().then((data)=>{
                  dispatch(setAllProducts(data));
                });
              })
            }
          },
      },
     ]}
     />
    </div>
  );
};

export default DBItems