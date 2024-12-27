import React, { useEffect, useState } from 'react'
import { Input } from '@nextui-org/input'
import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
    const [notFound, setNotFound] = useState<boolean>(true)
    const [searchValue, setSearchValue] = useState("")

    useEffect(()=>{
        setSearchValue("")
    }, [])


    const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    return (
    <>
        <div className='flex flex-col justify-center items-center'>
            <div className='absolute top-0 left-0 right-0 m-2'>
                <Input
                    radius="lg"
                    variant="bordered"
                    placeholder="Scrivi per cercare..."
                    className="w-full max-w-xl text-lg py-4 font-poppins"
                    value={searchValue}
                    startContent={
                        <IoSearchOutline className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                    onChange={handleSearchValue}
                />
            </div>
            <div className='flex flex-col justify-center items-center mt-20 mx-2'>
                {notFound ? (
                    <span className='text-2xl font-bold font-poppins'>
                        Nessun Risultato
                    </span>
                ) : ""}
            </div>
        </div>

    </>
  )
}

export default Search