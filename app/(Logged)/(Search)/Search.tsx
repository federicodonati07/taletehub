import React, { useEffect, useState } from 'react';
import { Input } from '@nextui-org/input';
import { IoSearchOutline } from "react-icons/io5";
import supabase from '@/supabase/client';
import { useDebounce } from 'use-debounce'; // Per il debounce
import { User } from "@nextui-org/user";
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover"

// Definisci un tipo per l'utente
interface User {
    id: string;
    username: string;
    picture: string;
    bio: string;
    status: string;
}

const Search = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]); // Usa il tipo User[]
    const [notFound, setNotFound] = useState<boolean>(true);
    const [debouncedSearchValue] = useDebounce(searchValue, 500); // Debounce di 500ms
    const [myUsername, setMyUsername] = useState<string>("");

    // Funzione per ottenere l'ID dell'utente attualmente loggato
    useEffect(() => {
        const fetchMyUsername = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const id = session?.user.id;

            if (id) {
                const {data} = await supabase
                    .from("users")
                    .select()
                    .eq("uuid", id)

                setMyUsername(data![0].username)
            }
        };
        fetchMyUsername();
    }, []); // Lo stato `myUserId` viene caricato una sola volta

    // Effettua la ricerca ogni volta che il valore della ricerca cambia e solo quando myUserId è disponibile
    useEffect(() => {
        if (!myUsername) return; // Non eseguire la ricerca se myUserId non è ancora disponibile

        if (debouncedSearchValue === "") {
            setSearchResults([]);
            setNotFound(true);
            return;
        }

        const fetchResults = async () => {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select()
                    .ilike("username", `%${debouncedSearchValue}%`);  // Usa "ilike" per la ricerca case-insensitive

                if (error) throw error;

                if (data?.length > 0) {
                    // Filtra per escludere l'utente loggato
                    const filteredResults = data.filter((user: User) => user.id !== myUsername);
                    setSearchResults(filteredResults);

                    if (filteredResults.length > 0) {
                        setNotFound(false);
                    } else {
                        setNotFound(true);
                    }
                } else {
                    setSearchResults([]);
                    setNotFound(true);
                }

                console.log(data);
            } catch (error) {
                console.error("Errore nella ricerca:", error);
            }
        };

        fetchResults();
    }, [debouncedSearchValue, myUsername]); // Dipende sia dal valore di ricerca che dall'ID dell'utente

    const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='fixed top-0 left-0 right-0 m-2'>
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

            <div className='flex flex-col justify-center items-center mt-20 mx-2 overflow-y-scroll'>
                {notFound ? (
                    <span className='text-2xl font-bold font-poppins'>
                        Nessun Risultato
                    </span>
                ) : (
                    <ul className="list-none p-0">
                        {searchResults.filter((user)=>user.username != myUsername).map((user: User) => (
                            <li key={user.id} className="text-xl font-poppins">
                                <div className='flex flex-row space-x-3 p-2'>
                                    <Avatar 
                                        src={`${user.picture}?t=${new Date().getTime()}`}
                                        size="md"
                                        className='mt-1'
                                    />
                                    <div className='flex flex-col mx-2'>
                                        <div className='flex flex-row'>
                                            <span className='font-lora'>{user.username}</span>
                                            <Popover placement="bottom" showArrow={true} color={user.status == "verified" ? "primary" : user.status == "admin" ? "success" : "default"} >
                                                <PopoverTrigger>
                                                    <span>
                                                        {user.status == "verified" ? (<RiVerifiedBadgeFill className='text-xl m-1 font-bold text-blue-500 cursor-pointer'/>): user.status == "admin" ? (<RiVerifiedBadgeFill className='text-xl m-1 font-bold text-emerald-500 cursor-pointer'/>) : ("")}
                                                    </span>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div className="px-1 py-2">
                                                        <div className="text-small font-bold text-white">
                                                            {user.status == "verified" ? "Account Verificato" : user.status == "admin" ? "Account Amministratore" : ""}
                                                        </div>
                                                        <div className="text-tiny text-white">
                                                            {user.status == "verified" ? "Account verificato da un Amministratore" : user.status == "admin" ? "Account appartenente a un amministratore" : ""}
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        
                                        <span className='text-sm font-lora text-zinc-500 truncate w-28'>{user.bio}</span>
                                    </div>
                                    <div className='absolute right-2'>
                                        <Button color="primary">Segui</Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Search;
