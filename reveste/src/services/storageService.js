// Dados iniciais para o sistema não iniciar vazio (Mock Data)
const SEED_USUARIOS = [
  {
    id: "user001",
    nome: "Madalena Oliveira",
    email: "madalena@email.com",
    senha: "asdf", // Simplificado para teste
    telefone: "(88) 94002-8922",
    endereco: "Rua Juscelino Kubitschek, 123 - Juazeiro/CE",
    avatar: "", 
    vats: 100,
    mediaAvaliacoes: 4.5,
    totalNegociacoes: 3,
    criadoEm: "2026-05-09T05:30:20"
  },
  {
    id: "user002",
    nome: "Vitor Fernandes",
    email: "vf@email.com",
    senha: "fdsa",
    telefone: "(88) 94002-8924",
    endereco: "Av. Getúlio Dorneles Vargas, 456 - Juazeiro/CE",
    avatar: "",
    vats: 10,
    mediaAvaliacoes: 5.0,
    totalNegociacoes: 1,
    criadoEm: "2026-05-20T19:30:40"
  }
];

const SEED_ANUNCIOS = [
  {
    id: "anuncio001",
    usuarioId: "user001",
    titulo: "Camisa 1 do Flamengo",
    descricao: "Camisa 1 do Flamengo, tamanho M, preta e jeans grosso.",
    categoria: "camisa",
    tamanho: "M",
    conservacao: "Bom",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdV7mE8py7n7SrhuvjqWlNbIkzF7t2M4raQZPpkxcHg&s=10", // URL válida de imagem pública
    modalidade: "Ambos",
    vats: 95,
    status: "disponivel",
    criadoEm: "2026-05-09T13:30:00"
  }
];

export const storageService = {
  // Inicializa o localStorage caso as chaves não existam
  init() {
    if (!localStorage.getItem("usuarios")) {
      localStorage.setItem("usuarios", JSON.stringify(SEED_USUARIOS));
    }
    if (!localStorage.getItem("anuncios")) {
      localStorage.setItem("anuncios", JSON.stringify(SEED_ANUNCIOS));
    }
    if (!localStorage.getItem("negociacoes")) {
      localStorage.setItem("negociacoes", JSON.stringify([]));
    }
    if (!localStorage.getItem("propostas")) {
      localStorage.setItem("propostas", JSON.stringify([]));
    }
    if (!localStorage.getItem("mensagens")) {
      localStorage.setItem("mensagens", JSON.stringify([]));
    }
    if (!localStorage.getItem("avaliacoes")) {
      localStorage.setItem("avaliacoes", JSON.stringify([]));
    }
  }
};