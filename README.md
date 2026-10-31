# Portal da Eletrônica

Trabalho acadêmico da disciplina de **Engenharia de Software II (ES2)**, com um protótipo de loja virtual de componentes eletrônicos e materiais didáticos.

O site foi desenvolvido originalmente por um integrante do grupo de Engenharia de Software I (ES1), a partir dos requisitos e das funcionalidades daquela disciplina. Em ES2, o grupo reutiliza essa implementação como protótipo para apoiar o projeto de software e demonstrar os fluxos de interação previstos no trabalho.

## Sobre o trabalho

O projeto aborda a organização da arquitetura, a modelagem dos subsistemas e o projeto das camadas da aplicação. No T3, o protótipo auxilia a apresentação do projeto conjunto da Camada de Interface com o Usuário (CIU) e da Camada de Gerência de Tarefas (CGT).

A documentação organiza o sistema em dois subsistemas:

- **Controle Interno:** autenticação, consulta ao catálogo, detalhes dos produtos, manutenção de produtos e manutenção de administradores.
- **Pedidos:** cadastro de clientes, carrinho, finalização da compra e consulta de pedidos por clientes e pela administração.

O catálogo pertence ao Controle Interno por estar relacionado à gestão das informações dos produtos, embora também seja acessado pelos clientes.

O site demonstra a apresentação e os fluxos de interação. Os diagramas e contratos do trabalho descrevem a arquitetura prevista; a implementação atual reutiliza o protótipo de ES1 e pode apresentar diferenças em relação ao projeto documentado em ES2.

## Funcionalidades do site

- Consulta ao catálogo, pesquisa e filtro por tipo de produto.
- Visualização de preço, descrição, disponibilidade e especificações dos produtos.
- Cadastro de clientes e login com diferentes perfis.
- Inclusão e remoção de produtos no carrinho, alteração de quantidades e seleção dos itens para compra.
- Finalização de compra com endereço de entrega e simulação de pagamento por Pix, cartão de crédito ou cartão de débito.
- Consulta dos pedidos do cliente autenticado.
- Painel administrativo para cadastrar, consultar e editar produtos e consultar detalhes de pedidos.
- Aba de administradores, exibida para o gerente, com consulta, cadastro e edição.

## Tecnologias

- React 19 e TypeScript.
- Vite 7 para desenvolvimento e geração da versão de distribuição.
- Tailwind CSS e componentes Radix UI/shadcn.
- Wouter para navegação entre páginas.
- React Context e estado em memória para simular usuários, produtos, carrinho e pedidos.
- Node.js e Express para servir a aplicação compilada.
- pnpm para gerenciamento das dependências.

## Como executar

### Pré-requisitos

- Node.js **22.12 ou superior**. O Vite utilizado também aceita Node.js 20 a partir da versão 20.19.
- pnpm, na versão definida pelo campo `packageManager` do projeto.
- Acesso à internet para instalar as dependências.

### Instalação e inicialização

Depois de baixar ou clonar este repositório, abra o terminal na pasta `Portal_Eletronica` e entre na pasta do site:

```bash
cd site-portal-eletronica
```

Habilite o pnpm com o Corepack, instale as dependências e inicie o servidor:

```bash
corepack enable pnpm
pnpm install
pnpm run dev
```

Se o comando `corepack` não estiver disponível na instalação do Node.js, instale o pnpm na versão declarada pelo projeto e continue:

```bash
npm install --global pnpm@10.4.1
pnpm install
pnpm run dev
```

