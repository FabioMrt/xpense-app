import { Category } from './../../../generated/prisma/index.d';
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from '@/lib/prisma';
import { connect } from 'http2';


export async function POST (request: Request) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

 
      
      const { description, value, type, category, date} = await request.json();

      if (!description || !value || !type || !category || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const categoriaExistente = await prisma.category.findFirst({
        where: {name: category}
    })

    if (!categoriaExistente) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    const novaTransacao = await prisma.transaction.create({
        data: {
            description, 
            value: parseFloat(value),
            type,
            date: new Date(date),
            category: {
                connect: { id: categoriaExistente.id}
            },
            user: {
                connect: {id: session.user.id}
            }
        }
    })

    return NextResponse.json(novaTransacao, {status: 201});

  } catch (error) {
    console.error("Erro ao cadastrar transação:", error);
    return NextResponse.json({ error: "Erro ao cadastrar transação" }, { status: 500 });
  }
      
  


    
}


export async function GET(request: Request) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {searchParams} = new URL(request.url);
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);


    try {
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
        return NextResponse.json(transactions);
        
    } catch (error) {
        return NextResponse.json({error: "Erro ao buscar transacoes"}, { status: 500})
        
    }
}

export async function DELETE(request: NextRequest) {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {searchParams} = new URL(request.url);
  const transactionId = searchParams.get("id");

  if (!transactionId) {
    return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
  }

  try {
    const deleted = await prisma.transaction.delete({
      where: {
        id: transactionId
      }
    })
    return NextResponse.json({ message: "Transação deletada com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return NextResponse.json({ error: "Erro ao deletar transação." }, { status: 500 });
  }
  
}


export async function PUT(request: Request){
    const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {id, description, value, type, category, date } = body;

  if (!id || !description || !value || !type || !category || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }


  try {
     const categoriaExistente = await prisma.category.findFirst({
      where: { name: category }
    });

    if (!categoriaExistente) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    const transacaoAtualizada = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        value: parseFloat(value),
        type,
        date: new Date(date),
        category: {
          connect: {id: categoriaExistente.id}
        }

      }
    })
    return NextResponse.json(transacaoAtualizada, { status: 200 });

  } catch (error) {
    console.error("Erro ao editar transação:", error);
    return NextResponse.json({ error: "Erro ao editar transação" }, { status: 500 });
  }
}






