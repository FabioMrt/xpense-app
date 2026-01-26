type Transaction = {
  id: string;
  description: string;
  value: number;
  type: "ENTRADA" | "SAIDA";
  category: {
    name: string;
  } | null;
  date: Date | string;
};

export function exportToCSV(transactions: Transaction[], month: number, year: number) {
  // Cabeçalhos CSV
  const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
  
  // Converter transações para linhas CSV
  const rows = transactions.map((t) => {
    const date = new Date(t.date);
    const formattedDate = date.toLocaleDateString("pt-BR");
    const formattedValue = t.value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return [
      formattedDate,
      `"${t.description.replace(/"/g, '""')}"`, // Escapar aspas duplas
      t.category?.name || "Sem Categoria",
      t.type === "ENTRADA" ? "Entrada" : "Saída",
      formattedValue,
    ];
  });
  
  // Adicionar totais
  const entradaTotal = transactions
    .filter((t) => t.type === "ENTRADA")
    .reduce((acc, t) => acc + t.value, 0);
    
  const saidaTotal = transactions
    .filter((t) => t.type === "SAIDA")
    .reduce((acc, t) => acc + t.value, 0);
    
  const saldo = entradaTotal - saidaTotal;
  
  rows.push([]);
  rows.push(["", "", "", "Total Entradas", entradaTotal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })]);
  rows.push(["", "", "", "Total Saídas", saidaTotal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })]);
  rows.push(["", "", "", "Saldo", saldo.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })]);
  
  // Criar conteúdo CSV
  const csvContent = [
    headers.join(";"),
    ...rows.map((row) => row.join(";")),
  ].join("\n");
  
  // Criar Blob e baixar
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  link.setAttribute("href", url);
  link.setAttribute("download", `transacoes_${monthNames[month - 1]}_${year}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(transactions: Transaction[], month: number, year: number) {
  // Criar conteúdo HTML para impressão
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  const entradaTotal = transactions
    .filter((t) => t.type === "ENTRADA")
    .reduce((acc, t) => acc + t.value, 0);
    
  const saidaTotal = transactions
    .filter((t) => t.type === "SAIDA")
    .reduce((acc, t) => acc + t.value, 0);
    
  const saldo = entradaTotal - saidaTotal;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Relatório Financeiro - ${monthNames[month - 1]} ${year}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #1e40af;
          border-bottom: 2px solid #1e40af;
          padding-bottom: 10px;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        .summary-card {
          padding: 15px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .summary-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #64748b;
        }
        .summary-card p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .entrada { color: #10b981; }
        .saida { color: #ef4444; }
        .saldo { color: #3b82f6; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        th {
          background: #f1f5f9;
          font-weight: bold;
          color: #475569;
        }
        tr:hover {
          background: #f8fafc;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          color: #64748b;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .summary { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>XPense Control - Relatório Financeiro</h1>
      <p><strong>Período:</strong> ${monthNames[month - 1]} de ${year}</p>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Total de Entradas</h3>
          <p class="entrada">${entradaTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</p>
        </div>
        <div class="summary-card">
          <h3>Total de Saídas</h3>
          <p class="saida">${saidaTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</p>
        </div>
        <div class="summary-card">
          <h3>Saldo</h3>
          <p class="saldo">${saldo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th style="text-align: right;">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map(
              (t) => `
            <tr>
              <td>${new Date(t.date).toLocaleDateString("pt-BR")}</td>
              <td>${t.description}</td>
              <td>${t.category?.name || "Sem Categoria"}</td>
              <td>
                <span class="${t.type === "ENTRADA" ? "entrada" : "saida"}">
                  ${t.type === "ENTRADA" ? "Entrada" : "Saída"}
                </span>
              </td>
              <td style="text-align: right; font-weight: bold;" class="${
                t.type === "ENTRADA" ? "entrada" : "saida"
              }">
                ${t.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Relatório gerado em ${new Date().toLocaleString("pt-BR")}</p>
        <p>XPense Control - Seu controle financeiro pessoal</p>
      </div>
    </body>
    </html>
  `;
  
  // Abrir em nova janela para impressão
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Aguardar carregamento e imprimir
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
