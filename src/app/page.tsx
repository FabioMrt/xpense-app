"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  PiggyBank, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Users,
  CheckCircle,
  ArrowRight,
  Wallet,
  LineChart,
  Target,
  Zap,
  Star,
  CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 });
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona automaticamente se estiver autenticado (opcional - pode comentar se preferir mostrar banner)
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/dashboard");
  //   }
  // }, [status, router]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Banner para usuários autenticados */}
      {status === "authenticated" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-purple-600 to-orange-500 text-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Bem-vindo de volta, {session?.user?.name?.split(" ")[0]}! 👋</p>
                  <p className="text-sm text-white/90">Acesse seu dashboard para gerenciar suas finanças</p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Ir para Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-orange-500 dark:from-purple-900 dark:via-purple-800 dark:to-orange-600">
        {/* Padrão decorativo de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerChildren}
              className="text-center lg:text-left space-y-8 text-white"
            >
              <motion.div variants={fadeInUp} className="space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium ring-1 ring-white/30"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Controle Financeiro Inteligente
                </motion.div>
                
                <motion.h1 
                  variants={fadeInUp}
                  className="text-5xl lg:text-7xl font-bold tracking-tight"
                >
                  Domine suas{" "}
                  <span className="relative">
                    <span className="relative z-10 bg-gradient-to-r from-orange-200 to-yellow-200 bg-clip-text text-transparent">
                      finanças
                    </span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="absolute bottom-2 left-0 w-full h-3 bg-orange-400/30 -z-10"
                    />
                  </span>{" "}
                  com facilidade
                </motion.h1>
                
                <motion.p 
                  variants={fadeInUp}
                  className="text-xl text-purple-100 max-w-2xl mx-auto lg:mx-0"
                >
                  Transforme sua vida financeira com o XPensive Control. 
                  Controle gastos, monitore economias e alcance seus objetivos 
                  com uma plataforma moderna e intuitiva.
                </motion.p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status === "authenticated" ? (
                    <Button 
                      size="lg" 
                      className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-purple-50 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                      onClick={() => router.push("/dashboard")}
                    >
                      <span className="flex items-center gap-2">
                        Acessar Dashboard
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </Button>
                  ) : (
                    <Button size="lg" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-purple-50 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        Começar Agora - Grátis
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                variants={fadeInUp}
                className="grid grid-cols-3 gap-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-purple-200">Gratuito</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">10k+</div>
                  <div className="text-sm text-purple-200">Usuários</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold">
                    <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                    5.0
                  </div>
                  <div className="text-sm text-purple-200">Avaliação</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Image Section */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative p-8"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"
                  alt="Dashboard de Finanças"
                  width={700}
                  height={500}
                  className="w-full h-auto rounded-2xl"
                  priority
                />
              </div>
              
              {/* Floating Cards Animados - Externos à imagem */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="absolute top-2 left-2 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Economia</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">+28%</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Saldo</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">R$ 12.5k</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="currentColor" className="text-white dark:text-gray-900"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Funcionalidades
              </span>{" "}
              <span className="text-slate-900 dark:text-white">que fazem a diferença</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Descubra como o XPensive Control pode revolucionar sua gestão financeira
            </p>
          </motion.div>

          <motion.div 
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <BarChart3 className="h-7 w-7" />,
                title: "Gráficos Interativos",
                description: "Visualize seus dados com gráficos modernos e interativos. Entenda padrões de gastos facilmente.",
                gradient: "from-purple-500 to-purple-600",
                color: "purple"
              },
              {
                icon: <Target className="h-7 w-7" />,
                title: "Metas Inteligentes",
                description: "Defina objetivos financeiros e acompanhe seu progresso em tempo real com alertas personalizados.",
                gradient: "from-orange-500 to-orange-600",
                color: "orange"
              },
              {
                icon: <LineChart className="h-7 w-7" />,
                title: "Análises Detalhadas",
                description: "Relatórios completos por categoria, período e tipo. Insights que realmente fazem diferença.",
                gradient: "from-green-500 to-emerald-600",
                color: "green"
              },
              {
                icon: <Shield className="h-7 w-7" />,
                title: "Segurança Total",
                description: "Autenticação Google OAuth2, validações robustas e proteção total dos seus dados financeiros.",
                gradient: "from-blue-500 to-blue-600",
                color: "blue"
              },
              {
                icon: <Smartphone className="h-7 w-7" />,
                title: "Mobile First",
                description: "Interface 100% responsiva. Acesse de qualquer lugar, qualquer hora, qualquer dispositivo.",
                gradient: "from-pink-500 to-rose-600",
                color: "pink"
              },
              {
                icon: <CreditCard className="h-7 w-7" />,
                title: "Exportação de Dados",
                description: "Exporte suas transações em CSV ou PDF. Compartilhe com seu contador facilmente.",
                gradient: "from-indigo-500 to-purple-600",
                color: "indigo"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="space-y-4">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-${feature.color}-500/50`}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Interface{" "}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                Premium
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Design moderno e profissional que facilita sua gestão financeira
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                  alt="Dashboard Analytics"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Dashboard Completo</h3>
                    <p className="text-white/90">Visualize tudo em um só lugar</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="Financial Charts"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Gráficos Avançados</h3>
                    <p className="text-white/90">Análises visuais poderosas</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={benefitsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-8">
                Por que escolher o{" "}
                <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                  XPensive Control
                </span>
                ?
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="h-5 w-5" />,
                    title: "Interface Premium",
                    description: "Design moderno com animações suaves, gráficos interativos e experiência de uso excepcional."
                  },
                  {
                    icon: <BarChart3 className="h-5 w-5" />,
                    title: "Relatórios Poderosos",
                    description: "Visualize seus gastos por categoria, compare períodos e exporte dados em CSV ou PDF."
                  },
                  {
                    icon: <Shield className="h-5 w-5" />,
                    title: "Segurança Garantida",
                    description: "Autenticação OAuth2, validação de dados com Zod e proteção total das suas informações."
                  },
                  {
                    icon: <Target className="h-5 w-5" />,
                    title: "Controle Total",
                    description: "Busca avançada, filtros inteligentes e gestão completa das suas finanças em tempo real."
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={benefitsInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status === "authenticated" ? (
                    <Button 
                      size="lg" 
                      className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                      onClick={() => router.push("/dashboard")}
                    >
                      <span className="flex items-center gap-2">
                        Acessar Dashboard
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </Button>
                  ) : (
                    <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        Começar Gratuitamente
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                </motion.div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  ✨ Sem cartão de crédito. Sem taxa. 100% gratuito.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={benefitsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80"
                  alt="Gestão Financeira"
                  width={700}
                  height={500}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm font-medium">Saldo Disponível</span>
                          <span className="text-3xl font-bold">R$ 18.547</span>
                        </div>
                        
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={benefitsInView ? { width: "75%" } : {}}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <div className="text-2xl font-bold text-green-400">+R$ 4.8k</div>
                            <div className="text-sm text-white/80">Receitas</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-400">-R$ 2.3k</div>
                            <div className="text-sm text-white/80">Despesas</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-orange-400 rounded-3xl opacity-20 blur-2xl"
              />
              <motion.div
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-orange-400 to-purple-400 rounded-3xl opacity-20 blur-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-orange-500" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => {
            // Posições fixas para evitar erro de hidratação
            const positions = [
              { left: 10, top: 20 },
              { left: 25, top: 50 },
              { left: 40, top: 15 },
              { left: 55, top: 70 },
              { left: 70, top: 30 },
              { left: 85, top: 60 },
              { left: 15, top: 80 },
              { left: 30, top: 35 },
              { left: 45, top: 90 },
              { left: 60, top: 45 },
              { left: 75, top: 25 },
              { left: 90, top: 75 },
              { left: 5, top: 55 },
              { left: 35, top: 10 },
              { left: 50, top: 65 },
              { left: 65, top: 40 },
              { left: 80, top: 85 },
              { left: 20, top: 70 },
              { left: 95, top: 35 },
              { left: 12, top: 45 },
            ];
            const pos = positions[i % positions.length];
            
            return (
              <motion.div
                key={i}
                className="absolute w-32 h-32 bg-white rounded-full"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 5 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            );
          })}
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span>Avaliado 5.0 por nossos usuários</span>
              </div>
            </motion.div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Pronto para transformar{" "}
              <motion.span
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="inline-block bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200 bg-clip-text text-transparent"
                style={{ backgroundSize: "200% 200%" }}
              >
                suas finanças
              </motion.span>
              ?
            </h2>
            
            <p className="text-xl lg:text-2xl text-purple-100 mb-10 max-w-2xl mx-auto">
              Junte-se a <strong>milhares de usuários</strong> que já estão no controle total de suas finanças
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status === "authenticated" ? (
                  <Button 
                    size="lg" 
                    className="text-xl px-12 py-8 bg-white text-purple-600 hover:bg-purple-50 shadow-2xl hover:shadow-white/50 transition-all duration-300 group"
                    onClick={() => router.push("/dashboard")}
                  >
                    <span className="flex items-center gap-2">
                      Acessar Dashboard
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </span>
                  </Button>
                ) : (
                  <Button size="lg" className="text-xl px-12 py-8 bg-white text-purple-600 hover:bg-purple-50 shadow-2xl hover:shadow-white/50 transition-all duration-300 group">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      Começar Agora - É Gratuito
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </Link>
                  </Button>
                )}
              </motion.div>
            </div>

            <p className="text-purple-200 mt-6 text-sm">
              ✨ Sem cartão de crédito • Sem taxa de cancelamento • 100% Gratuito
            </p>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-8 mt-12 flex-wrap"
            >
              {[
                { icon: <Shield className="w-6 h-6" />, text: "Dados Seguros" },
                { icon: <Zap className="w-6 h-6" />, text: "Setup em 2min" },
                { icon: <Users className="w-6 h-6" />, text: "10k+ Usuários" }
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  {badge.icon}
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
