import React, { useEffect, useState } from 'react';
import { Avatar } from "@nextui-org/avatar";
import AnimatedCounter from '../(Animation)/AnimatedCounter';
import { Button } from '@nextui-org/button';
import supabase from '@/supabase/client';
import supabaseAdmin from '@/supabase/adminClient';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import NewUser from './NewUser';

const User = () => {
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
    const [likes, setLike] = useState();
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [igLink, setIgLink] = useState<string>()
    const [startNew, setStartNew] = useState<boolean>()


    useEffect(() => {
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
            setPicture(data![0].picture);
            setBio(data![0].bio);
            setShadowBanned(data![0].shadow_banned);
            setLike(data![0].likes);
            setFollowers(data![0].followers);
            setFollowing(data![0].following);
            setIgLink(data![0].ig);
            setStartNew(data![0].start)
        };

        getSessionInfo();
    }, []);

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

        await supabase.auth.signOut();
        await supabaseAdmin.auth.admin.deleteUser(String(session?.user.id));
        window.location.reload();
    };

    return(
        <>
            <div className={`${startNew ? "block" : "hidden"}`}>
                <NewUser id={String(id)}></NewUser>
            </div>
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 text-center m-2 p-4 w-full max-w-4xl max-h-screen ${startNew ? "hidden" : "block"}`}>
                {/* Avatar Section */}
                <div className="flex flex-row justify-center items-center text-center mb-6">
                    <div>
                        <Avatar size="lg" src={picture} className="cursor-pointer" />
                    </div>
                    <span className="text-2xl font-bold font-poppins ml-4 text-white">{username}</span>
                </div>

                {/* Stats Section */}
                <div className="flex justify-between gap-6">
                    {/* Likes Section */}
                    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer">
                        <span className="font-lora text-lg">Likes</span>
                        <div className="flex flex-row items-center justify-center">
                            <span className="font-poppins font-bold text-3xl">
                                <AnimatedCounter from={0} to={Number(likes)} />
                            </span>
                        </div>
                    </div>

                    {/* Followers Section */}
                    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer">
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

                <div className="flex flex-col items-start justify-start text-left mt-10 mb-10">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-poppins">{ns}</span>
                        <span className="font-lora">{bio}</span>
                    </div>
                </div>

                <div>
                    <span className="text-zinc-700">{id}</span>
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
        </>
    )
};

export default User;
