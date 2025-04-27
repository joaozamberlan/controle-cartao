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

  const [compras, setCompras] = useState([]);
  const [compraParaEditar, setCompraParaEditar] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("data-desc");
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(true);
  
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
  
  const [usuarios, setUsuarios] = useState(() => {
    const savedUsuarios = localStorage.getItem("usuarios");
    return savedUsuarios ? JSON.parse(savedUsuarios) : ["Usuário 1", "Usuário 2"];
  });
  
  const [novoUsuario, setNovoUsuario] = useState("");
  const [mostrarModalUsuarios, setMostrarModalUsuarios] = useState(false);
  
  const [cartoes, setCartoes] = useState(() => {
    const savedCartoes = localStorage.getItem("cartoes");
    return savedCartoes ? JSON.parse(savedCartoes) : ["Nubank", "Inter"];
  });

  const [mostrarModalCartoes, setMostrarModalCartoes] = useState(false);
  const [novoCartao, setNovoCartao] = useState("");

  const [form, setForm] = useState({
    id: null,
    data: "",
    descricao: "",
    parcelas: 1,
    valor: "",
    quem: "",
    compartilhada: false,
    divisao: [
      { usuario: "", percentual: 100 }
    ],
    categoria: categorias[0]?.id || "", // Usar o ID da primeira categoria como padrão
    cartao: "",
    recorrente: false,
    frequencia: "mensal",
    diaVencimento: ""
  });

  const [filtroCartao, setFiltroCartao] = useState("");

  const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState({
    nome: "",
    icone: "mdi:folder",
    cor: "#000000"
  });
  const [novaSubcategoria, setNovaSubcategoria] = useState("");

  const [configuracoes, setConfiguracoes] = useState(() => {
    const savedConfig = localStorage.getItem("configuracoes");
    return savedConfig ? JSON.parse(savedConfig) : {
      tema: "claro",
      notificacoes: true,
      ultimoBackup: null
    };
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

  useEffect(() => {
    localStorage.setItem("cartoes", JSON.stringify(cartoes));
  }, [cartoes]);

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
    console.log("Categorias atualizadas:", categorias); // Para debug
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem("configuracoes", JSON.stringify(configuracoes));
  }, [configuracoes]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "compartilhada") {
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
    
    if (campo === "percentual") {
      const total = novasDivisoes.reduce((sum, item, idx) => 
        idx === index ? sum + parseInt(valor || 0) : sum + parseInt(item.percentual || 0), 0);
      
      if (total > 100) {
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
      
      const totalAtual = novasDivisoes.reduce((sum, item) => sum + parseInt(item.percentual || 0), 0);
      if (totalAtual < 100 && novasDivisoes.length > 0) {
        const diferenca = 100 - totalAtual;
        novasDivisoes[0].percentual = (parseInt(novasDivisoes[0].percentual || 0) + diferenca).toString();
      }
      
      setForm({ ...form, divisao: novasDivisoes });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formProcessado = { ...form };
    
    if (!formProcessado.compartilhada) {
      formProcessado.divisao = [{ usuario: formProcessado.quem, percentual: 100 }];
    } else {
      const totalPercentual = formProcessado.divisao.reduce((sum, item) => sum + parseInt(item.percentual || 0), 0);
      
      if (totalPercentual !== 100) {
        const diferenca = 100 - totalPercentual;
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
      setCompras(compras.map(comp => comp.id === form.id ? { ...formProcessado } : comp));
    } else {
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
      divisao: [{ usuario: "", percentual: 100 }],
      categoria: "Outros",
      cartao: "",
      recorrente: false,
      frequencia: "mensal",
      diaVencimento: ""
    });
    setCompraParaEditar(null);
  };

  const editarCompra = (compra) => {
    setCompraParaEditar(compra);
    
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
        
        setCompras(compras.map(compra => {
          const novaCompra = { ...compra };
          if (novaCompra.quem === usuario) {
            const novoQuem = usuarios.find(u => u !== usuario);
            novaCompra.quem = novoQuem || usuarios[0];
          }
          
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

  const calcularParcelaAtual = (dataCompra, totalParcelas) => {
    const hoje = new Date();
    const compra = new Date(dataCompra);
    const diffMeses = (hoje.getFullYear() - compra.getFullYear()) * 12 + 
                       (hoje.getMonth() - compra.getMonth());
    return Math.min(Math.max(1, diffMeses + 1), parseInt(totalParcelas));
  };

  const calcularParcelaPorMes = (dataCompra, totalParcelas, mesSelecionado, anoSelecionado) => {
    const compra = new Date(dataCompra);
    const diffMeses = (anoSelecionado - compra.getFullYear()) * 12 + 
                       (mesSelecionado - compra.getMonth());
    return diffMeses + 1;
  };

  const parcelaNoMes = (dataCompra, totalParcelas, mesSelecionado, anoSelecionado) => {
    const parcela = calcularParcelaPorMes(dataCompra, totalParcelas, mesSelecionado, anoSelecionado);
    return parcela >= 1 && parcela <= parseInt(totalParcelas);
  };

  const valorParcela = (valor, parcelas) => {
    return (parseFloat(valor) / parseInt(parcelas)).toFixed(2);
  };

  const comprasFiltradas = compras
    .filter(c => {
      const temParcelaNesteMes = parcelaNoMes(c.data, c.parcelas, mesSelecionado, anoSelecionado);
      
      const atendeFiltroBusca = c.descricao.toLowerCase().includes(filtro.toLowerCase()) || 
                                (c.quem && c.quem.toLowerCase().includes(filtro.toLowerCase())) ||
                                (c.divisao && c.divisao.some(d => d.usuario.toLowerCase().includes(filtro.toLowerCase())));
      
      const atendeCartao = !filtroCartao || c.cartao === filtroCartao;
      
      return (mostrarFinalizadas || temParcelaNesteMes) && atendeFiltroBusca && atendeCartao;
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

  const calcularTotais = () => {
    const totaisPorUsuario = {};
    usuarios.forEach(usuario => {
      totaisPorUsuario[usuario] = 0;
    });
    
    let totalGeral = 0;
    
    compras.forEach(compra => {
      if (!compra.data || !compra.valor || !compra.parcelas) return;
      
      if (parcelaNoMes(compra.data, compra.parcelas, mesSelecionado, anoSelecionado)) {
        const valorParcelaAtual = parseFloat(valorParcela(compra.valor, compra.parcelas));
        
        if (compra.compartilhada && compra.divisao && compra.divisao.length > 0) {
          compra.divisao.forEach(div => {
            const percentual = parseInt(div.percentual || 0) / 100;
            const valorUsuario = valorParcelaAtual * percentual;
            
            if (totaisPorUsuario[div.usuario] !== undefined) {
              totaisPorUsuario[div.usuario] += valorUsuario;
            } else {
              if (totaisPorUsuario[compra.quem] !== undefined) {
                totaisPorUsuario[compra.quem] += valorUsuario;
              }
            }
          });
        } else if (totaisPorUsuario[compra.quem] !== undefined) {
          totaisPorUsuario[compra.quem] += valorParcelaAtual;
        }
        
        totalGeral += valorParcelaAtual;
      }
    });
    
    return { totaisPorUsuario, totalGeral };
  };

  const calcularTotaisPorCartao = () => {
    const totais = {};
    cartoes.forEach(cartao => {
      totais[cartao] = 0;
    });

    compras.forEach(compra => {
      if (parcelaNoMes(compra.data, compra.parcelas, mesSelecionado, anoSelecionado)) {
        const valorParcelaAtual = parseFloat(valorParcela(compra.valor, compra.parcelas));
        if (totais[compra.cartao] !== undefined) {
          totais[compra.cartao] += valorParcelaAtual;
        }
      }
    });

    return totais;
  };

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
    cartoes.forEach(card => dadosCartoes[card] = 0);

    compras.forEach(compra => {
      if (parcelaNoMes(compra.data, compra.parcelas, mesSelecionado, anoSelecionado)) {
        const valorParcela = parseFloat(valorParcela(compra.valor, compra.parcelas));
        
        // Adicionar ao total da categoria
        const categoriaId = compra.categoria.split(':')[0]; // Pega o ID da categoria mesmo se for subcategoria
        if (dadosCategorias[categoriaId]) {
          dadosCategorias[categoriaId].value += valorParcela;
        }

        // Resto do código para usuários e cartões permanece o mesmo
        if (dadosCartoes[compra.cartao] !== undefined) {
          dadosCartoes[compra.cartao] += valorParcela;
        }

        if (compra.compartilhada && compra.divisao) {
          compra.divisao.forEach(div => {
            const percentual = parseInt(div.percentual || 0) / 100;
            if (dadosUsuarios[div.usuario] !== undefined) {
              dadosUsuarios[div.usuario] += valorParcela * percentual;
            }
          });
        } else if (dadosUsuarios[compra.quem] !== undefined) {
          dadosUsuarios[compra.quem] += valorParcela;
        }
      }
    });

    return {
      categorias: Object.values(dadosCategorias)
        .filter(item => item.value > 0),
      usuarios: Object.entries(dadosUsuarios)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0),
      cartoes: Object.entries(dadosCartoes)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0)
    };
  };

  const backupAutomatico = () => {
    const dados = {
      compras,
      usuarios,
      cartoes,
      categorias,
      configuracoes: {
        ...configuracoes,
        ultimoBackup: new Date().toISOString()
      }
    };
    
    const backupKey = 'backup_' + new Date().toISOString();
    localStorage.setItem(backupKey, JSON.stringify(dados));
    
    // Atualiza a data do último backup
    setConfiguracoes(prev => ({
      ...prev,
      ultimoBackup: new Date().toISOString()
    }));

    return backupKey; // Retorna a chave do backup para possível uso posterior
  };

  const gerenciarCategorias = {
    adicionar: (novaCategoria) => {
      if (novaCategoria?.nome?.trim()) {
        const novaListaCategorias = [...categorias, {
          id: Date.now().toString(),
          nome: novaCategoria.nome.trim(),
          icone: novaCategoria.icone || "mdi:folder",
          cor: novaCategoria.cor || "#000000",
          subcategorias: []
        }];
        setCategorias(novaListaCategorias);
        localStorage.setItem("categorias", JSON.stringify(novaListaCategorias));
      }
    },

    editar: (id, dadosAtualizados) => {
      setCategorias(categorias.map(cat => 
        cat.id === id ? { ...cat, ...dadosAtualizados } : cat
      ));
    },

    remover: (id) => {
      if (window.confirm("Tem certeza? Isso afetará todas as compras desta categoria.")) {
        setCategorias(categorias.filter(cat => cat.id !== id));
        // Atualizar compras que usam esta categoria
        setCompras(compras.map(compra => ({
          ...compra,
          categoria: compra.categoria === id ? "Outros" : compra.categoria
        })));
      }
    },

    adicionarSubcategoria: (categoriaId, subcategoria) => {
      setCategorias(categorias.map(cat => 
        cat.id === categoriaId ? 
        { ...cat, subcategorias: [...cat.subcategorias, subcategoria] } : 
        cat
      ));
    },

    removerSubcategoria: (categoriaId, subcategoria) => {
      setCategorias(categorias.map(cat => 
        cat.id === categoriaId ? 
        { ...cat, subcategorias: cat.subcategorias.filter(sub => sub !== subcategoria) } : 
        cat
      ));
    }
  };

  const fecharModalCategorias = () => {
    setMostrarModalCategorias(false);
    setCategoriaParaEditar({
      nome: "",
      icone: "mdi:folder",
      cor: "#000000"
    });
  };

  const { totaisPorUsuario, totalGeral } = calcularTotais();
  const totaisPorCartao = calcularTotaisPorCartao();
  const dadosGraficos = prepararDadosGraficos();

  // Adicionar após o cálculo dos totais
  const dados = prepararDadosGraficos();

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

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  const coresUsuarios = {
    [usuarios[0]]: "bg-blue-500 text-white",
    [usuarios[1]]: "bg-green-500 text-white",
  };
  
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

  const editarNomeUsuario = (usuarioAntigo, novoNome) => {
    if (novoNome.trim() && novoNome !== usuarioAntigo) {
      const novoUsuarios = usuarios.map(u => 
        u === usuarioAntigo ? novoNome : u
      );
      
      const novasCompras = compras.map(compra => {
        const novaCompra = { ...compra };
        if (novaCompra.quem === usuarioAntigo) {
          novaCompra.quem = novoNome;
        }
        if (novaCompra.divisao) {
          novaCompra.divisao = novaCompra.divisao.map(div => ({
            ...div,
            usuario: div.usuario === usuarioAntigo ? novoNome : div.usuario
          }));
        }
        return novaCompra;
      });
      
      setUsuarios(novoUsuarios);
      setCompras(novasCompras);
    }
  };

  const gerenciarCartoes = {
    adicionar: (novoCartao) => {
      if (novoCartao.trim() && !cartoes.includes(novoCartao)) {
        setCartoes([...cartoes, novoCartao]);
      }
    },
    
    remover: (cartao) => {
      if (cartoes.length > 1) {
        if (window.confirm(`Tem certeza que deseja remover o cartão "${cartao}"?`)) {
          setCartoes(cartoes.filter(c => c !== cartao));
          setCompras(compras.map(compra => ({
            ...compra,
            cartao: compra.cartao === cartao ? cartoes[0] : compra.cartao
          })));
        }
      } else {
        alert("É necessário manter pelo menos um cartão.");
      }
    },
    
    editar: (cartaoAntigo, novoNome) => {
      if (novoNome.trim() && novoNome !== cartaoAntigo) {
        const novosCartoes = cartoes.map(c => 
          c === cartaoAntigo ? novoNome : c
        );
        
        const novasCompras = compras.map(compra => ({
          ...compra,
          cartao: compra.cartao === cartaoAntigo ? novoNome : compra.cartao
        }));
        
        setCartoes(novosCartoes);
        setCompras(novasCompras);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
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
          </div>
        </div>
        
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

        {mostrarModalCartoes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Gerenciar Cartões</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adicionar Novo Cartão
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    value={novoCartao} 
                    onChange={(e) => setNovoCartao(e.target.value)} 
                    placeholder="Nome do cartão" 
                    className="flex-1 p-2 border border-gray-300 rounded-l"
                  />
                  <button 
                    onClick={() => {
                      if (novoCartao.trim()) {
                        gerenciarCartoes.adicionar(novoCartao);
                        setNovoCartao("");
                      }
                    }}
                    className="bg-blue-600 text-white py-2 px-4 rounded-r hover:bg-blue-700"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Cartões Cadastrados</h3>
                <ul className="divide-y divide-gray-200">
                  {cartoes.map((cartao, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <span className="px-2 py-1 bg-gray-100 rounded">{cartao}</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            const novoNome = prompt(`Digite o novo nome para o cartão "${cartao}":`, cartao);
                            if (novoNome) {
                              gerenciarCartoes.editar(cartao, novoNome);
                            }
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => gerenciarCartoes.remover(cartao)}
                          className="text-red-500 hover:text-red-700"
                          disabled={cartoes.length <= 1}
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setMostrarModalCartoes(false)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarModalCategorias && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-xl font-semibold mb-4">Gerenciar Categorias</h2>
              
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
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Categorias Existentes</h3>
                <div className="space-y-4">
                  {categorias.map((categoria) => (
                    <div key={categoria.id} className="border p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon icon={categoria.icone} style={{ color: categoria.cor }} />
                          <span className="font-medium">{categoria.nome}</span>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => setCategoriaParaEditar(categoria)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => gerenciarCategorias.remover(categoria.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      </div>

                      <div className="pl-6">
                        <h4 className="text-sm font-medium mb-1">Subcategorias:</h4>
                        <div className="flex flex-wrap gap-2">
                          {categoria.subcategorias.map((sub, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
                            >
                              {sub}
                              <button
                                onClick={() => gerenciarCategorias.removerSubcategoria(categoria.id, sub)}
                                className="ml-1 text-gray-500 hover:text-red-500"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <div className="flex items-center space-x-1">
                            <input
                              type="text"
                              value={novaSubcategoria}
                              onChange={(e) => setNovaSubcategoria(e.target.value)}
                              placeholder="Nova subcategoria"
                              className="p-1 text-sm border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => {
                                if (novaSubcategoria.trim()) {
                                  gerenciarCategorias.adicionarSubcategoria(categoria.id, novaSubcategoria.trim());
                                  setNovaSubcategoria("");
                                }
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={fecharModalCategorias}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {cartoes.map((cartao, index) => (
            <div key={index} className="p-4 rounded-lg shadow text-center bg-gray-50">
              <h3 className="font-semibold text-lg">Total {cartao}</h3>
              <p className="text-2xl font-bold text-gray-600">R${totaisPorCartao[cartao].toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Gráfico de Categorias */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Gastos por Categoria</h3>
            <div className="h-64">
              <PieChart width={300} height={250}>
                <Pie
                  data={dadosGraficos.categorias}
                  cx={150}
                  cy={125}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosGraficos.categorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `R$ ${value.toFixed(2)}`}
                />
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* Gráfico de Usuários */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Gastos por Usuário</h3>
            <div className="h-64">
              <BarChart
                width={300}
                height={250}
                data={dadosGraficos.usuarios}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#8884d8">
                  {dadosGraficos.usuarios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>

          {/* Gráfico de Cartões */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Gastos por Cartão</h3>
            <div className="h-64">
              <BarChart
                width={300}
                height={250}
                data={dadosGraficos.cartoes}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#82ca9d">
                  {dadosGraficos.cartoes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>
        </div>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {categorias.map((cat) => (
                  <optgroup key={cat.id} label={cat.nome}>
                    <option value={cat.id}>{cat.nome}</option>
                    {cat.subcategorias.map((sub, index) => (
                      <option key={index} value={`${cat.id}:${sub}`}>{sub}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cartão</label>
              <select
                name="cartao"
                value={form.cartao}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Selecione o cartão</option>
                {cartoes.map((cartao, index) => (
                  <option key={index} value={cartao}>{cartao}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="recorrente"
                  checked={form.recorrente}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Despesa Recorrente</span>
              </label>
            </div>
          </div>

          {form.recorrente && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                <select
                  name="frequencia"
                  value={form.frequencia}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dia do Vencimento</label>
                <input
                  type="number"
                  name="diaVencimento"
                  min="1"
                  max="31"
                  value={form.diaVencimento}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Dia do mês"
                />
              </div>
            </div>
          )}
          
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
              {cartoes.map((cartao, index) => (
                <option key={index} value={cartao}>{cartao}</option>
              ))}
            </select>
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
                  <th className="py-2 px-4 border-b text-left">Categoria</th>
                  <th className="py-2 px-4 border-b text-left">Cartão</th>
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
                              {parcelaNoMesSelecionado}/{c.parcelas}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">R${valorMensal}</td>
                      <td className="py-2 px-4 border-b">{c.quem}</td>
                      <td className="py-2 px-4 border-b">
                        {(() => {
                          const [catId, subcat] = c.categoria.split(':');
                          const categoria = categorias.find(cat => cat.id === catId);
                          if (!categoria) return 'Categoria não encontrada';
                          return subcat ? `${categoria.nome} > ${subcat}` : categoria.nome;
                        })()}
                      </td>
                      <td className="py-2 px-4 border-b">{c.cartao}</td>
                      <td className="py-2 px-4 border-b">
                        <button 
                          onClick={() => editarCompra(c)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => excluirCompra(c.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Nenhuma compra encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}