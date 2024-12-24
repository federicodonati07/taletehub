import React, { useEffect, useState } from 'react';
import { Avatar } from "@nextui-org/avatar";
import AnimatedCounter from '../(Animation)/AnimatedCounter';
import { Button } from '@nextui-org/button';
import supabase from '@/supabase/client';
import supabaseAdmin from '@/supabase/adminClient';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import {Badge} from "@nextui-org/badge"
import { FaGoogle, FaDiscord } from 'react-icons/fa';

const User = () => {
    const [isLoadingL, setIsLoadingL] = useState(false);
    const [isLoadingD, setIsLoadingD] = useState(false);
    const [id, setId] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [ns, setNs] = useState<string>();
    const [provider, setProvider] = useState<string>();

    useEffect(() => {
        const getSessionInfo = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            const id = String(session?.user.id);
            const email = String(session?.user.email);
            const ns = String(session?.user.user_metadata.full_name);
            const provider = String(session?.user.app_metadata.provider);

            setId(id);
            setEmail(email);
            setNs(ns);
            setProvider(provider);
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

        await supabase.auth.signOut();
        await supabaseAdmin.auth.admin.deleteUser(String(session?.user.id));
        window.location.reload();
    };

    return (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center m-2 p-4 w-full max-w-4xl max-h-screen">
            {/* Avatar Section */}
            <div className="flex flex-row justify-center items-center text-center mb-6">
                <Badge
                    size="lg"
                    placement='top-left'
                    content={
                        provider === "google" ? (
                        <FaGoogle className="text-lg text-white" />
                        ) : provider === "discord" ? (
                        <FaDiscord className="text-lg text-white" />
                        ) : null
                    }
                    className={`${
                        provider === "google"
                        ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 p-1"
                        : provider === "discord"
                        ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1"
                        : "bg-gray-500"
                    }`}
                    >
                        <Avatar size="lg" src="" className='cursor-pointer'/>
                    </Badge>

                <span className="text-2xl font-bold font-poppins ml-4 text-white">USERNAME</span>
            </div>

            {/* Stats Section */}
            <div className="flex justify-between gap-6">
                {/* Likes Section */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer">
                    <span className="font-lora text-lg">Likes</span>
                    <div className="flex flex-row items-center justify-center">
                        <span className="font-poppins font-bold text-3xl">
                            <AnimatedCounter from={0} to={100} />
                        </span>
                    </div>
                </div>

                {/* Followers Section */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer">
                    <span className="font-lora text-lg">Followers</span>
                    <div className="flex flex-row items-center justify-center">
                        <span className="font-poppins font-bold text-3xl">
                            <AnimatedCounter from={0} to={1500} />
                        </span>
                    </div>
                </div>

                {/* Following Section */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer">
                    <span className="font-lora text-lg">Following</span>
                    <div className="flex flex-row items-center justify-center">
                        <span className="font-poppins font-bold text-3xl">
                            <AnimatedCounter from={0} to={10} />
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-start justify-start text-left mt-10 mb-10">
                <div className="flex flex-col">
                    <span className="text-xl font-bold font-poppins">{ns}</span>
                    <span className="font-lora">la tua bio</span>
                </div>
            </div>

            <div>
                <span className='text-zinc-700'>{id}</span>
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
    );
};

export default User;
