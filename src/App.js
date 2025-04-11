import React, { useState, useEffect } from "react";

export default function App() {
  const [compras, setCompras] = useState([]);
  const [compraParaEditar, setCompraParaEditar] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("data-desc");
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(true);
  
  // Estado para controlar o mês e ano selecionados
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
  
  const [form, setForm] = useState({
    id: null,
    data: "",
    descricao: "",
    parcelas: 1,
    valor: "",
    quem: ""
  });

  useEffect(() => {
    const data = localStorage.getItem("compras");
    if (data) setCompras(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("compras", JSON.stringify(compras));
  }, [compras]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (form.id) {
      // Edição
      setCompras(compras.map(comp => comp.id === form.id ? { ...form } : comp));
    } else {
      // Nova compra
      const novaCompra = { 
        ...form, 
        id: Date.now().toString(), 
        dataRegistro: new Date().toISOString() 
      };
      setCompras([...compras, novaCompra]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: null,
      data: "",
      descricao: "",
      parcelas: 1,
      valor: "",
      quem: ""
    });
    setCompraParaEditar(null);
  };

  const editarCompra = (compra) => {
    setCompraParaEditar(compra);
    setForm({
      id: compra.id,
      data: compra.data,
      descricao: compra.descricao,
      parcelas: compra.parcelas,
      valor: compra.valor,
      quem: compra.quem
    });
  };

  const excluirCompra = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta compra?")) {
      setCompras(compras.filter(c => c.id !== id));
    }
  };

  // Função para calcular a parcela atual de uma compra
  const calcularParcelaAtual = (dataCompra, totalParcelas) => {
    const hoje = new Date();
    const compra = new Date(dataCompra);
    const diffMeses = (hoje.getFullYear() - compra.getFullYear()) * 12 + 
                       (hoje.getMonth() - compra.getMonth());
    return Math.min(Math.max(1, diffMeses + 1), parseInt(totalParcelas));
  };

  // Função para calcular a parcela para um mês/ano específico
  const calcularParcelaPorMes = (dataCompra, totalParcelas, mesSelecionado, anoSelecionado) => {
    const compra = new Date(dataCompra);
    const diffMeses = (anoSelecionado - compra.getFullYear()) * 12 + 
                       (mesSelecionado - compra.getMonth());
    return diffMeses + 1; // +1 porque a primeira parcela é no mês da compra
  };

  // Verifica se uma parcela deve ser paga em um determinado mês/ano
  const parcelaNoMes = (dataCompra, totalParcelas, mesSelecionado, anoSelecionado) => {
    const parcela = calcularParcelaPorMes(dataCompra, totalParcelas, mesSelecionado, anoSelecionado);
    return parcela >= 1 && parcela <= parseInt(totalParcelas);
  };

  const valorParcela = (valor, parcelas) => {
    return (parseFloat(valor) / parseInt(parcelas)).toFixed(2);
  };

  // Filtra as compras para mostrar apenas as relevantes para o mês selecionado
  const comprasFiltradas = compras
    .filter(c => {
      // Verificar se a compra tem parcela neste mês
      const temParcelaNesteMes = parcelaNoMes(c.data, c.parcelas, mesSelecionado, anoSelecionado);
      
      // Aplicar o filtro de texto
      const atendeFiltroBusca = c.descricao.toLowerCase().includes(filtro.toLowerCase()) || 
                                c.quem.toLowerCase().includes(filtro.toLowerCase());
      
      return (mostrarFinalizadas || temParcelaNesteMes) && atendeFiltroBusca;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case "data-asc":
          return new Date(a.data) - new Date(b.data);
        case "data-desc":
          return new Date(b.data) - new Date(a.data);
        case "valor-asc":
          return parseFloat(a.valor) - parseFloat(b.valor);
        case "valor-desc":
          return parseFloat(b.valor) - parseFloat(a.valor);
        default:
          return new Date(b.data) - new Date(a.data);
      }
    });

  // Calcula os totais para o mês selecionado
  const calcularTotais = () => {
    let totalJoao = 0;
    let totalVoce = 0;
    let totalGeral = 0;
    
    compras.forEach(compra => {
      // Pular compras sem data ou valores inválidos
      if (!compra.data || !compra.valor || !compra.parcelas) return;
      
      // Verificar se tem parcela no mês selecionado
      if (parcelaNoMes(compra.data, compra.parcelas, mesSelecionado, anoSelecionado)) {
        const valorParcelaAtual = parseFloat(valorParcela(compra.valor, compra.parcelas));
        
        if (compra.quem === "João") {
          totalJoao += valorParcelaAtual;
        } else if (compra.quem === "Marcos") {
          totalVoce += valorParcelaAtual;
        }
        
        totalGeral += valorParcelaAtual;
      }
    });
    
    return { totalJoao, totalVoce, totalGeral };
  };

  const { totalJoao, totalVoce, totalGeral } = calcularTotais();

  // Função para avançar ou voltar meses
  const mudarMes = (delta) => {
    let novoMes = mesSelecionado + delta;
    let novoAno = anoSelecionado;
    
    if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1;
    } else if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1;
    }
    
    setMesSelecionado(novoMes);
    setAnoSelecionado(novoAno);
  };

  // Array com os nomes dos meses em português
  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Controle de Cartão Compartilhado</h1>
        
        {/* Navegação de meses */}
        <div className="flex justify-center items-center mb-6">
          <button 
            onClick={() => mudarMes(-1)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-l hover:bg-blue-600"
          >
            &#8592; Mês Anterior
          </button>
          <div className="bg-gray-100 px-6 py-2 font-semibold">
            {nomesMeses[mesSelecionado]} / {anoSelecionado}
            {(mesSelecionado === hoje.getMonth() && anoSelecionado === hoje.getFullYear()) && 
              <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded">Atual</span>
            }
          </div>
          <button 
            onClick={() => mudarMes(1)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Próximo Mês &#8594;
          </button>
        </div>
        
        {/* Resumo financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
            <h3 className="font-semibold text-lg">Total João</h3>
            <p className="text-2xl font-bold text-blue-600">R${totalJoao.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow text-center">
            <h3 className="font-semibold text-lg">Total Marcos</h3>
            <p className="text-2xl font-bold text-green-600">R${totalVoce.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow text-center">
            <h3 className="font-semibold text-lg">Total Geral</h3>
            <p className="text-2xl font-bold text-purple-600">R${totalGeral.toFixed(2)}</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {compraParaEditar ? "Editar Compra" : "Adicionar Nova Compra"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input 
                type="date" 
                name="data" 
                value={form.data} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input 
                type="text" 
                name="descricao" 
                placeholder="Ex: Mercado, Netflix, etc." 
                value={form.descricao} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
              <input 
                type="number" 
                min="1"
                name="parcelas" 
                placeholder="Número de parcelas" 
                value={form.parcelas} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                name="valor" 
                placeholder="Valor total da compra" 
                value={form.valor} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quem Pagou</label>
              <select 
                name="quem" 
                value={form.quem} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Selecione</option>
                <option value="João">João</option>
                <option value="Marcos">Marcos</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            {compraParaEditar && (
              <button 
                type="button" 
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
              >
                Cancelar
              </button>
            )}
            <button 
              type="submit" 
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {compraParaEditar ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </form>

        {/* Filtros e controles */}
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Filtrar por descrição ou pessoa..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-row gap-2">
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="data-desc">Data (mais recente)</option>
              <option value="data-asc">Data (mais antiga)</option>
              <option value="valor-desc">Valor (maior)</option>
              <option value="valor-asc">Valor (menor)</option>
            </select>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={mostrarFinalizadas}
                onChange={() => setMostrarFinalizadas(!mostrarFinalizadas)}
                className="mr-2"
              />
              Mostrar todas
            </label>
          </div>
        </div>

        {/* Tabela de compras */}
        <div className="overflow-x-auto">
          {comprasFiltradas.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Data</th>
                  <th className="py-2 px-4 border-b text-left">Descrição</th>
                  <th className="py-2 px-4 border-b text-left">Valor Total</th>
                  <th className="py-2 px-4 border-b text-left">Parcela</th>
                  <th className="py-2 px-4 border-b text-left">Valor/Mês</th>
                  <th className="py-2 px-4 border-b text-left">Quem</th>
                  <th className="py-2 px-4 border-b text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {comprasFiltradas.map((c) => {
                  const parcelaNoMesSelecionado = calcularParcelaPorMes(c.data, c.parcelas, mesSelecionado, anoSelecionado);
                  const parcelaAtiva = parcelaNoMesSelecionado >= 1 && parcelaNoMesSelecionado <= parseInt(c.parcelas);
                  const valorMensal = valorParcela(c.valor, c.parcelas);
                  
                  return (
                    <tr 
                      key={c.id} 
                      className={!parcelaAtiva ? "bg-gray-50 opacity-60" : parcelaNoMesSelecionado === parseInt(c.parcelas) ? "bg-green-50" : ""}
                    >
                      <td className="py-2 px-4 border-b">
                        {new Date(c.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-2 px-4 border-b">{c.descricao}</td>
                      <td className="py-2 px-4 border-b">R${parseFloat(c.valor).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {parcelaAtiva ? `${parcelaNoMesSelecionado}/${c.parcelas}` : "—"}
                            </div>
                            {parcelaAtiva && (
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className={`h-2 rounded-full ${parcelaNoMesSelecionado === parseInt(c.parcelas) ? "bg-green-500" : "bg-blue-500"}`}
                                  style={{ width: `${(parcelaNoMesSelecionado / parseInt(c.parcelas)) * 100}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {parcelaAtiva ? `R$${valorMensal}` : "—"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span 
                          className={`px-2 py-1 rounded text-white ${c.quem === "João" ? "bg-blue-500" : "bg-green-500"}`}
                        >
                          {c.quem}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => editarCompra(c)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => excluirCompra(c.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded">
              <p>Nenhuma compra encontrada para {nomesMeses[mesSelecionado]} de {anoSelecionado}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}