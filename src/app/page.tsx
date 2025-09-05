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
  ArrowRight
} from "lucide-react";
import financasImg from '../assets/financas.jpg';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/20 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-300/20">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
                  Controle Financeiro Inteligente
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Gerencie suas{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    finanças
                  </span>{" "}
                  com facilidade
                </h1>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
                  Transforme sua vida financeira com o XPensive Control. 
                  Controle gastos, monitore economias e alcance seus objetivos financeiros 
                  de forma simples e intuitiva.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Começar Agora
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
                  <BarChart3 className="h-5 w-5" />
                  Ver Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Gratuito</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Disponível</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">⭐ 5.0</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Avaliação</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-violet-50 p-8 dark:from-blue-950 dark:to-violet-950">
                <Image
                  src={financasImg}
                  alt="Controle de Finanças"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-lg"
                  priority
                />
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Economia</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">+15%</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <PiggyBank className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Meta</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">R$ 2.5k</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Funcionalidades que fazem a diferença
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Descubra como o XPensive Control pode revolucionar sua gestão financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Controle de Gastos</CardTitle>
                <CardDescription>
                  Monitore todos os seus gastos em tempo real com categorização automática e relatórios detalhados.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <PiggyBank className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Metas de Economia</CardTitle>
                <CardDescription>
                  Defina objetivos financeiros e acompanhe seu progresso com visualizações motivadoras.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Análises Inteligentes</CardTitle>
                <CardDescription>
                  Insights personalizados sobre seus hábitos financeiros para tomar decisões mais inteligentes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Segurança Total</CardTitle>
                <CardDescription>
                  Seus dados financeiros protegidos com criptografia de ponta e backup automático.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <CardTitle>Acesso Mobile</CardTitle>
                <CardDescription>
                  Interface responsiva que funciona perfeitamente em qualquer dispositivo.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Suporte 24/7</CardTitle>
                <CardDescription>
                  Equipe dedicada para ajudar você a aproveitar ao máximo todas as funcionalidades.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Por que escolher o XPensive Control?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Interface Intuitiva</h3>
                    <p className="text-slate-600 dark:text-slate-300">Design clean e fácil de usar, mesmo para quem não tem experiência com apps financeiros.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Relatórios Detalhados</h3>
                    <p className="text-slate-600 dark:text-slate-300">Visualize seus gastos por categoria, período e receba insights valiosos sobre seus hábitos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Controle Total</h3>
                    <p className="text-slate-600 dark:text-slate-300">Tenha visibilidade completa das suas finanças e tome decisões baseadas em dados reais.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Começar Gratuitamente
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Saldo Total</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">R$ 15.847,32</span>
                    </div>
                    
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">+R$ 3.240</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Receitas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400">-R$ 1.856</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Gastos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já estão no controle de suas finanças
          </p>
          
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-slate-900 hover:bg-slate-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              Começar Agora - É Gratuito
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
