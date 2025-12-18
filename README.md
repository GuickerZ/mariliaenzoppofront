# Off - Rede Social Antidependência

Uma plataforma que inverte a lógica das redes sociais tradicionais. Sem curtidas públicas, sem feeds infinitos, sem algoritmos viciantes. Apenas reflexão consciente e conexões autênticas.

## Tecnologias

- **Vite** - Build tool rápido
- **React** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Shadcn/ui** - Componentes de UI
- **React Query** - Gerenciamento de estado do servidor
- **React Router** - Roteamento

## Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

## Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre no diretório do frontend
cd Front

# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Configure a URL da API no arquivo .env
# VITE_API_URL=https://sua-api.vercel.app
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API backend |

## Deploy na Vercel

1. Conecte o repositório à Vercel
2. Configure o diretório raiz como `Front`
3. Adicione a variável de ambiente `VITE_API_URL` com a URL do backend
4. Deploy!

## Estrutura do Projeto

```
src/
├── api/          # Configuração e chamadas de API
├── components/   # Componentes React
├── contexts/     # Context API
├── hooks/        # Custom hooks
├── lib/          # Utilitários
├── pages/        # Páginas da aplicação
└── types/        # Tipos TypeScript
```

## Autor

Marília Marques