Abra [http://localhost:3000/](http://localhost:3000/) no navegador. Se a porta 3000 estiver ocupada, o Vite poderá usar outra porta; confira o endereço informado no terminal.

Mantenha o terminal aberto enquanto utiliza o site. Para encerrar o servidor, pressione `Ctrl + C`.

## Contas de demonstração

As contas abaixo já estão disponíveis no protótipo:

| Perfil | Email | Senha |
| --- | --- | --- |
| Cliente | `cliente@teste.com` | `123` |
| Administrador | `admin@teste.com` | `123` |
| Gerente | `gerente@teste.com` | `123` |

Essas credenciais são exclusivas da demonstração acadêmica. Também é possível criar uma conta de cliente pela aba **Criar Conta**.

## Como usar

### Consultar o catálogo

1. Acesse a página inicial.
2. Use a pesquisa e o filtro por tipo para encontrar produtos.
3. Selecione um produto para visualizar seus detalhes, preço e disponibilidade.

### Simular uma compra

1. Abra o menu do usuário no cabeçalho e selecione **Entrar / Cadastrar**.
2. Entre com a conta de cliente de demonstração ou crie uma conta na aba **Criar Conta**.
3. Escolha um produto, informe a quantidade e adicione-o ao carrinho.
4. Abra o carrinho pelo ícone no cabeçalho. Ajuste as quantidades e selecione os itens que deseja comprar.
5. Prossiga para a finalização da compra e preencha o endereço de entrega.
6. Escolha Pix, cartão de crédito ou cartão de débito e preencha os campos solicitados com dados fictícios.
7. Clique em **Confirmar Pagamento** para concluir a simulação.
8. Consulte a compra em **Meus Pedidos**, no menu do usuário.

O pagamento é simulado: não há cobrança, processamento bancário ou geração de Pix real.

### Usar o painel administrativo

1. Entre com a conta de administrador ou gerente.
2. Acesse **Painel Admin** pelo cabeçalho ou **Painel Administrativo** pelo menu do usuário.
3. Na aba **Produtos**, cadastre novos produtos, consulte os existentes e edite seus dados.
4. Na aba **Pedidos**, utilize os filtros e abra os detalhes dos pedidos realizados na simulação.
5. Com a conta de gerente, acesse também a aba **Administradores** para consultar, cadastrar e editar administradores. Durante a edição, o campo CPF permanece bloqueado.

Para demonstrar o fluxo completo, faça uma compra como cliente, utilize **Sair** e entre como administrador ou gerente **sem recarregar a página**. Assim, o pedido criado continuará disponível no estado da aplicação.

## Páginas e endereços

| Endereço | Página |
| --- | --- |
| `/` | Catálogo de produtos |
| `/product/:id` | Detalhes do produto identificado por `id` |
| `/auth` | Login e cadastro de clientes |
| `/cart` | Carrinho de compras |
| `/checkout` | Finalização da compra |
| `/orders` | Pedidos do cliente |
| `/admin` | Painel administrativo |

As abas **Produtos**, **Pedidos** e **Administradores** compartilham o endereço `/admin`.

## Características do protótipo

Os dados são mantidos em memória no navegador, sem persistência em banco de dados. Ao recarregar a página ou abrir outra aba, a aplicação inicia novamente com os dados de demonstração. Cadastros, alterações de produtos, carrinho, pedidos e sessão não são preservados entre essas inicializações.

O protótipo não implementa os serviços de negócio, os repositórios e a integração com banco de dados previstos na arquitetura do trabalho. A autenticação e as verificações de perfil são demonstrativas; a implementação atual não oferece proteção completa das rotas administrativas para uso em produção.

## Estrutura do repositório

```text
Portal_Eletronica/
├── README.md
├── LICENSE
└── site-portal-eletronica/
    ├── client/
    │   ├── public/        # Imagens e arquivos públicos
    │   └── src/
    │       ├── components/ # Componentes da interface
    │       ├── contexts/   # Estado de autenticação, loja e carrinho
    │       ├── lib/        # Dados simulados e utilitários
    │       └── pages/      # Páginas do site
    ├── server/             # Servidor Express da versão compilada
    ├── shared/             # Definições compartilhadas
    ├── patches/            # Ajustes de dependências
    ├── package.json
    ├── pnpm-lock.yaml
    └── vite.config.ts
```

## Outros comandos

Execute os comandos dentro de `site-portal-eletronica`:

| Comando | Finalidade |
| --- | --- |
| `pnpm run dev` | Iniciar o servidor de desenvolvimento |
| `pnpm run build` | Gerar a versão compilada em `dist/` |
| `pnpm run preview` | Visualizar o frontend compilado localmente, após o build |
| `pnpm run check` | Executar a verificação de tipos do TypeScript |
| `pnpm run format` | Formatar os arquivos com Prettier |

## Créditos e licença

O site original foi desenvolvido por um integrante do grupo de ES1, que não participa da turma atual de ES2. O grupo de ES2 reutiliza esse trabalho como protótipo para apoiar a modelagem e a documentação da disciplina.

O repositório contém uma licença MIT no arquivo `LICENSE`.
