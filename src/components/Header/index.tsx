"use client"
import Link from "next/link";
import { FiLoader, FiLock, FiLogOut, FiUser } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ThemeToggle"


    
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
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-orange-500 shadow-md">
            <span className="text-white font-bold text-lg">XP</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">XPensive</span>
            {" "}Control
        </h1>
        </Link>

       
           

            <div className="flex items-center gap-4">
                <ThemeToggle />
                
                {status === "loading" && (
                    <button className="animate-spin">
                    <FiLoader size={26} className="text-gray-600 dark:text-gray-400" />
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
                        {/* Botão Dashboard - Mais visível */}
                        <Link 
                            href="/dashboard" 
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                        >
                            <FiUser size={18} />
                            <span>Dashboard</span>
                        </Link>
                        
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-purple-800 cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all">
                                <AvatarImage 
                                    src={session?.user?.image || ""} 
                                    alt={session?.user?.name || "User"}
                                    referrerPolicy="no-referrer"
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-orange-500 text-white font-semibold">
                                    {getInitials(session?.user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium hidden lg:block max-w-[150px] truncate">
                                {session?.user?.name}
                            </span>
                            
                            {/* Botão Dashboard Mobile */}
                            <Link 
                                href="/dashboard" 
                                className="sm:hidden hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                                title="Dashboard"
                            >
                                <FiUser size={20} className="text-gray-600 dark:text-gray-400"/>
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
        </div>
        </div>
        </header>
    );
    }