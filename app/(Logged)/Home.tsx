import React, { useEffect, useState } from 'react'
import { FaRegHeart } from 'react-icons/fa'
import supabase from '@/supabase/client'
import AnimatedCounter from '../(Animation)/AnimatedCounter'


const Home = () => {
    const [counterUsers, setCounterUsers] = useState<number>()

    useEffect(()=>{
        const fetchUserNumber = async()=>{
            const {data} = await supabase
                .from("users")
                .select()
            
            const lenUsers = data?.length
            setCounterUsers(lenUsers)
        }
        fetchUserNumber()

    }, [])

  return (
    <>
        <div className='flex flex-col justify-center items-center'>
            <div className='flex flex-row'>
                <span className="font-bold text-4xl font-poppins">
                    Talete
                    <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
                        Hub
                    </span>
                </span>
                <div className='absolute right-0 m-2 mx-4'>  
                    <FaRegHeart className="cursor-pointer text-2xl font-bold" />
                </div>
                <div className='absolute left-0 mt-8 mx-2 '>
                        <span className='font-bold font-poppins text-4xl'>+</span>
                        <span className='font-bold font-poppins text-4xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent'>
                            <AnimatedCounter from={0} to={Number(counterUsers)}/>
                        </span>
                        <span className='font-bold font-lora text-xl'>Utenti</span>
                </div>
            </div>
        </div>

        
    </>
  )
}

export default Home
