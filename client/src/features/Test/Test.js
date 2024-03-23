import React, { useEffect } from 'react'
import { useGetMessageQuery } from './testSlice';
const Test = () => {

    const {data,isLoading} = useGetMessageQuery();


    useEffect(() => {
        console.log(data,isLoading)
    },[data, isLoading])
  return (
    <div>
      
    </div>
  )
}

export default Test
