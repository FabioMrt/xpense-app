"use client"
import Link from "next/link";
import { FiLoader, FiLock, FiLogOut, FiUser } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


    
    export function Header() {

        const { status, data:session } = useSession();

        async function handleLogin() {
                await signIn();
        }

         async function handleLogout() {
                await signOut();
        }

        // Função para gerar iniciais do nome
        const getInitials = (name: string | null | undefined) => {
            if (!name) return "U";
            const parts = name.trim().split(" ");
            if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
            return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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
            
             <div className="flex gap-3 items-center">
                
                    <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-purple-800">
                <AvatarImage 
                    src={session?.user?.image || ""} 
                    alt={session?.user?.name || "User"}
                    referrerPolicy="no-referrer"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-orange-500 text-white font-semibold">
                    {getInitials(session?.user?.name)}
                </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center gap-3">
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium hidden md:block max-w-[150px] truncate">
                    {session?.user?.name}
                </span>
             <Link href="/dashboard" className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <FiUser size={20} color="#4b5563"/>
            </Link>


        <button 
            onClick={handleLogout} 
            className="hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-lg transition-colors"
            title="Sair"
        >
            <FiLogOut size={20} color="#ef4444"/>
        </button>
           </div>
           </div>
           )}
           

            </div>

        </header>
    );
    }