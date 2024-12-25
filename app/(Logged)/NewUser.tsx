import React from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import supabase from '@/supabase/client';
import ImageUpload from './(AvataUplaod)/ImageUpload';

type Props = {
    id: string;
};

const NewUser = ({ id }: Props) => {
    

    return (
        <div className="flex flex-col text-center justify-center items-center">
            <span className="font-poppins font-bold text-4xl text-center mb-4">
                Rendi Unico il tuo Account
            </span>
            <div className='mt-10'>
                <div>
                    <span className='text-xl font-bold font-lora'>Username</span>
                    <Input
                        isClearable
                        className="max-w-xs font-poppins"
                        type="text"
                        variant="bordered"
                        placeholder={`user_`+id}
                    />
                </div>
                <div className='mt-5'>
                    <span className='text-xl font-bold font-lora'>Tag Instagram</span>
                    <Input
                        isClearable
                        className="max-w-xs font-poppins"
                        label="Username"
                        type="text"
                        variant="bordered"
                        placeholder="Username Instagram"
                    />
                </div>
                <div className='mt-5'>
                    <ImageUpload></ImageUpload>
                </div>
            </div>
            

            {/* Puoi aggiungere un Button o altre funzionalità sotto */}
            <Button className="mt-4 bg-slate-50 text-black font-bold font-poppins" variant="solid">
                Conferma
            </Button>
        </div>
    );
};

export default NewUser;
