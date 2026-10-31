export interface Product {
  id: string; // Código
  name: string; // Nome
  tipoProduto: 'Componente Eletrônico' | 'Material Didático';
  category: string; // Categoria (mapped to category for UI compat)
  description: string;
  price: number;
  originalPrice?: number;
  dataVigencia: string; // Data de Início da Vigência do Preço
  stock: number; // Quantidade em Estoque
  status: 'Ativo' | 'Inativo'; // Status
  image: string;
  images?: string[];
  specs?: Record<string, string>;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected?: boolean;
}

export interface Review {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;
}

// RESISTOR ARDUINO UNO 
// EBOOK TUTORIAL DE CULTURA MAKER

export const mockProducts: Product[] = [
  {
    id: 'id-componente-1',
    name: 'Resistor 10k (10 Unidades)',
    tipoProduto: 'Componente Eletrônico',
    description: 'Esses resistores 10K são ideais para uma variedade de aplicações, desde circuitos simples até projetos mais complexos. Eles são projetados para suportar até 1/4 de watt de potência, garantindo que seus componentes eletrônicos operem de maneira eficiente e segura.',
    price: 1,
    category: 'Componentes',

    stock: 45,
    image: '/resistor.webp',
    specs: {
      'Resistência': '10k',
      'Tolerância': '10%',
      'Potência': '1/4W',
      'Quantidade': '10 Unidades'
    },
    featured: true,
    dataVigencia: '2026-02-01',
    status: 'Ativo',
  },

  {
    id: 'id-microcontrolador-1',
    name: 'Placa Uno R3 SMD CH340 + Cabo Usb para Arduino',
    tipoProduto: 'Componente Eletrônico',
    description: 'O Arduino Uno SMD é uma versão econômica do mais conhecido Arduino Uno R3, onde apresenta exatamente a mesma pinagem, bem como performance de funcionamento já que também conta com o microcontrolador Atmega328. A placa Arduino é a mais vendida e usada atualmente.',
    price: 38.90,
    category: 'Microcontroladores',
    stock: 21,
    image: '/arduino-smd.webp',
    specs: {
      'Microcontrolador': 'ATmega328',
      'Velocidade do Clock': '16MHz',
      'Tensão de operação': '5V',
      'Tensão de Entrada': '7-9V'
    },
    featured: true,
    dataVigencia: '2026-04-10',
    status: 'Ativo',
  },

  {
    id: 'id-microcontrolador-2',
    name: 'Placa Mega 2560 CH340',
    tipoProduto: 'Componente Eletrônico',
    description: 'O Mega 2560 é a placa arduino perfeita para quem procura fazer projetos mais elaborados, que necessitam de um número maior de entradas e saídas.',
    price: 129.90,
    category: 'Microcontroladores',
    stock: 5,
    image: '/arduino-mega.webp',
    specs: {
      'Microcontrolador': 'ATmega2560',
      'Velocidade do Clock': '16MHz',
      'Tensão de operação': '5V',
      'Tensão de Entrada': '7-12V'
    },
    featured: true,
    dataVigencia: '2026-04-10',
    status: 'Ativo',
  },

  {
    id: 'id-apostila-1',
    name: 'Apostila Arduino Start',
    tipoProduto: 'Material Didático',
    description: 'Aprenda a programar seu Arduino e crie seus próprios projetos. Aprenda desde teoria, a programação, até o projeto rodando.',
    price: 39.90,
    category: 'Material Didático',
    stock: 100,
    image: '/apostila-arduino-start.webp',
    specs: {
      'Formato': 'Apostila Física',
      'Quantidade de páginas': '100',
      'Idioma': 'Português',
      'Nível': 'Iniciante'
    },
    featured: true,
    dataVigencia: '2026-04-10',
    status: 'Ativo',
  },

  {
    id: 'id-apostila-2',
    name: 'Apostila Arduino Avançado',
    tipoProduto: 'Material Didático',
    description: 'Aprofunde seus conhecimentos em Arduino e explore projetos mais complexos com esta apostila completa.',
    price: 59.90,
    category: 'Material Didático',
    stock: 100,
    image: '/apostila-arduino-avancado.webp',
    specs: {
      'Formato': 'Apostila Física',
      'Quantidade de páginas': '120',
      'Idioma': 'Português',
      'Nível': 'Avançado'
    },
    featured: true,
    dataVigencia: '2026-02-10',
    status: 'Ativo',
  },
];