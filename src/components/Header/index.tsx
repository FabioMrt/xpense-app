"use client"
import Link from "next/link";
import { FiLoader, FiLock, FiLogOut, FiUser } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


    
    export function Header() {

        const { status, data:session } = useSession();
        console.log("status:", status)

        async function handleLogin() {
                await signIn();
        }

         async function handleLogout() {
                await signOut();
        }





    return (
        <header className="w-full flex items-center px-4 py-4 bg-white h-20 shadow-sm">
        <div className="w-full flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/">
        <h1 className="text-2xl font-bold text-purple-950 hover:tracking-widest duration-300">
            <span className="text-orange-600">XP</span>ensive Control</h1>
        </Link>

       
           

            {status === "loading" && (
                <button className="animate-spin">
                <FiLoader size={26} color="#4b5563" />
                </button>
            )}

             {status === "unauthenticated" && (
                
                <button onClick={handleLogin} className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 hover:cursor-pointer">
                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                <span>Entrar com Google</span>
            </button>
            )}


           {status === "authenticated" && (
            
             <div className="flex gap-1 items-center ">
                
                    <Avatar>
                <AvatarImage src={session?.user.image ?? ""} />
                <AvatarFallback>...</AvatarFallback>
                </Avatar>
                
                <div className="gap-5 flex items-center">
                <span className="text-gray-600 text-sm  text-ellipsis text-nowrap">
                    {session?.user.name}</span>
             <Link href="/dashboard">
            <FiUser size={26} color="#4b5563"/>
            </Link>


        <button onClick={handleLogout} className="hover:cursor-pointer">
            <FiLogOut size={26} color="#c20000"/>
        </button>
           </div>
           </div>
           )}
           

            </div>

        </header>
    );
    }