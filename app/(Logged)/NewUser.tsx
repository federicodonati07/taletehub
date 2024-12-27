import React, { useEffect, useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import supabase from '@/supabase/client';
import Image from 'next/image';
import { Avatar } from '@nextui-org/avatar';

type Props = {
    id: string;
};

const NewUser = ({ id }: Props) => {
    const [username, setUsername] = useState<string>()
    const [start, setStart] = useState<boolean>()
    const [picture, setPicture] = useState<string>()
    const [bio, setBio] = useState<string>()
    const [ig, setIg] = useState<string>()
    
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [existingUsername, setExistingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState<string>('');
    const [newIg, setNewIg] = useState<string>('');
    const [newBio, setNewBio] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(()=>{
        const getUsername = async()=>{
            const {data: usernameData} = await supabase
                .from("users")
                .select()
                .eq("uuid", id)

            
            if(usernameData!.length > 0){
                const oldUsername = usernameData![0].username
                const oldStart = usernameData![0].start
                const oldPicture = usernameData![0].picture
                const oldIg = usernameData![0].ig
                const oldBio = usernameData![0].bio

                setUsername(oldUsername)
                setStart(oldStart)
                setPicture(`${oldPicture}?t=${new Date().getTime()}`);
                setIg(oldIg)
                setBio(oldBio)
            }
            
        }
        getUsername()
    }, [id])

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
            setFile(file);
        }
    };

    const handleUsernameChange = async (event: string) => {
        const value = event;

        const { data } = await supabase
            .from('users')
            .select('username')
            .eq('username', value);

        if (data && data.length > 0) {
            setExistingUsername(true);
        } else {
            setExistingUsername(false);
            setNewUsername(value);
        }
    };

    const handleIgChange = (event: string) => {
        setNewIg(event);
    };

    const handleBioChange = (event: string) => {
        setNewBio(event);
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        if (file) {
            // Caricamento dell'immagine nel bucket
            const { error: uploadError } = await supabase.storage
                .from('UserProfilePicture')
                .upload(`${id}/avatar/avatar`, file, {
                    cacheControl: '3600',
                    upsert: true, // Sovrascrive l'immagine se esiste già
                });

            if (uploadError) {
                console.error('Errore durante l\'upload dell\'immagine:', uploadError.message);
                return;
            }

            // Genera l'URL pubblico dell'immagine caricata
            const { data: publicUrlData, } = supabase
                .storage
                .from('UserProfilePicture')
                .getPublicUrl(`${id}/avatar/avatar`);


            const profileImageUrl = publicUrlData.publicUrl;

            // Aggiorna l'utente nel database con l'immagine del profilo
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    username: newUsername || username, // Se vuoto, imposta il nome predefinito
                    ig: newIg || ig,
                    bio: newBio || bio,
                    picture: profileImageUrl, // Aggiungi l'URL dell'immagine
                    start: false
                })
                .eq('uuid', id);

            if (updateError) {
                console.error('Errore durante l\'aggiornamento del profilo utente:', updateError.message);
                return;
            }

            window.location.reload()
        } else {
            // Nessun file immagine selezionato, aggiorna solo le informazioni utente
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    username: newUsername || username, // Se vuoto, imposta il nome predefinito
                    ig: newIg || ig,
                    bio: newBio || bio,
                    start: false
                })
                .eq('uuid', id);

            if (updateError) {
                console.error('Errore durante l\'aggiornamento del profilo utente:', updateError.message);
                return;
            }

            window.location.reload()
        }
    };

    return (
        <div className="flex flex-col text-center justify-center items-center">
            <span className="font-poppins font-bold text-4xl text-center mb-4">
                Rendi Unico il tuo Account
            </span>
            <div className="mt-10">
                <div>
                    <span className="text-xl font-bold font-lora">Username</span>
                    <Input
                        isClearable
                        label="Username"
                        className="max-w-xs font-poppins"
                        type="text"
                        variant="bordered"
                        placeholder={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        color={existingUsername ? 'danger' : 'default'}
                    />
                </div>
                <div className="mt-5">
                    <span className="text-xl font-bold font-lora">Tag Instagram</span>
                    <Input
                        isClearable
                        className="max-w-xs font-poppins"
                        label="Tag Instagram"
                        type="text"
                        variant="bordered"
                        placeholder={ig == "" ? "Username Instagram" : ig}
                        onChange={(e) => handleIgChange(e.target.value)}
                    />
                </div>
                <div className="mt-5">
                    <span className="text-xl font-bold font-lora">Bio</span>
                    <Textarea
                        className="max-w-xs"
                        label="La tua Bio"
                        variant="bordered"
                        placeholder={bio == "" ? "Descriviti" : bio}
                        onChange={(e) => handleBioChange(e.target.value)}
                        maxLength={250}
                    ></Textarea>
                </div>
                <div className="mt-5">
                    <div className="flex flex-col text-center justify-center items-center">
                        <span className="text-xl font-bold font-lora">Immagine Profilo</span>
                        <div className="relative">
                            {start ? (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="image-upload"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="border rounded-full flex flex-col justify-center items-center text-center cursor-pointer overflow-hidden w-20 h-20 relative"
                                        title={image ? "Clicca per cambiare immagine" : "Clicca per caricare immagine"}
                                    >
                                        {image ? (
                                            <Image
                                                src={image}
                                                alt="Anteprima Immagine"
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        ) : (
                                            <span className="text-4xl font-bold font-poppins px-2">+</span>
                                        )}
                                    </label>
                                </>
                            ) : (
                                <Avatar size='lg' src={picture}></Avatar>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Button isLoading={isLoading} className="mt-10 bg-slate-50 text-black font-bold font-poppins" variant="solid" onPress={handleSubmit}>
                {start ? "Continua" : "Salva"}
            </Button>
        </div>
    );
};

export default NewUser;
