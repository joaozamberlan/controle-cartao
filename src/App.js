import React, { useState, useEffect } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Icon } from '@iconify/react'; // Instale com: npm install @iconify/react

const COLORS = [
  '#0088FE',  // Azul
  '#00C49F',  // Verde água
  '#FFBB28',  // Amarelo
  '#FF8042',  // Laranja
  '#8884D8',  // Roxo
  '#83A6ED',  // Azul claro
  '#8DD1E1',  // Ciano
  '#A4DE6C',  // Verde claro
  '#FF6B6B',  // Vermelho
  '#9775FA',  // Roxo claro
  '#FFA94D',  // Laranja claro
  '#F783AC',  // Rosa
  '#748FFC',  // Azul médio
  '#69DB7C',  // Verde médio
];

export default function App() {
  // 1. Constants
  const hoje = new Date();
  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // 2. States
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
  const [compras, setCompras] = useState(() => {
    const savedCompras = localStorage.getItem("compras");
    return savedCompras ? JSON.parse(savedCompras) : [];
  });
  const [usuarios, setUsuarios] = useState(() => {
    const savedUsuarios = localStorage.getItem("usuarios");
    return savedUsuarios ? JSON.parse(savedUsuarios) : ["Usuário 1", "Usuário 2"];
  });
  const [cartoes, setCartoes] = useState(() => {
    const savedCartoes = localStorage.getItem("cartoes");
    return savedCartoes ? JSON.parse(savedCartoes) : [];
  });
  const [categorias, setCategorias] = useState(() => {
    const savedCategorias = localStorage.getItem("categorias");
    return savedCategorias ? JSON.parse(savedCategorias) : [
      {
        id: "1",
        nome: "Alimentação",
        icone: "mdi:food",
        cor: "#0088FE",
        subcategorias: ["Mercado", "Restaurante", "Delivery"]
      },
      {
        id: "2",
        nome: "Transporte",
        icone: "mdi:car",
        cor: "#00C49F",
        subcategorias: ["Combustível", "Uber", "Manutenção"]
      },
      {
        id: "3",
        nome: "Academia",
        icone: "mdi:dumbbell",
        cor: "#FFBB28",
        subcategorias: ["Mensalidade", "Personal", "Suplementos"]
      },
      {
        id: "4",
        nome: "Jogos",
        icone: "mdi:gamepad-variant",
        cor: "#FF8042",
        subcategorias: ["Steam", "PlayStation", "Xbox"]
      },
      {
        id: "5",
        nome: "Viagens",
        icone: "mdi:airplane",
        cor: "#8884D8",
        subcategorias: ["Passagens", "Hospedagem", "Passeios"]
      },
      {
        id: "6",
        nome: "Saúde",
        icone: "mdi:hospital",
        cor: "#83A6ED",
        subcategorias: ["Consultas", "Medicamentos", "Exames"]
      },
      {
        id: "7",
        nome: "Educação",
        icone: "mdi:school",
        cor: "#8DD1E1",
        subcategorias: ["Cursos", "Livros", "Material"]
      },
      {
        id: "8",
        nome: "Assinaturas",
        icone: "mdi:playlist-check",
        cor: "#A4DE6C",
        subcategorias: ["Streaming", "Software", "Revistas"]
      },
      {
        id: "9",
        nome: "Reforma",
        icone: "mdi:hammer",
        cor: "#FF6B6B",
        subcategorias: ["Material", "Mão de obra", "Decoração"]
      },
      {
        id: "10",
        nome: "Móveis",
        icone: "mdi:sofa",
        cor: "#9775FA",
        subcategorias: ["Sala", "Quarto", "Escritório"]
      },
      {
        id: "11",
        nome: "Eletrônicos",
        icone: "mdi:cellphone",
        cor: "#FFA94D",
        subcategorias: ["Celular", "Computador", "Acessórios"]
      },
      {
        id: "12",
        nome: "Roupas",
        icone: "mdi:tshirt-crew",
        cor: "#F783AC",
        subcategorias: ["Casual", "Formal", "Esporte"]
      },
      {
        id: "13",
        nome: "Tênis",
        icone: "mdi:shoe-sneaker",
        cor: "#748FFC",
        subcategorias: ["Casual", "Esporte", "Social"]
      },
      {
        id: "14",
        nome: "Filhos",
        icone: "mdi:baby-carriage",
        cor: "#69DB7C",
        subcategorias: ["Escola", "Roupas", "Brinquedos"]
      }
    ];
  });
  const [comprasRecorrentes, setComprasRecorrentes] = useState(() => {
    const saved = localStorage.getItem("comprasRecorrentes");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Adicione este estado para controlar o modal
  const [mostrarModalRecorrentes, setMostrarModalRecorrentes] = useState(false);

  // Form states
  const [form, setForm] = useState({
    id: null,
    data: "",
    descricao: "",
    parcelas: 1,
    valor: "",
    quem: "",
    compartilhada: false,
    divisao: [{ usuario: "", percentual: 100 }],
    categoria: categorias[0]?.id || "",
    cartao: "",
    recorrente: false,
    frequencia: "mensal",
    diaVencimento: ""
  });

  // Filter states
  const [filtro, setFiltro] = useState("");
  const [filtroCartao, setFiltroCartao] = useState("");
  const [ordenacao, setOrdenacao] = useState("data-desc");
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(true);

  // Modal states
  const [mostrarModalUsuarios, setMostrarModalUsuarios] = useState(false);
  const [mostrarModalCartoes, setMostrarModalCartoes] = useState(false);
  const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
  const [compraParaEditar, setCompraParaEditar] = useState(null);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState(null);
  const [novoUsuario, setNovoUsuario] = useState("");
  const [novoCartao, setNovoCartao] = useState("");
  const [novaSubcategoria, setNovaSubcategoria] = useState("");
  const [novoFechamento, setNovoFechamento] = useState("");
  const [novoVencimento, setNovoVencimento] = useState("");

  // Adicione esses estados no início do componente, junto com os outros states:
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);

  // Adicione essa função para calcular o total de páginas:
  const calcularTotalPaginas = (listaFiltrada) => {
    return Math.ceil(listaFiltrada.length / itensPorPagina);
  };

  // 3. Helper functions
  const valorParcela = (valor, parcelas) => {
    return (parseFloat(valor) / parseInt(parcelas)).toFixed(2);
  };

  const parcelaNoMes = (dataCompra, totalParcelas, mesSelecionado, anoSelecionado, cartao) => {
    const dataAjustada = determinarMesCompra(dataCompra, cartao);
    const diffMeses = (anoSelecionado - dataAjustada.getFullYear()) * 12 + 
                     (mesSelecionado - dataAjustada.getMonth());
    const parcela = diffMeses + 1;
    return parcela >= 1 && parcela <= parseInt(totalParcelas);
  };

  const calcularParcelaPorMes = (dataCompra, totalParcelas, mesSelecionado, anoSelecionado) => {
    const compra = new Date(dataCompra);
    const diffMeses = (anoSelecionado - compra.getFullYear()) * 12 + 
                     (mesSelecionado - compra.getMonth());
    return diffMeses + 1;
  };

  const determinarMesCompra = (dataCompra, cartao) => {
    const data = new Date(dataCompra);
    const cartaoInfo = cartoes.find(c => c.nome === cartao);
    
    if (!cartaoInfo) return data;
  
    // Se a data da compra for depois do fechamento, a compra vai para o próximo mês
    if (data.getDate() > cartaoInfo.diaFechamento) {
      data.setMonth(data.getMonth() + 1);
    }
    
    return data;
  };

  const processarComprasRecorrentes = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    comprasRecorrentes.forEach(recorrente => {
      // Verifica se já existe uma compra para este mês
      const existeCompra = compras.some(compra => {
        const dataCompra = new Date(compra.data);
        return dataCompra.getMonth() === mesAtual &&
               dataCompra.getFullYear() === anoAtual &&
               compra.compraRecorrenteId === recorrente.id;
      });

      if (!existeCompra) {
        // Cria nova data mantendo o dia definido na recorrência
        const novaData = new Date(anoAtual, mesAtual, recorrente.diaVencimento);
        
        const novaCompra = {
          ...recorrente.dadosCompra,
          id: Date.now().toString(),
          data: novaData.toISOString().split('T')[0],
          compraRecorrenteId: recorrente.id,
          dataRegistro: new Date().toISOString()
        };

        setCompras(prev => [...prev, novaCompra]);
      }
    });
  };

  // 4. Funções que dependem dos estados
  const prepararDadosGraficos = () => {
    const dadosCategorias = {};
    const dadosUsuarios = {};
    const dadosCartoes = {};

    // Inicializar com todas as categorias
    categorias.forEach(cat => {
      dadosCategorias[cat.id] = {
        name: cat.nome,
        value: 0,
        cor: cat.cor
      };
    });

    usuarios.forEach(user => dadosUsuarios[user] = 0);
    // Use a propriedade nome do cartão como chave
    cartoes.forEach(card => dadosCartoes[card.nome] = 0);

    compras.forEach(compra => {
      if (parcelaNoMes(compra.data, compra.parcelas, mesSelecionado, anoSelecionado, compra.cartao)) {
        const valorParcelaAtual = parseFloat(valorParcela(compra.valor, compra.parcelas));
        
        const categoriaId = compra.categoria.split(':')[0];
        if (dadosCategorias[categoriaId]) {
          dadosCategorias[categoriaId].value += valorParcelaAtual;
        }

        // Usa o nome do cartão como chave
        if (dadosCartoes[compra.cartao] !== undefined) {
          dadosCartoes[compra.cartao] += valorParcelaAtual;
        }

        if (compra.compartilhada && compra.divisao) {
          compra.divisao.forEach(div => {
            const percentual = parseInt(div.percentual || 0) / 100;
            if (dadosUsuarios[div.usuario] !== undefined) {
              dadosUsuarios[div.usuario] += valorParcelaAtual * percentual;
            }
          });
        } else if (dadosUsuarios[compra.quem] !== undefined) {
          dadosUsuarios[compra.quem] += valorParcelaAtual;
        }
      }
    });

    return {
      categorias: Object.values(dadosCategorias).filter(item => item.value > 0),
      usuarios: Object.entries(dadosUsuarios)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0),
      cartoes: Object.entries(dadosCartoes)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0)
    };
  };

  const calcularTotais = () => {
    const totais = {
      totaisPorUsuario: {},
      totalGeral: 0
    };

    usuarios.forEach(usuario => {
      totais.totaisPorUsuario[usuario] = 0;
    });

    compras.forEach(compra => {
      if (parcelaNoMes(compra.data, compra.parcelas, mesSelecionado, anoSelecionado, compra.cartao)) {
        const valorParcelaAtual = parseFloat(valorParcela(compra.valor, compra.parcelas));

        if (compra.compartilhada && compra.divisao) {
          compra.divisao.forEach(div => {
            const percentual = parseInt(div.percentual || 0) / 100;
            if (totais.totaisPorUsuario[div.usuario] !== undefined) {
              totais.totaisPorUsuario[div.usuario] += valorParcelaAtual * percentual;
            }
          });
        } else if (totais.totaisPorUsuario[compra.quem] !== undefined) {
          totais.totaisPorUsuario[compra.quem] += valorParcelaAtual;
        }
      }
    });

    totais.totalGeral = Object.values(totais.totaisPorUsuario).reduce((a, b) => a + b, 0);
    return totais;
  };

  // 5. Form handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form data being submitted:', form);

    try {
      // More specific validation with helpful error messages
      const errors = [];
      if (!form.data) errors.push('Data é obrigatória');
      if (!form.descricao) errors.push('Descrição é obrigatória');
      if (!form.valor || parseFloat(form.valor) <= 0) errors.push('Valor deve ser maior que zero');
      if (!form.quem) errors.push('Selecione quem fez a compra');
      if (!form.cartao) errors.push('Selecione um cartão');
      if (!form.categoria) errors.push('Selecione uma categoria');

      if (errors.length > 0) {
        alert('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'));
        return;
      }

      // Ensure proper data types and default values
      const novaCompra = {
        ...form,
        id: form.id || Date.now().toString(),
        valor: parseFloat(form.valor) || 0,
        parcelas: parseInt(form.parcelas) || 1,
        dataRegistro: new Date().toISOString(),
        compartilhada: !!form.compartilhada,
        divisao: form.compartilhada ? form.divisao : [{ usuario: form.quem, percentual: 100 }]
      };

      // Validate division percentages if purchase is shared
      if (novaCompra.compartilhada) {
        const totalPercentual = novaCompra.divisao.reduce((acc, div) => acc + (parseInt(div.percentual) || 0), 0);
        if (totalPercentual !== 100) {
          alert('O total dos percentuais deve ser 100%');
          return;
        }
      }

      // Se for uma compra recorrente, salva nas recorrências
      if (form.recorrente) {
        const novaRecorrencia = {
          id: Date.now().toString(),
          diaVencimento: parseInt(form.diaVencimento),
          frequencia: form.frequencia,
          dadosCompra: novaCompra
        };
        
        setComprasRecorrentes(prev => [...prev, novaRecorrencia]);
      }

      setCompras(prevCompras => {
        const novasCompras = form.id 
          ? prevCompras.map(c => c.id === form.id ? novaCompra : c)
          : [...prevCompras, novaCompra];
        localStorage.setItem('compras', JSON.stringify(novasCompras));
        return novasCompras;
      });

      // Reset form after successful submission
      setForm({
        id: null,
        data: "",
        descricao: "",
        parcelas: 1,
        valor: "",
        quem: "",
        compartilhada: false,
        divisao: [{ usuario: "", percentual: 100 }],
        categoria: categorias[0]?.id || "",
        cartao: "",
        recorrente: false,
        frequencia: "mensal",
        diaVencimento: ""
      });
        
    } catch (error) {
      console.error('Erro ao salvar compra:', error);
      alert('Erro ao salvar a compra: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDivisaoChange = (index, field, value) => {
    setForm(prev => {
      const newDivisao = [...prev.divisao];
      newDivisao[index] = {
        ...newDivisao[index],
        [field]: value
      };
      return {
        ...prev,
        divisao: newDivisao
      };
    });
  };

  const handleAdicionarDivisao = () => {
    setForm(prev => ({
      ...prev,
      divisao: [...prev.divisao, { usuario: "", percentual: 0 }]
    }));
  };

  const handleRemoverDivisao = (index) => {
    setForm(prev => ({
      ...prev,
      divisao: prev.divisao.filter((_, i) => i !== index)
    }));
  };

  // 6. Effects
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

  useEffect(() => {
    localStorage.setItem("cartoes", JSON.stringify(cartoes));
  }, [cartoes]);

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    processarComprasRecorrentes();
  }, [mesSelecionado, anoSelecionado]); // Processa quando mudar o mês/ano

  useEffect(() => {
    localStorage.setItem("comprasRecorrentes", JSON.stringify(comprasRecorrentes));
  }, [comprasRecorrentes]);

  // ...resto do seu componente...

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Controle de Cartão Compartilhado</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setMostrarModalUsuarios(true)}
            className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 text-sm"
          >
            Gerenciar Usuários
          </button>
          <button
            onClick={() => setMostrarModalCartoes(true)}
            className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 text-sm"
          >
            Gerenciar Cartões
          </button>
          <button
            onClick={() => setMostrarModalCategorias(true)}
            className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700 text-sm"
          >
            Gerenciar Categorias
          </button>
          <button
            onClick={() => setMostrarModalRecorrentes(true)}
            className="bg-orange-600 text-white py-1 px-3 rounded hover:bg-orange-700 text-sm"
          >
            Gerenciar Recorrências
          </button>
        </div>
      </div>

      {/* Filtros e Controles */}
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
        
        <div className="w-48">
          <select
            value={filtroCartao}
            onChange={(e) => setFiltroCartao(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Todos os cartões</option>
            {Array.isArray(cartoes) && cartoes.map((cartao, index) => (
              <option key={index} value={cartao.nome}>{cartao.nome}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-row gap-2">
          <select
            value={`${mesSelecionado}-${anoSelecionado}`}
            onChange={(e) => {
              const [mes, ano] = e.target.value.split('-');
              setMesSelecionado(parseInt(mes));
              setAnoSelecionado(parseInt(ano));
            }}
            className="p-2 border border-gray-300 rounded"
          >
            {Array.from({ length: 24 }, (_, i) => {
              const data = new Date();
              data.setMonth(data.getMonth() - 12 + i);
              return {
                value: `${data.getMonth()}-${data.getFullYear()}`,
                label: `${nomesMeses[data.getMonth()]} ${data.getFullYear()}`
              };
            }).map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Totais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total do Mês</h3>
          <p className="text-2xl font-bold text-blue-600">
            R$ {calcularTotais().totalGeral.toFixed(2)}
          </p>
        </div>
        
        {usuarios.map((usuario, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">{usuario}</h3>
            <p className="text-2xl font-bold text-blue-600">
              R$ {calcularTotais().totaisPorUsuario[usuario]?.toFixed(2) || "0.00"}
            </p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráficos aqui */}
      </div>

      {/* Formulário de Nova Compra */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valor</label>
            <input
              type="number"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione...</option>
              {categorias.map((cat) => (
                <optgroup key={cat.id} label={cat.nome}>
                  <option value={cat.id}>{cat.nome}</option>
                  {cat.subcategorias.map((sub, index) => (
                    <option key={`${cat.id}-${index}`} value={`${cat.id}:${sub}`}>
                      {sub}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cartão</label>
            <select
              name="cartao"
              value={form.cartao}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione...</option>
              {cartoes.map((cartao, index) => (
                <option key={index} value={cartao.nome}>
                  {cartao.nome} (Fecha: {cartao.diaFechamento}, Vence: {cartao.diaVencimento})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parcelas</label>
            <input
              type="number"
              name="parcelas"
              value={form.parcelas}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quem comprou</label>
            <select
              name="quem"
              value={form.quem}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione...</option>
              {usuarios.map((usuario, index) => (
                <option key={index} value={usuario}>{usuario}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="compartilhada"
              checked={form.compartilhada}
              onChange={(e) => setForm({ ...form, compartilhada: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium">Compra compartilhada?</span>
          </label>
        </div>

        {form.compartilhada && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Divisão</h4>
            {form.divisao.map((div, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={div.usuario}
                  onChange={(e) => handleDivisaoChange(index, 'usuario', e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Selecione um usuário</option>
                  {usuarios.map((usuario, i) => (
                    <option key={i} value={usuario}>{usuario}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={div.percentual}
                  onChange={(e) => handleDivisaoChange(index, 'percentual', e.target.value)}
                  placeholder="Percentual"
                  className="w-24 p-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoverDivisao(index)}
                  className="text-red-500"
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAdicionarDivisao}
              className="text-blue-500 text-sm"
            >
              + Adicionar pessoa
            </button>
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              name="recorrente"
              checked={form.recorrente}
              onChange={(e) => setForm({ ...form, recorrente: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium">Compra Recorrente?</span>
          </label>

          {form.recorrente && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Frequência</label>
                <select
                  name="frequencia"
                  value={form.frequencia}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="mensal">Mensal</option>
                  <option value="bimestral">Bimestral</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dia do Vencimento</label>
                <input
                  type="number"
                  name="diaVencimento"
                  value={form.diaVencimento}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Dia do mês"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {form.id ? 'Atualizar' : 'Adicionar'} Compra
          </button>
        </div>
      </form>

      {/* Lista de Compras */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b text-left">Data</th>
              <th className="py-2 px-4 border-b text-left">Descrição</th>
              <th className="py-2 px-4 border-b text-left">Categoria</th>
              <th className="py-2 px-4 border-b text-right">Valor</th>
              <th className="py-2 px-4 border-b text-center">Parcela</th>
              <th className="py-2 px-4 border-b text-left">Cartão</th>
              <th className="py-2 px-4 border-b text-left">Quem</th>
              <th className="py-2 px-4 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              // Filtra as compras primeiro
              const comprasFiltradas = compras
                .filter(c => {
                  const matchFiltro = c.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
                                    c.quem.toLowerCase().includes(filtro.toLowerCase());
                  const matchCartao = !filtroCartao || c.cartao === filtroCartao;
                  return parcelaNoMes(c.data, c.parcelas, mesSelecionado, anoSelecionado, c.cartao) && 
                        matchFiltro && 
                        matchCartao;
                })
                .sort((a, b) => {
                  if (ordenacao === "data-desc") return new Date(b.data) - new Date(a.data);
                  if (ordenacao === "data-asc") return new Date(a.data) - new Date(b.data);
                  if (ordenacao === "valor-desc") return b.valor - a.valor;
                  return a.valor - b.valor;
                });
                
              // Calcula os índices para a página atual
              const indexInicial = (paginaAtual - 1) * itensPorPagina;
              const indexFinal = indexInicial + itensPorPagina;
              
              // Obtém apenas os itens da página atual
              const comprasPaginadas = comprasFiltradas.slice(indexInicial, indexFinal);
              
              // Se não houver compras para mostrar
              if (comprasFiltradas.length === 0) {
                return (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      Nenhuma compra encontrada para este período ou filtro.
                    </td>
                  </tr>
                );
              }
              
              // Retorna os itens para a página atual
              return comprasPaginadas.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {new Date(c.data).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{c.descricao}</td>
                  <td className="py-2 px-4 border-b">
                    {(() => {
                      const [catId, subcat] = c.categoria.split(':');
                      const categoria = categorias.find(cat => cat.id === catId);
                      return categoria ? (subcat ? `${categoria.nome} > ${subcat}` : categoria.nome) : 'N/A';
                    })()}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    R$ {parseFloat(valorParcela(c.valor, c.parcelas)).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {calcularParcelaPorMes(c.data, c.parcelas, mesSelecionado, anoSelecionado)}/{c.parcelas}
                  </td>
                  <td className="py-2 px-4 border-b">{c.cartao}</td>
                  <td className="py-2 px-4 border-b">
                    {c.compartilhada ? (
                      <div className="text-xs">
                        {c.divisao.map((d, i) => (
                          <div key={i}>{d.usuario} ({d.percentual}%)</div>
                        ))}
                      </div>
                    ) : c.quem}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => {
                        setForm(c);
                        setCompraParaEditar(c);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja excluir esta compra?')) {
                          setCompras(prevCompras => prevCompras.filter(comp => comp.id !== c.id));
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
        
        {/* Controles de paginação */}
        {(() => {
          const comprasFiltradas = compras.filter(c => {
            const matchFiltro = c.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
                              c.quem.toLowerCase().includes(filtro.toLowerCase());
            const matchCartao = !filtroCartao || c.cartao === filtroCartao;
            return parcelaNoMes(c.data, c.parcelas, mesSelecionado, anoSelecionado, c.cartao) && 
                  matchFiltro && 
                  matchCartao;
          });
          
          const totalPaginas = calcularTotalPaginas(comprasFiltradas);
          
          if (totalPaginas <= 1) return null;
          
          return (
            <div className="py-4 px-6 flex items-center justify-between border-t">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{Math.min(comprasFiltradas.length, (paginaAtual - 1) * itensPorPagina + 1)}</span> a <span className="font-medium">{Math.min(paginaAtual * itensPorPagina, comprasFiltradas.length)}</span> de <span className="font-medium">{comprasFiltradas.length}</span> compras
                </span>
                
                <div className="ml-4">
                  <select 
                    value={itensPorPagina}
                    onChange={e => {
                      setItensPorPagina(Number(e.target.value));
                      setPaginaAtual(1); // Volta para a primeira página ao mudar itens por página
                    }}
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="5">5 por página</option>
                    <option value="10">10 por página</option>
                    <option value="20">20 por página</option>
                    <option value="50">50 por página</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPaginaAtual(1)}
                  disabled={paginaAtual === 1}
                  className={`px-3 py-1 rounded ${paginaAtual === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  &laquo;
                </button>
                <button
                  onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                  disabled={paginaAtual === 1}
                  className={`px-3 py-1 rounded ${paginaAtual === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  &lsaquo;
                </button>
                
                <span className="px-3 py-1 text-gray-700">
                  Página {paginaAtual} de {totalPaginas}
                </span>
                
                <button
                  onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaAtual === totalPaginas}
                  className={`px-3 py-1 rounded ${paginaAtual === totalPaginas ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  &rsaquo;
                </button>
                <button
                  onClick={() => setPaginaAtual(totalPaginas)}
                  disabled={paginaAtual === totalPaginas}
                  className={`px-3 py-1 rounded ${paginaAtual === totalPaginas ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  &raquo;
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Modais */}
      {mostrarModalUsuarios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] flex flex-col m-4">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Usuários</h2>
            
            <div className="overflow-y-auto flex-1">
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={novoUsuario}
                  onChange={(e) => setNovoUsuario(e.target.value)}
                  placeholder="Nome do novo usuário"
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => {
                    if (novoUsuario.trim()) {
                      setUsuarios([...usuarios, novoUsuario.trim()]);
                      setNovoUsuario("");
                    }
                  }}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>

              <div className="space-y-2">
                {usuarios.map((usuario, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{usuario}</span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja remover ${usuario}?`)) {
                          setUsuarios(usuarios.filter(u => u !== usuario));
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t">
              <button
                onClick={() => setMostrarModalUsuarios(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalCartoes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] flex flex-col m-4">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Cartões</h2>
            
            <div className="overflow-y-auto flex-1">
              {/* Formulário para adicionar/editar cartão */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={novoCartao}
                  onChange={(e) => setNovoCartao(e.target.value)}
                  placeholder="Nome do cartão"
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  value={novoFechamento}
                  onChange={(e) => setNovoFechamento(e.target.value)}
                  placeholder="Dia fechamento"
                  min="1"
                  max="31"
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  value={novoVencimento}
                  onChange={(e) => setNovoVencimento(e.target.value)}
                  placeholder="Dia vencimento"
                  min="1"
                  max="31"
                  className="p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => {
                    if (novoCartao.trim() && novoFechamento && novoVencimento) {
                      const novoCartaoObj = {
                        nome: novoCartao.trim(),
                        diaFechamento: parseInt(novoFechamento),
                        diaVencimento: parseInt(novoVencimento)
                      };

                      // Adicione esta linha, que estava faltando
                      setCartoes(cartoesAtuais => [...cartoesAtuais, novoCartaoObj]);

                      // Limpa os campos
                      setNovoCartao("");
                      setNovoFechamento("");
                      setNovoVencimento("");
                    } else {
                      alert("Preencha todos os campos do cartão");
                    }
                  }}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>

              {/* Lista de cartões cadastrados */}
              <div className="space-y-2">
                {Array.isArray(cartoes) && cartoes.map((cartao, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{cartao.nome}</span>
                      <span className="ml-2 text-gray-500">
                        Fecha dia {cartao.diaFechamento} e vence dia {cartao.diaVencimento}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNovoCartao(cartao.nome);
                          setNovoFechamento(cartao.diaFechamento.toString());
                          setNovoVencimento(cartao.diaVencimento.toString());
                          setCartoes(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja remover o cartão ${cartao.nome}?`)) {
                            setCartoes(prev => prev.filter((_, i) => i !== index));
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t">
              <button
                onClick={() => {
                  setMostrarModalCartoes(false);
                  setNovoCartao("");
                  setNovoFechamento("");
                  setNovoVencimento("");
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalCategorias && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] flex flex-col m-4">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Categorias</h2>
            
            <div className="overflow-y-auto flex-1">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Nova Categoria</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={categoriaParaEditar?.nome || ""}
                    onChange={(e) => setCategoriaParaEditar(prev => ({
                      ...prev,
                      nome: e.target.value
                    }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Ícone (ex: mdi:food)"
                    value={categoriaParaEditar?.icone || ""}
                    onChange={(e) => setCategoriaParaEditar(prev => ({
                      ...prev,
                      icone: e.target.value
                    }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="color"
                    value={categoriaParaEditar?.cor || "#000000"}
                    onChange={(e) => setCategoriaParaEditar(prev => ({
                      ...prev,
                      cor: e.target.value
                    }))}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  onClick={() => {
                    if (categoriaParaEditar?.nome) {
                      const novaCategoria = {
                        id: Date.now().toString(),
                        nome: categoriaParaEditar.nome,
                        icone: categoriaParaEditar.icone || "mdi:folder",
                        cor: categoriaParaEditar.cor || "#000000",
                        subcategorias: []
                      };
                      setCategorias([...categorias, novaCategoria]);
                      setCategoriaParaEditar(null);
                    }
                  }}
                  className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Adicionar Categoria
                </button>
              </div>

              <div className="space-y-4">
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="p-4 bg-gray-50 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Icon icon={categoria.icone} style={{ color: categoria.cor }} />
                        <span className="font-medium">{categoria.nome}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja remover ${categoria.nome}?`)) {
                            setCategorias(categorias.filter(c => c.id !== categoria.id));
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>

                    <div className="mt-2">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={novaSubcategoria}
                          onChange={(e) => setNovaSubcategoria(e.target.value)}
                          placeholder="Nova subcategoria"
                          className="flex-1 p-2 border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => {
                            if (novaSubcategoria.trim()) {
                              setCategorias(categorias.map(cat => 
                                cat.id === categoria.id
                                  ? { ...cat, subcategorias: [...cat.subcategorias, novaSubcategoria.trim()] }
                                  : cat
                              ));
                              setNovaSubcategoria("");
                            }
                          }}
                          className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                        >
                          Adicionar
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {categoria.subcategorias.map((sub, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center bg-white px-2 py-1 rounded border"
                          >
                            {sub}
                            <button
                              onClick={() => {
                                setCategorias(categorias.map(cat => 
                                  cat.id === categoria.id
                                    ? { ...cat, subcategorias: cat.subcategorias.filter((_, i) => i !== index) }
                                    : cat
                                ));
                              }}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t">
              <button
                onClick={() => {
                  setMostrarModalCategorias(false);
                  setCategoriaParaEditar(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalRecorrentes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] flex flex-col m-4">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Compras Recorrentes</h2>
            
            <div className="overflow-y-auto flex-1">
              {comprasRecorrentes.length === 0 ? (
                <p className="text-center text-gray-500">
                  Nenhuma compra recorrente cadastrada.
                </p>
              ) : (
                <div className="space-y-4">
                  {comprasRecorrentes.map((recorrente) => (
                    <div key={recorrente.id} className="p-4 bg-gray-50 rounded flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{recorrente.dadosCompra.descricao}</h3>
                        <p className="text-sm text-gray-600">
                          R$ {recorrente.dadosCompra.valor} • 
                          Dia {recorrente.diaVencimento} • 
                          {recorrente.frequencia}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm('Deseja remover esta recorrência?')) {
                            setComprasRecorrentes(prev => 
                              prev.filter(r => r.id !== recorrente.id)
                            );
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t">
              <button
                onClick={() => setMostrarModalRecorrentes(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}