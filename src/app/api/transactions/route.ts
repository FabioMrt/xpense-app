import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from '@/lib/prisma';
import { TransactionSchema, UpdateTransactionSchema, TransactionQuerySchema } from '@/lib/validations/transaction';
import { ZodError, ZodIssue } from 'zod';


export async function POST (request: Request) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado. Faça login para continuar." }, { status: 401 });
  }

  try {
      const body = await request.json();
      
      // Validação com Zod
      const validatedData = TransactionSchema.parse(body);
      
      const { description, value, type, category, date } = validatedData;

    const categoriaExistente = await prisma.category.findFirst({
        where: {name: category}
    })

    if (!categoriaExistente) {
      return NextResponse.json({ 
        error: "Categoria não encontrada",
        message: `A categoria "${category}" não existe no sistema.` 
      }, { status: 404 });
    }

    const novaTransacao = await prisma.transaction.create({
        data: {
            description, 
            value,
            type,
            date,
            category: {
                connect: { id: categoriaExistente.id}
            },
            user: {
                connect: {id: session.user.id}
            }
        },
        include: {
          category: true
        }
    })

    return NextResponse.json({
      success: true,
      data: novaTransacao,
      message: "Transação criada com sucesso!"
    }, {status: 201});

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: "Dados inválidos",
        details: error.issues.map((e: ZodIssue) => ({
          field: e.path.join('.'),
          message: e.message
        }))
      }, { status: 400 });
    }
    
    console.error("Erro ao cadastrar transação:", error);
    return NextResponse.json({ 
      error: "Erro ao cadastrar transação",
      message: "Ocorreu um erro interno. Tente novamente." 
    }, { status: 500 });
  }
}


export async function GET(request: Request) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado. Faça login para continuar." }, { status: 401 });
  }

  try {
  const {searchParams} = new URL(request.url);
    
    // Validação dos parâmetros de query
    const queryData = TransactionQuerySchema.parse({
      month: searchParams.get("month"),
      year: searchParams.get("year")
    });

    const { month, year } = queryData;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

        const transactions = await prisma.transaction.findMany({
           where: {
            userId: session.user.id,
            date: {
              gte: start,
              lt: end,
            },
          },
          orderBy: { date: "desc" },
          include: { category: true },
        });
    
    // Calcular totais
    const totals = transactions.reduce((acc, t) => {
      if (t.type === "ENTRADA") {
        acc.entrada += t.value;
      } else {
        acc.saida += t.value;
      }
      return acc;
    }, { entrada: 0, saida: 0 });
    
    return NextResponse.json({
      success: true,
      data: transactions,
      totals: {
        ...totals,
        saldo: totals.entrada - totals.saida
      },
      meta: {
        month,
        year,
        count: transactions.length
      }
    });
        
    } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json({ 
            error: "Parâmetros inválidos",
            details: error.issues.map((e: ZodIssue) => ({
              field: e.path.join('.'),
              message: e.message
            }))
          }, { status: 400 });
        }
        
        console.error("Erro ao buscar transações:", error);
        return NextResponse.json({
          error: "Erro ao buscar transações",
          message: "Ocorreu um erro interno. Tente novamente."
        }, { status: 500 })
        
    }
}

export async function DELETE(request: NextRequest) {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado. Faça login para continuar." }, { status: 401 });
  }

  try {
  const {searchParams} = new URL(request.url);
  const transactionId = searchParams.get("id");

  if (!transactionId) {
      return NextResponse.json({ 
        error: "ID da transação não fornecido" 
      }, { status: 400 });
    }

    // Verificar se a transação pertence ao usuário
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!existingTransaction) {
      return NextResponse.json({ 
        error: "Transação não encontrada" 
      }, { status: 404 });
  }

    if (existingTransaction.userId !== session.user.id) {
      return NextResponse.json({ 
        error: "Você não tem permissão para deletar esta transação" 
      }, { status: 403 });
    }

    await prisma.transaction.delete({
      where: { id: transactionId }
    })
    
    return NextResponse.json({ 
      success: true,
      message: "Transação deletada com sucesso." 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return NextResponse.json({ 
      error: "Erro ao deletar transação",
      message: "Ocorreu um erro interno. Tente novamente."
    }, { status: 500 });
  }
  
}


export async function PUT(request: Request){
    const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado. Faça login para continuar." }, { status: 401 });
  }

  try {
  const body = await request.json();
    
    // Validação com Zod
    const validatedData = UpdateTransactionSchema.parse(body);
    const {id, description, value, type, category, date } = validatedData;

    // Verificar se a transação pertence ao usuário
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!existingTransaction) {
      return NextResponse.json({ 
        error: "Transação não encontrada" 
      }, { status: 404 });
    }

    if (existingTransaction.userId !== session.user.id) {
      return NextResponse.json({ 
        error: "Você não tem permissão para editar esta transação" 
      }, { status: 403 });
  }

     const categoriaExistente = await prisma.category.findFirst({
      where: { name: category }
    });

    if (!categoriaExistente) {
      return NextResponse.json({ 
        error: "Categoria não encontrada",
        message: `A categoria "${category}" não existe no sistema.`
      }, { status: 404 });
    }

    const transacaoAtualizada = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        value,
        type,
        date,
        category: {
          connect: {id: categoriaExistente.id}
        }
      },
      include: {
        category: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: transacaoAtualizada,
      message: "Transação atualizada com sucesso!"
    }, { status: 200 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: "Dados inválidos",
        details: error.issues.map((e: ZodIssue) => ({
          field: e.path.join('.'),
          message: e.message
        }))
      }, { status: 400 });
    }
    
    console.error("Erro ao editar transação:", error);
    return NextResponse.json({ 
      error: "Erro ao editar transação",
      message: "Ocorreu um erro interno. Tente novamente."
    }, { status: 500 });
  }
}






