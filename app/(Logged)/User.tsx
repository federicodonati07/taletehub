import React, { useEffect, useState } from 'react';
import { Avatar } from "@nextui-org/avatar";
import AnimatedCounter from '../(Animation)/AnimatedCounter';
import { Button } from '@nextui-org/button';
import supabase from '@/supabase/client';
import supabaseAdmin from '@/supabase/adminClient';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import NewUser from './NewUser';
import { FaInstagram } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { TbGhost2 } from "react-icons/tb";
import { CiCircleInfo } from "react-icons/ci";
import {Popover, PopoverContent, PopoverTrigger} from "@nextui-org/popover"
import { MdModeEdit } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@nextui-org/drawer";

const User = () => {
    const [image, setImage] = useState<string | null>(null)
    const [fileImage,setFileImage] = useState<File | null>(null)
    const [isLoading, setIsloading] = useState<boolean>(false)

    const [isEditing, setIsEditing] = useState(false)

    const [isLoadingL, setIsLoadingL] = useState(false);
    const [isLoadingD, setIsLoadingD] = useState(false);
    const [id, setId] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [ns, setNs] = useState<string>();
    const [provider, setProvider] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [picture, setPicture] = useState<string>();
    const [bio, setBio] = useState<string>();
    const [shadowBanned, setShadowBanned] = useState<boolean>();
    const [igLink, setIgLink] = useState<string>()
    const [startNew, setStartNew] = useState<boolean>()

    const [following, setFollowing] = useState<number>()
    const [followers, setFollower] = useState<number>()
    

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const handleOpen = () => {
        onOpen();
    };



    useEffect(() => {
        const fetchFollowingFollower = async()=>{
            const {data: followingData} = await supabase
                .from("follow")
                .select()
                .eq("user", username)
                .eq("status", "accepted")

            const {data: followersData} = await supabase
                .from("follow")
                .select()
                .eq("following_user", username)
                .eq("status", "accepted")

            setFollowing(followingData?.length)
            setFollower(followersData?.length)
        
        }

        const getSessionInfo = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            const id = String(session?.user.id);
            const email = String(session?.user.email);
            const ns = String(session?.user.user_metadata.full_name);
            const provider = String(session?.user.app_metadata.provider);

            const {data} = await supabase
                .from("users")
                .select()
                .eq("uuid", id)

            setId(id);
            setEmail(email);
            setNs(ns);
            setProvider(provider);
            
            setUsername(data![0].username)
            setStatus(data![0].status);
            setPicture(`${data![0].picture}?t=${new Date().getTime()}`);
            setBio(data![0].bio);
            setShadowBanned(data![0].shadow_banned);
            setIgLink(data![0].ig);
            setStartNew(data![0].start)
        };

        getSessionInfo();
        fetchFollowingFollower()
    }, [username]);

    const handleLogout = async () => {
        setIsLoadingL(true);
        await supabase.auth.signOut();
        window.location.reload();
    };

    const handleDelete = async () => {
        setIsLoadingD(true);
        const { data: { session } } = await supabase.auth.getSession();
        await supabase
            .from("users")
            .delete()
            .eq("uuid", id)
        try{
            const {data: files, error: listError} = await supabase
                .storage
                .from("UserProfilePicture")
                .list(id)

            if(listError){
                throw listError
            }
            if(!files || files.length === 0){
                console.log("no files found in the folder")
                window.location.reload();
            }

            const paths: string[] = []

            for(const file of files){
                paths.push(`${id}/${file.name}`)

                const {data: subfolderFilse, error: subfolderError} = await supabase
                    .storage
                    .from("UserProfilePicture")
                    .list(`${id}/${file.name}`)

                    if(subfolderError){
                        console.error(`Error listing subfolder ${file.name}:`, subfolderError.message);
                        continue;
                    }
                    if(subfolderFilse){
                        subfolderFilse.forEach(subFile => paths.push(`${id}/${file.name}/${subFile.name}`))
                    }
            }
            const {error: deleteError} = await supabase
                .storage
                .from("UserProfilePicture")
                .remove(paths)

            if(deleteError){
                throw deleteError
            }
            console.log('Folder and its contents deleted successfully.');
        } catch (error) {
            console.error('Error deleting folder:', error!);
        }

        await supabase.auth.signOut();
        await supabaseAdmin.auth.admin.deleteUser(String(session?.user.id));
        window.location.reload();
    };

    const handleIgLink = ()=>{
        window.open(`https://www.instagram.com/${igLink}`, '_blank');
    }

    const handleEditUser = ()=>{
        setIsEditing(true)
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
            setFileImage(file);
        }
    }

    const handleClearInput = ()=>{
        setImage(null); // Resetta la preview dell'immagine
        setFileImage(null)
    }

    const handleSubmitNewImage = async () => {
        setIsloading(true);
        if (fileImage) {
            const { error: errorUpdateImage } = await supabase.storage
                .from("UserProfilePicture")
                .upload(`${id}/avatar/avatar`, fileImage, {
                    cacheControl: "3600",
                    upsert: true,
                });

            const { data: publicUrlData } = await supabase.storage
                .from("UserProfilePicture")
                .getPublicUrl(`${id}/avatar/avatar`);

            const publicUrlImage = publicUrlData.publicUrl;

            const { error: errorUpdateUser } = await supabase
                .from("users")
                .update({
                    picture: publicUrlImage,
                })
                .eq("uuid", id);

            if (errorUpdateImage || errorUpdateUser) {
                console.log("errore: ", errorUpdateImage, errorUpdateUser);
            } else {
                toast.success("Immagine profilo aggiornata");
                // Aggiungi un timestamp univoco all'immagine per evitare il caching
                setPicture(`${publicUrlImage}?t=${new Date().getTime()}`);
                setIsloading(false);
            }
        } else {
            const { error: errorDeleteImage } = await supabase.storage
                .from("UserProfilePicture")
                .remove([`${id}/avatar/avatar`]);

            const { error: errorUpdateUser } = await supabase
                .from("users")
                .update({
                    picture: "",
                })
                .eq("uuid", id);

            if (errorDeleteImage || errorUpdateUser) {
                console.log("errore: ", errorDeleteImage, errorUpdateUser);
            } else {
                toast.success("Immagine profilo aggiornata");
                setPicture("");
                setIsloading(false);
            }
        }
    };

    return(
        <>
            <div className={`${startNew ? "block" : "hidden"} absolute top-0 left-1/2 transform -translate-x-1/2 text-center m-2 p-4 w-full max-w-4xl max-h-screen`}>
                <NewUser id={String(id)}></NewUser>
            </div>
            <div className={`${isEditing ? "block" : "hidden"} absolute top-0 left-1/2 transform -translate-x-1/2 text-center m-2 p-4 w-full max-w-4xl max-h-screen`}>
                <NewUser id={String(id)}></NewUser>
            </div>
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 text-center m-2 p-4 w-max max-w-4xl max-h-screen ${isEditing ? "hidden":"block"} ${startNew ? "hidden" : "block"}`}>
                {/* Avatar Section */}
                <div className="flex flex-row justify-center items-center text-center mb-6">
                    <div>
                        <Popover showArrow={true} onOpenChange={handleClearInput}>
                            <PopoverTrigger>
                                <Avatar size="lg" src={picture} className="cursor-pointer"/>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="px-1 py-2">
                                    <div className="font-poppins text-xl font-bold text-white flex justify-center items-center text-center m-2">
                                        Cambia Immagine Profilo
                                    </div>
                                    <div className="text-tiny text-white flex flex-col justify-center items-center text-center">
                                        <input 
                                            type="file" 
                                            accept='image/*'
                                            id="image-upload"
                                            className='hidden'
                                            onChange={handleImageChange}
                                        />
                                        <label 
                                            htmlFor="image-upload"
                                            className='border rounded-full flex flex-col justify-center items-center text-center cursor-pointer overflow-hidden w-16 h-16 relative'
                                            title={image? "Clicca per cambiare immagine" : "Clicca per caricare immagine"}
                                        >
                                            {image ? (
                                                <Image
                                                    src={image}
                                                    alt="Anteprima Immagine"
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            ):(
                                                <>
                                                    <Avatar size="lg" src=""></Avatar>
                                                </>
                                            )}
                                        </label>
                                        <span className='text-tiny m-2 mt-5 font-bold font-lora'>
                                            Elimina la tua immagine profilo senza inserirne una nuova
                                        </span>
                                        <Button isLoading={isLoading} className="bg-slate-50 text-black font-bold font-poppins" variant="solid" onPress={()=>handleSubmitNewImage()}>
                                            Salva
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        
                    </div>
                    <div className='flex flex-row'>
                        <span className="text-2xl font-bold font-poppins ml-4 text-white">
                            {username}
                        </span>
                        
                        <Popover placement="bottom" showArrow={true} color={status == "verified" ? "primary" : status == "admin" ? "success" : "default"} >
                            <PopoverTrigger>
                                <span>
                                    {status == "verified" ? (<RiVerifiedBadgeFill className='text-4xl font-bold text-blue-500 cursor-pointer'/>): status == "admin" ? (<RiVerifiedBadgeFill className='text-4xl font-bold text-emerald-500 cursor-pointer'/>) : ("")}
                                </span>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="px-1 py-2">
                                    <div className="text-small font-bold text-white">
                                        {status == "verified" ? "Account Verificato" : status == "admin" ? "Account Amministratore" : ""}
                                    </div>
                                    <div className="text-tiny text-white">
                                        {status == "verified" ? "Account verificato da un Amministratore" : status == "admin" ? "Account appartenente a un amministratore" : ""}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    
                </div>

                {/* Stats Section */}
                <div className="flex justify-between gap-6">
                    {/* Likes Section */}
                    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer">
                        <span className="font-lora text-lg">Likes</span>
                        <div className="flex flex-row items-center justify-center">
                            <span className="font-poppins font-bold text-3xl">
                                <AnimatedCounter from={0} to={0} />
                            </span>
                        </div>
                    </div>

                    {/* Followers Section */}
                    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer" onClick={handleOpen}>
                        <span className="font-lora text-lg">Followers</span>
                        <div className="flex flex-row items-center justify-center">
                            <span className="font-poppins font-bold text-3xl">
                                <AnimatedCounter from={0} to={Number(followers)} />
                            </span>
                        </div>
                    </div>

                    {/* Following Section */}
                    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer">
                        <span className="font-lora text-lg">Following</span>
                        <div className="flex flex-row items-center justify-center">
                            <span className="font-poppins font-bold text-3xl">
                                <AnimatedCounter from={0} to={Number(following)} />
                            </span>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-2 my-5'>
                    <Button className='font-poppins font-bold' onPress={handleEditUser}>
                        <MdModeEdit className='font-bold text-xl'/>
                        Modifica Profilo
                    </Button>
                    <Button color='primary' className='font-poppins font-bold'>
                        <FaShare className='font-bold text-xl'/>
                        Condividi Profilo
                    </Button>
                </div>

                {shadowBanned ? (
                    <div>
                        <Popover placement="bottom" showArrow={true} color='danger'>
                            <PopoverTrigger>
                                <div className='w-full rounded-full bg-zinc-900/60 text-white flex flex-row items-center justify-center text-center p-2 mt-5'>
                                    <TbGhost2 className='text-4xl font-bold mr-1'/>
                                    <span className='font-poppins font-bold mr-1 text-lg'>Sei stato shadow bannato</span>
                                    <CiCircleInfo className="text-xl font-bold cursor-pointer"/>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="px-1 py-2">
                                <div className="text-small font-bold">Account sottoposto a restrizioni</div>
                                <div className="text-tiny">Il tuo account non verrà più visualizzato nelle ricerche degli altri utenti</div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                ):("")}
                <div className="flex flex-col items-start justify-start text-left mt-10 mb-10">
                    <div className="flex flex-col">
                        <div className='grid grid-cols-2'>
                            <span className="text-xl font-bold font-poppins">{ns}</span>
                            {igLink == "" ? ("") : (
                                <>
                                    <Button variant="light" onPress={handleIgLink}>
                                            <FaInstagram className='font-bold text-lg'/>
                                            <span className='font-bold font-lora truncate w-28'>{igLink}</span>
                                    </Button>
                                </>
                            )}
                        </div>
                        <div className='grid grid-cols-1'>
                            <span className="font-lora text-pretty">{bio}</span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col justify-center items-center text-cneter'>
                    <span className='text-zinc-700 text-tiny font-lora'>{email} with {provider}</span>
                    <span className="text-zinc-700 font-lora">{id}</span>
                </div>
                <div className="mx-5">
                    <Button onPress={handleLogout} isLoading={isLoadingL} className="w-full" variant="ghost">
                        Esci dall&rsquo;account
                    </Button>
                </div>
                <div className="mt-5 mx-5">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button isLoading={isLoadingD} className="w-full" color="danger" variant="ghost">
                                Elimina Account
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem key="back">Indietro</DropdownItem>
                            <DropdownItem key="delete" color="danger" className="text-danger" onPress={handleDelete}>
                                Elimina Definitivamente
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange} >
                <DrawerContent>
                {(onClose) => (
                    <>
                    <DrawerHeader className="flex flex-col gap-1">Drawer Title</DrawerHeader>
                    <DrawerBody>
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                        risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                        </p>
                        <p>
                        Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                        adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                        officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                        </p>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Close
                        </Button>
                        <Button color="primary" onPress={onClose}>
                        Action
                        </Button>
                    </DrawerFooter>
                    </>
                )}
                </DrawerContent>
            </Drawer>

            <Toaster
                position="top-center"
            />
        </>
    )
};

export default User;
