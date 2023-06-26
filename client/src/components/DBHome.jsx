import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../api'
import { setAllProducts } from '../context/actions/productActions'
import {CChart} from '@coreui/react-chartjs';

const DBHome = () => {
  const products = useSelector((state)=>state.products);
  const dispatch = useDispatch();


   //VARIABLES FOR THE BAR CHARTS
  const drinks = products?.filter(item =>item.product_category==='drinks');
  const deserts = products?.filter(item =>item.product_category==='deserts');
  const fruits = products?.filter(item =>item.product_category==='fruits');
  const rice = products?.filter(item =>item.product_category==='rice');
  const curry = products?.filter(item =>item.product_category==='curry');
  const japanese = products?.filter(item =>item.product_category==='japanese');
  const chinese = products?.filter(item =>item.product_category==='chinese');
  const bread = products?.filter(item =>item.product_category==='bread');

  const orders = useSelector((state)=>state.orders);
  
  const paidItems = orders?.filter(orderItem => orderItem.status === 'paid')
  const delivered = orders?.filter(orderItem => orderItem.sts === 'delivered')
  const cancelled = orders?.filter(orderItem => orderItem.sts === 'cancelled')
  const processing = orders?.filter(orderItem => orderItem.sts === 'preparing')

  useEffect(()=>{
    if(!products){
      getAllProducts().then((data)=>{
        console.log(data);
        dispatch(setAllProducts(data));
      })
    }
  },[]);

 
  return (
    <div className='flex items-center justify-center flex-col pt-6 w-full h-full'>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="flex items-center justify-center">
          <div className="w-340 md:w-508">
            <CChart
                type="bar"
                data={{
                  labels: ['Drinks','Deserts','Fruits','Rice','Curry','Japanese','Chinese','Bread'],
                  datasets: [
                    {
                      label: 'Number of Products',
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                      ],
                      borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)',
                        'rgb(255, 99, 132)',
                      ],
                      borderWidth: 1,
                      data: [(drinks?.length),(deserts?.length),(fruits?.length),(rice?.length),(curry?.length),(japanese?.length),(chinese?.length),(bread?.length)],
                    },
                    
                  ],
                  options: {
                    responsive:true,
                    scales: {
                      y: {
                        stacked: true
                    },
                    },
                  }
                }}
                labels="Products"
              />
          </div>
        
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-275 md:460">

              <CChart
                type="doughnut"
                data={{
                  labels: ['Orders','Delivered','Cancelled','Paid','processing'],
                  datasets: [
                    {
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                      ],
                      borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)',
                        'rgb(255, 99, 132)',
                      ],
                       data: [(orders?.length),(delivered?.length),(cancelled?.length),(paidItems?.length),(processing?.length)],
                    },
                  ],
                }}
              />
          </div>

        </div>
      </div>
    </div>
  )
}

export default DBHome