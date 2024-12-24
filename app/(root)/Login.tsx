import React, { useState } from 'react'
import {Button} from "@nextui-org/button"
import { FaGoogle } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import supabase from '@/supabase/client';

const Login = () => {
  const [isLoadingGD, setIsLoadingGD] = useState(false)

  const handleClickGoogle = async()=>{
    setIsLoadingGD(true)

    await supabase.auth.signInWithOAuth({
      provider:"google"
    })

  }
  const handleClickDiscord = async()=>{
    setIsLoadingGD(true)

    await supabase.auth.signInWithOAuth({
      provider:"discord"
    })
  }

  return (
    <>
      <div className='bg-zinc-900 p-2 rounded-lg flex flex-col'>
        <span className='text-3xl font-bold font-poppins'>Accedi o Registrati</span>
        <Button onPress={handleClickGoogle} isLoading={isLoadingGD} className='bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 mt-2 p-2'>
          <FaGoogle className='font-bold text-2xl'/>
          <span className='font-lora font-bold'>Tramite Google</span>
        </Button>
        <span className='text-sm my-2'>oppure</span>
        <Button onPress={handleClickDiscord} isLoading={isLoadingGD} className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-2 p-2'>
          <FaDiscord className='font-bold text-2xl'/>
          <span className='font-lora font-bold'>Tramite Discord</span>
        </Button>
      </div>
    </>
  )
}

export default Login