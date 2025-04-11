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
  
  // Estado para armazenar os nomes dos usuários
  const [usuarios, setUsuarios] = useState(() => {
    const savedUsuarios = localStorage.getItem("usuarios");
    return savedUsuarios ? JSON.parse(savedUsuarios) : ["Usuário 1", "Usuário 2"];
  });
  
  const [novoUsuario, setNovoUsuario] = useState("");
  const [mostrarModalUsuarios, setMostrarModalUsuarios] = useState(false);
  
  const [form, setForm] = useState({
    id: null,
    data: "",
    descricao: "",
    parcelas: 1,
    valor: "",
    quem: "", // Quem pagou inicialmente
    compartilhada: false, // Nova propriedade para indicar se é compartilhada
    divisao: [ // Nova propriedade para definir a divisão da compra
      { usuario: "", percentual: 100 }
    ]
  });

  useEffect(() => {
    const data = localStorage.getItem("compras");
    if (data) setCompras(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("compras", JSON.stringify(compras));
  }, [compras]);
  
  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "compartilhada") {
      // Se estiver marcando como compartilhada, inicializa a divisão
      if (checked && !form.divisao.length) {
        setForm({
          ...form,
          compartilhada: checked,
          divisao: usuarios.map((usuario, index) => ({
            usuario,
            percentual: index === 0 ? 100 : 0
          }))
        });
      } else {
        setForm({ ...form, compartilhada: checked });
      }
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };
  
  const handleDivisaoChange = (index, campo, valor) => {
    const novasDivisoes = [...form.divisao];
    novasDivisoes[index] = { ...novasDivisoes[index], [campo]: valor };
    
    // Ajusta os percentuais para garantir que somem 100%
    if (campo === "percentual") {
      const total = novasDivisoes.reduce((sum, item, idx) => 
        idx === index ? sum + parseInt(valor || 0) : sum + parseInt(item.percentual || 0), 0);
      
      if (total > 100) {
        // Se passou de 100%, ajusta proporcionalmente os outros valores
        const excesso = total - 100;
        const outrosTotal = total - parseInt(valor || 0);
        
        if (outrosTotal > 0) {
          novasDivisoes.forEach((item, idx) => {
            if (idx !== index) {
              const percentualAtual = parseInt(item.percentual || 0);
              const reducao = Math.min(percentualAtual, Math.round((percentualAtual / outrosTotal) * excesso));
              novasDivisoes[idx].percentual = Math.max(0, percentualAtual - reducao).toString();
            }
          });
        } else {
          novasDivisoes[index].percentual = "100";
        }
      }
    }
    
    setForm({ ...form, divisao: novasDivisoes });
  };
  
  const adicionarDivisao = () => {
    // Encontra um usuário que ainda não está na divisão
    const usuariosAtuais = form.divisao.map(d => d.usuario);
    const usuarioDisponivel = usuarios.find(u => !usuariosAtuais.includes(u));
    
    if (usuarioDisponivel) {
      const novasDivisoes = [...form.divisao, { usuario: usuarioDisponivel, percentual: 0 }];
      setForm({ ...form, divisao: novasDivisoes });
    }
  };
  
  const removerDivisao = (index) => {
    if (form.divisao.length > 1) {
      const novasDivisoes = form.divisao.filter((_, idx) => idx !== index);
      
      // Recalcula para garantir que totalize 100%
      const totalAtual = novasDivisoes.reduce((sum, item) => sum + parseInt(item.percentual || 0), 0);
      if (totalAtual < 100 && novasDivisoes.length > 0) {
        // Adiciona a diferença ao primeiro item
        const diferenca = 100 - totalAtual;
        novasDivisoes[0].percentual = (parseInt(novasDivisoes[0].percentual || 0) + diferenca).toString();
      }
      
      setForm({ ...form, divisao: novasDivisoes });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Normalizar os dados do formulário
    const formProcessado = { ...form };
    
    // Se não for compartilhada, garantir que a divisão seja ajustada
    if (!formProcessado.compartilhada) {
      formProcessado.divisao = [{ usuario: formProcessado.quem, percentual: 100 }];
    } else {
      // Garantir que a divisão some 100%
      const totalPercentual = formProcessado.divisao.reduce((sum, item) => sum + parseInt(item.percentual || 0), 0);
      
      if (totalPercentual !== 100) {
        const diferenca = 100 - totalPercentual;
        // Adiciona a diferença ao maior percentual
        let maiorIndex = 0;
        let maiorValor = 0;
        
        formProcessado.divisao.forEach((item, index) => {
          const percentual = parseInt(item.percentual || 0);
          if (percentual > maiorValor) {
            maiorValor = percentual;
            maiorIndex = index;
          }
        });
        
        formProcessado.divisao[maiorIndex].percentual = (parseInt(formProcessado.divisao[maiorIndex].percentual || 0) + diferenca).toString();
      }
    }
    
    if (form.id) {
      // Edição
      setCompras(compras.map(comp => comp.id === form.id ? { ...formProcessado } : comp));
    } else {
      // Nova compra
      const novaCompra = { 
        ...formProcessado, 
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
      quem: "",
      compartilhada: false,
      divisao: [{ usuario: "", percentual: 100 }]
    });
    setCompraParaEditar(null);
  };

  const editarCompra = (compra) => {
    setCompraParaEditar(compra);
    
    // Garantir que a compra tenha as novas propriedades
    const compraCompleta = {
      ...compra,
      compartilhada: compra.compartilhada || false,
      divisao: compra.divisao || [{ usuario: compra.quem, percentual: 100 }]
    };
    
    setForm(compraCompleta);
  };

  const excluirCompra = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta compra?")) {
      setCompras(compras.filter(c => c.id !== id));
    }
  };
  
  const adicionarUsuario = () => {
    if (novoUsuario.trim() && !usuarios.includes(novoUsuario.trim())) {
      setUsuarios([...usuarios, novoUsuario.trim()]);
      setNovoUsuario("");
    }
  };
  
  const removerUsuario = (usuario) => {
    if (usuarios.length > 2) {
      if (window.confirm(`Tem certeza que deseja remover "${usuario}"?`)) {
        setUsuarios(usuarios.filter(u => u !== usuario));
        
        // Atualiza as compras que usam este usuário
        setCompras(compras.map(compra => {
          // Se o pagador for o usuário removido, substitui pelo primeiro da lista
          const novaCompra = { ...compra };
          if (novaCompra.quem === usuario) {
            const novoQuem = usuarios.find(u => u !== usuario);
            novaCompra.quem = novoQuem || usuarios[0];
          }
          
          // Atualiza divisões se existirem
          if (novaCompra.divisao) {
            novaCompra.divisao = novaCompra.divisao.map(div => {
              if (div.usuario === usuario) {
                return { ...div, usuario: usuarios.find(u => u !== usuario) || usuarios[0] };
              }
              return div;
            });
          }
          
          return novaCompra;
        }));
      }
    } else {
      alert("É necessário manter pelo menos dois usuários.");
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
                                (c.quem && c.quem.toLowerCase().includes(filtro.toLowerCase())) ||
                                (c.divisao && c.divisao.some(d => d.usuario.toLowerCase().includes(filtro.toLowerCase())));
      
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
    // Inicializa um objeto para guardar os totais por usuário
    const totaisPorUsuario = {};
    usuarios.forEach(usuario => {
      totaisPorUsuario[usuario] = 0;
    });
    
    let totalGeral = 0;
    
    compras.forEach(compra => {
      // Pular compras sem data ou valores inválidos
      if (!compra.data || !compra.valor || !compra.parcelas) return;
      
      // Verificar se tem parcela no mês selecionado
      if (parcelaNoMes(compra.data, compra.parcelas, mesSelecionado, anoSelecionado)) {
        const valorParcelaAtual = parseFloat(valorParcela(compra.valor, compra.parcelas));
        
        // Se for compartilhada, divide conforme os percentuais
        if (compra.compartilhada && compra.divisao && compra.divisao.length > 0) {
          compra.divisao.forEach(div => {
            const percentual = parseInt(div.percentual || 0) / 100;
            const valorUsuario = valorParcelaAtual * percentual;
            
            if (totaisPorUsuario[div.usuario] !== undefined) {
              totaisPorUsuario[div.usuario] += valorUsuario;
            } else {
              // Se o usuário não existir mais, adiciona ao total do pagador
              if (totaisPorUsuario[compra.quem] !== undefined) {
                totaisPorUsuario[compra.quem] += valorUsuario;
              }
            }
          });
        } else if (totaisPorUsuario[compra.quem] !== undefined) {
          // Se não for compartilhada, adiciona tudo para quem pagou
          totaisPorUsuario[compra.quem] += valorParcelaAtual;
        }
        
        totalGeral += valorParcelaAtual;
      }
    });
    
    return { totaisPorUsuario, totalGeral };
  };

  const { totaisPorUsuario, totalGeral } = calcularTotais();

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
  
  // Gerar cores para os usuários
  const coresUsuarios = {
    [usuarios[0]]: "bg-blue-500 text-white",
    [usuarios[1]]: "bg-green-500 text-white",
  };
  
  // Para usuários adicionais, gerar cores aleatórias
  usuarios.slice(2).forEach((usuario, index) => {
    const cores = [
      "bg-purple-500 text-white",
      "bg-yellow-500 text-black",
      "bg-red-500 text-white",
      "bg-indigo-500 text-white",
      "bg-pink-500 text-white",
      "bg-teal-500 text-white"
    ];
    coresUsuarios[usuario] = cores[index % cores.length];
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Controle de Cartão Compartilhado</h1>
          <button
            onClick={() => setMostrarModalUsuarios(true)}
            className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 text-sm"
          >
            Gerenciar Usuários
          </button>
        </div>
        
        {/* Modal de Gerenciamento de Usuários */}
        {mostrarModalUsuarios && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Gerenciar Usuários</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar Novo Usuário</label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={novoUsuario} 
                    onChange={(e) => setNovoUsuario(e.target.value)} 
                    placeholder="Nome do usuário" 
                    className="flex-1 p-2 border border-gray-300 rounded-l"
                  />
                  <button 
                    onClick={adicionarUsuario}
                    className="bg-blue-600 text-white py-2 px-4 rounded-r hover:bg-blue-700"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Usuários Atuais</h3>
                <ul className="divide-y divide-gray-200">
                  {usuarios.map((usuario, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <span className={`px-2 py-1 rounded ${coresUsuarios[usuario]}`}>{usuario}</span>
                      <button 
                        onClick={() => removerUsuario(usuario)}
                        className="text-red-500 hover:text-red-700"
                        disabled={usuarios.length <= 2}
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setMostrarModalUsuarios(false)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
        
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {usuarios.map((usuario, index) => (
            <div key={index} className={`p-4 rounded-lg shadow text-center ${index % 2 === 0 ? 'bg-blue-50' : 'bg-green-50'}`}>
              <h3 className="font-semibold text-lg">Total {usuario}</h3>
              <p className={`text-2xl font-bold ${index % 2 === 0 ? 'text-blue-600' : 'text-green-600'}`}>
                R${totaisPorUsuario[usuario].toFixed(2)}
              </p>
            </div>
          ))}
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
                {usuarios.map((usuario, index) => (
                  <option key={index} value={usuario}>{usuario}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center py-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="compartilhada"
                  checked={form.compartilhada}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Compra compartilhada</span>
              </label>
            </div>
          </div>
          
          {/* Seção de divisão da compra */}
          {form.compartilhada && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Divisão da Compra</h3>
                <button 
                  type="button"
                  onClick={adicionarDivisao}
                  disabled={form.divisao.length >= usuarios.length}
                  className={`text-sm ${form.divisao.length >= usuarios.length ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  + Adicionar Usuário
                </button>
              </div>
              
              <div className="space-y-2">
                {form.divisao.map((div, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded">
                    <select
                      value={div.usuario}
                      onChange={(e) => handleDivisaoChange(index, "usuario", e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded"
                    >
                      <option value="">Selecione um usuário</option>
                      {usuarios.map((usuario, i) => (
                        <option 
                          key={i} 
                          value={usuario}
                          disabled={form.divisao.some((d, idx) => idx !== index && d.usuario === usuario)}
                        >
                          {usuario}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={div.percentual}
                        onChange={(e) => handleDivisaoChange(index, "percentual", e.target.value)}
                        className="w-16 p-2 border border-gray-300 rounded"
                      />
                      <span>%</span>
                    </div>
                    
                    {form.divisao.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removerDivisao(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                Total: {form.divisao.reduce((total, div) => total + parseInt(div.percentual || 0), 0)}%
                {form.divisao.reduce((total, div) => total + parseInt(div.percentual || 0), 0) !== 100 && (
                  <span className="text-red-500 ml-2">Deve totalizar 100%</span>
                )}
              </div>
            </div>
          )}
          
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
              disabled={form.compartilhada && form.divisao.reduce((total, div) => total + parseInt(div.percentual || 0), 0) !== 100}
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