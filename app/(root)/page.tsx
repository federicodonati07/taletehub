"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/supabase/client";
import { Spinner } from "@nextui-org/spinner";
import Login from "./Login";
import Logged from "../(Logged)/Logged";


const Page = () => {
  const [isLogged, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.log("Errore nella verifica della sessione: ", error.message);
      }

      setIsLoggedIn(!!session);
    };
    checkSession();
  }, []);

  return (
    <>
      <div
        className={`flex flex-row w-full ${
          isLogged
            ? "justify-start items-start text-left"
            : "justify-center items-center text-center"
        }`}
      >
        {/* Primo div: TaleteHub */}
        <div className={`text-left ${isLogged ? "hidden" : "block"}`}>
          <span className="font-bold text-4xl font-poppins m-2">
            Talete
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
              Hub
            </span>
          </span>
        </div>

        <div>
          {/* Body dinamico, not logged */}
          {isLogged === null ? (
            <Spinner />
          ) : isLogged ? (
            <div>
              <Logged></Logged>
            </div>
            
          ) : (
            <div className="absolute top-1/4 w-full left-0">
              <Login />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
