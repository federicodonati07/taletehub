import React, { useEffect, useState } from 'react'; 
import { Input } from '@nextui-org/input';
import { IoSearchOutline } from "react-icons/io5";
import supabase from '@/supabase/client';
import { useDebounce } from 'use-debounce'; // Per il debounce
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";

// Definizione del tipo User
interface User {
    id: string;
    username: string;
    picture: string;
    bio: string;
    status: string;
    shadow_banned: boolean;
    follow_status: string; // Valori possibili: 'accepted', 'requested', 'none'
}

const Search = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [notFound, setNotFound] = useState<boolean>(true);
    const [debouncedSearchValue] = useDebounce(searchValue, 500);
    const [myUsername, setMyUsername] = useState<string>("");

    // Ottieni lo username dell'utente loggato
    useEffect(() => {
        const fetchMyUsername = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const id = session?.user.id;

            if (id) {
                const { data } = await supabase
                    .from("users")
                    .select("username")
                    .eq("uuid", id)
                    .single();

                if (data) setMyUsername(data.username);
            }
        };

        fetchMyUsername();
    }, []);

    // Effettua la ricerca ogni volta che il valore cambia
    useEffect(() => {
        if (!myUsername || debouncedSearchValue === "") {
            setSearchResults([]);
            setNotFound(true);
            return;
        }

        const fetchResults = async () => {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select()
                    .ilike("username", `%${debouncedSearchValue}%`);

                if (error) throw error;

                if (data?.length > 0) {
                    const filteredResults = data.filter((user: User) => user.username !== myUsername);

                    const updatedResults = await Promise.all(
                        filteredResults.map(async (user: User) => {
                            const { data: followData } = await supabase
                                .from("follow")
                                .select("status")
                                .eq("user", myUsername)
                                .eq("following_user", user.username)
                                .single();

                            return {
                                ...user,
                                follow_status: followData?.status || "none", // Valore predefinito 'none'
                            };
                        })
                    );

                    setSearchResults(updatedResults);
                    setNotFound(updatedResults.length === 0);
                } else {
                    setSearchResults([]);
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Errore nella ricerca:", error);
            }
        };

        fetchResults();
    }, [debouncedSearchValue, myUsername]);

    // Gestisci il clic sul pulsante "Non seguire più"
    const handleUnfollowClicked = async (username: string) => {
        try {
            // Elimina la riga corrispondente dalla tabella 'follow'
            const { error } = await supabase
                .from("follow")
                .delete()
                .eq("user", myUsername)
                .eq("following_user", username);

            if (error) {
                console.error("Errore durante la rimozione del follow:", error);
                return;
            }

            // Aggiorna lo stato di follow per l'utente nella lista dei risultati di ricerca
            setSearchResults(prevResults => 
                prevResults.map(user =>
                    user.username === username
                        ? { ...user, follow_status: "none" }
                        : user
                )
            );
        } catch (err) {
            console.error("Errore durante la gestione dell'unfollow:", err);
        }
    };

    // Gestisci il clic sul pulsante "Segui"
    const handleFollowClicked = async (username: string) => {
        try {
            const { data: privateCheck, error } = await supabase
                .from("users")
                .select("private")
                .eq("username", username);

            if (error) throw error;

            let newStatus = 'none';
            if (privateCheck && privateCheck.length > 0) {
                const isPrivate = privateCheck[0].private;

                if (isPrivate) {
                    await supabase
                        .from("follow")
                        .insert({ user: myUsername, following_user: username, status: "requested" });
                    newStatus = 'requested';
                } else {
                    await supabase
                        .from("follow")
                        .insert({ user: myUsername, following_user: username, status: "accepted" });
                    newStatus = 'accepted';
                }
            } else {
                console.error("Errore: utente non trovato o campo 'private' mancante.");
            }

            // Aggiorna lo stato di follow per l'utente nella lista dei risultati di ricerca
            setSearchResults(prevResults => 
                prevResults.map(user =>
                    user.username === username
                        ? { ...user, follow_status: newStatus }
                        : user
                )
            );
        } catch (err) {
            console.error("Errore durante la gestione del follow:", err);
        }
    };

    // Gestisci il clic sul pulsante "Richiesta inviata"
    const handleRequestSentClicked = async (username: string) => {
        try {
            // Elimina la riga corrispondente con status 'requested'
            const { error } = await supabase
                .from("follow")
                .delete()
                .eq("user", myUsername)
                .eq("following_user", username)
                .eq("status", "requested");

            if (error) {
                console.error("Errore durante la cancellazione della richiesta:", error);
                return;
            }

            // Aggiorna lo stato nella lista dei risultati di ricerca
            setSearchResults(prevResults => 
                prevResults.map(user =>
                    user.username === username
                        ? { ...user, follow_status: "none" }
                        : user
                )
            );
        } catch (err) {
            console.error("Errore durante la gestione della richiesta inviata:", err);
        }
    };

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
                    <span className='text-2xl font-bold font-poppins'>Nessun Risultato</span>
                ) : (
                    <ul className="list-none p-0">
                        {searchResults.map((user) => (
                            <li key={user.id} className="text-xl font-poppins cursor-pointer">
                                <div className='flex flex-row space-x-3 p-2'>
                                    <Avatar src={`${user.picture}?t=${new Date().getTime()}`} size="md" className='mt-1' />
                                    <div className='flex flex-col mx-2'>
                                        <div className='flex flex-row'>
                                            <span className='font-lora'>{user.username}</span>
                                            {user.status === "verified" && (
                                                <Popover placement="bottom" showArrow={true}>
                                                    <PopoverTrigger>
                                                        <div>
                                                            <RiVerifiedBadgeFill className='text-xl m-1 font-bold text-blue-500 cursor-pointer' />
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <div className="px-1 py-2">
                                                            <span className="text-small font-bold text-white">Account Verificato</span>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        </div>
                                        <span className='text-sm font-lora text-zinc-500 truncate w-28'>{user.bio}</span>
                                    </div>
                                    <div className='absolute right-2'>
                                        <Button
                                            color={user.follow_status === "accepted" ? "default" : "primary"}
                                            variant={user.follow_status === "requested" ? "bordered" : "solid"}
                                            onPress={() => {
                                                if (user.follow_status === "accepted") {
                                                    handleUnfollowClicked(user.username);
                                                } else if (user.follow_status === "requested") {
                                                    handleRequestSentClicked(user.username);
                                                } else {
                                                    handleFollowClicked(user.username);
                                                }
                                            }}
                                        >
                                            {user.follow_status === "accepted" ? "Non seguire più" : user.follow_status === "requested" ? "Richiesta inviata" : "Segui"}
                                        </Button>
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
