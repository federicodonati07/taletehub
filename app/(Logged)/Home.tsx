import React from 'react'
import { FaRegHeart } from 'react-icons/fa'

const Home = () => {
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
                <div className='absolute right-0 m-2'>
                    <FaRegHeart className="cursor-pointer text-2xl font-bold" />
                </div>
            </div>
        </div>

        {/* Sezione "Home" sotto il titolo, centrato orizzontalmente */}
        <div className='w-full flex ml-1'>
            <span className='text-2xl font-bold font-poppins'>
                Home
            </span>
        </div>
    </>
  )
}

export default Home
