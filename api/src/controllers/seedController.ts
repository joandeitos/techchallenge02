import mongoose from 'mongoose';
import { IPost } from '../models/Post';
import { User } from '../models/User';
import { Request, Response } from 'express';
import Post from '../models/Post';
import bcrypt from 'bcryptjs';

export const seedUsers = async (req: Request, res: Response) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Usuários já existem no banco de dados' });
    }

    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = [
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'João Silva',
        email: 'joao@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'Matemática'
      },
      {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'Português'
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'História'
      },
      {
        name: 'Ana Costa',
        email: 'ana@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'Geografia'
      },
      {
        name: 'Carlos Ferreira',
        email: 'carlos@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'Física'
      },
      {
        name: 'Beatriz Lima',
        email: 'beatriz@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'Química'
      },
      {
        name: 'Rafael Souza',
        email: 'rafael@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'Biologia'
      },
      {
        name: 'Fernanda Pereira',
        email: 'fernanda@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'Inglês'
      },
      {
        name: 'Lucas Rodrigues',
        email: 'lucas@example.com',
        password: hashedPassword,
        role: 'professor',
        discipline: 'Educação Física'
      },
      {
        name: 'Gabriel Silva',
        email: 'gabriel@example.com',
        password: hashedPassword,
        role: 'aluno'
      },
      {
        name: 'Julia Santos',
        email: 'julia@example.com',
        password: hashedPassword,
        role: 'aluno'
      },
      {
        name: 'Matheus Oliveira',
        email: 'matheus@example.com',
        password: hashedPassword,
        role: 'aluno'
      },
      {
        name: 'Isabella Costa',
        email: 'isabella@example.com',
        password: hashedPassword,
        role: 'aluno'
      },
      {
        name: 'Leonardo Ferreira',
        email: 'leonardo@example.com',
        password: hashedPassword,
        role: 'aluno'
      }
    ];

    await User.insertMany(users);
    return res.status(201).json({ message: 'Usuários criados com sucesso' });
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
    return res.status(500).json({ message: 'Erro ao criar usuários' });
  }
};

export const seedPosts = async (req: Request, res: Response) => {
  try {
    const count = await Post.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Posts já existem no banco de dados' });
    }

    const users = await User.find();
    if (users.length === 0) {
      return res.status(400).json({ message: 'Nenhum usuário encontrado para criar posts' });
    }

    const posts = [
      {
        title: 'Introdução à Programação Orientada a Objetos',
        content: `
          <h3>O que é Programação Orientada a Objetos?</h3>
          <p>A Programação Orientada a Objetos (POO) é um paradigma de programação que organiza o código em objetos, que são instâncias de classes. Este paradigma é baseado em quatro pilares fundamentais:</p>
          <ul>
            <li><strong>Encapsulamento:</strong> Protege os dados dentro de um objeto e só permite acesso através de métodos específicos.</li>
            <li><strong>Herança:</strong> Permite que uma classe herde características de outra classe.</li>
            <li><strong>Polimorfismo:</strong> Permite que objetos de diferentes classes sejam tratados como objetos de uma classe comum.</li>
            <li><strong>Abstração:</strong> Simplifica problemas complexos ocultando detalhes e mostrando apenas o necessário.</li>
          </ul>
          <p>A POO é amplamente utilizada em linguagens como Java, C++, Python e JavaScript (através de protótipos). Sua principal vantagem é permitir a criação de código mais organizado, reutilizável e fácil de manter.</p>
          <h4>Exemplo em Java:</h4>
          <pre><code>
public class Animal {
    private String nome;
    
    public Animal(String nome) {
        this.nome = nome;
    }
    
    public void fazerSom() {
        System.out.println("Som genérico de animal");
    }
}
          </code></pre>
        `,
        author: users[0]._id
      },
      {
        title: 'Desenvolvimento Web Moderno: Frameworks e Bibliotecas',
        content: `
          <h3>O Ecossistema do Desenvolvimento Web Moderno</h3>
          <p>O desenvolvimento web moderno é caracterizado por uma rica variedade de frameworks e bibliotecas que facilitam a criação de aplicações web robustas e escaláveis. Vamos explorar algumas das principais tecnologias:</p>
          
          <h4>Frontend</h4>
          <ul>
            <li><strong>React:</strong> Biblioteca para construção de interfaces de usuário mantida pelo Facebook.</li>
            <li><strong>Vue.js:</strong> Framework progressivo para construção de UIs.</li>
            <li><strong>Angular:</strong> Framework completo mantido pelo Google.</li>
          </ul>

          <h4>Backend</h4>
          <ul>
            <li><strong>Node.js:</strong> Runtime JavaScript para servidor.</li>
            <li><strong>Express:</strong> Framework web minimalista para Node.js.</li>
            <li><strong>Django:</strong> Framework web em Python.</li>
          </ul>

          <p>A escolha da tecnologia adequada depende de vários fatores como:</p>
          <ol>
            <li>Requisitos do projeto</li>
            <li>Experiência da equipe</li>
            <li>Escalabilidade necessária</li>
            <li>Tempo de desenvolvimento disponível</li>
          </ol>

          <blockquote>
            <p>"Escolha a ferramenta certa para o trabalho certo. Não existe bala de prata no desenvolvimento de software."</p>
          </blockquote>
        `,
        author: users[1]._id
      },
      {
        title: 'Inteligência Artificial e Machine Learning: Fundamentos',
        content: `
          <h3>Fundamentos de IA e Machine Learning</h3>
          <p>A Inteligência Artificial (IA) e o Machine Learning (ML) são campos em rápida evolução que estão transformando diversos setores. Vamos explorar os conceitos básicos:</p>

          <h4>Tipos de Aprendizado de Máquina</h4>
          <ul>
            <li><strong>Supervisionado:</strong> O modelo aprende com dados rotulados</li>
            <li><strong>Não Supervisionado:</strong> O modelo encontra padrões em dados não rotulados</li>
            <li><strong>Por Reforço:</strong> O modelo aprende através de tentativa e erro</li>
          </ul>

          <p>Um exemplo simples de código para classificação usando Python e scikit-learn:</p>
          <pre><code>
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# Carregando o dataset
iris = datasets.load_iris()
X = iris.data
y = iris.target

# Dividindo em treino e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Treinando o modelo
model = LogisticRegression()
model.fit(X_train, y_train)

# Avaliando o modelo
score = model.score(X_test, y_test)
print(f"Acurácia: {score:.2f}")
          </code></pre>

          <h4>Aplicações Práticas</h4>
          <p>A IA e ML são utilizados em diversas áreas:</p>
          <ul>
            <li>Reconhecimento de imagens e voz</li>
            <li>Sistemas de recomendação</li>
            <li>Diagnóstico médico</li>
            <li>Carros autônomos</li>
            <li>Análise de dados financeiros</li>
          </ul>
        `,
        author: users[2]._id
      },
      {
        title: 'Estruturas de Dados Avançadas em Python',
        content: `
          <h3>Explorando Estruturas de Dados em Python</h3>
          <p>Python oferece uma rica variedade de estruturas de dados que são fundamentais para o desenvolvimento eficiente de aplicações. Vamos explorar algumas das estruturas mais avançadas:</p>

          <h4>1. Collections</h4>
          <pre><code>
from collections import defaultdict, Counter, deque

# Usando defaultdict
d = defaultdict(list)
d['a'].append(1)  # Não precisa verificar se a chave existe

# Usando Counter
c = Counter(['a', 'b', 'a', 'c', 'b', 'a'])
print(c.most_common(2))  # [('a', 3), ('b', 2)]

# Usando deque
dq = deque([1, 2, 3])
dq.appendleft(0)
dq.append(4)
          </code></pre>

          <h4>2. Heapq</h4>
          <p>A biblioteca heapq implementa o algoritmo de heap (fila de prioridade):</p>
          <pre><code>
import heapq

# Criando uma heap
heap = []
heapq.heappush(heap, 4)
heapq.heappush(heap, 1)
heapq.heappush(heap, 7)
print(heapq.heappop(heap))  # 1
          </code></pre>

          <h4>3. Bisect</h4>
          <p>Para trabalhar com listas ordenadas:</p>
          <pre><code>
import bisect

# Lista ordenada
numbers = [1, 3, 5, 7, 9]
bisect.insort(numbers, 4)
print(numbers)  # [1, 3, 4, 5, 7, 9]
          </code></pre>

          <blockquote>
            <p>"A escolha da estrutura de dados correta pode ser a diferença entre um programa eficiente e um ineficiente."</p>
          </blockquote>
        `,
        author: users[0]._id
      },
      {
        title: 'Padrões de Projeto em JavaScript',
        content: `
          <h3>Design Patterns em JavaScript Moderno</h3>
          <p>Os padrões de projeto são soluções reutilizáveis para problemas comuns no desenvolvimento de software. Vamos explorar alguns dos padrões mais úteis em JavaScript:</p>

          <h4>1. Singleton Pattern</h4>
          <pre><code>
class Database {
    private static instance: Database;
    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
          </code></pre>

          <h4>2. Observer Pattern</h4>
          <pre><code>
class EventEmitter {
    private events = {};

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}
          </code></pre>

          <h4>3. Factory Pattern</h4>
          <pre><code>
class UserFactory {
    createUser(type) {
        switch(type) {
            case 'admin':
                return new AdminUser();
            case 'regular':
                return new RegularUser();
            default:
                throw new Error('User type not supported');
        }
    }
}
          </code></pre>

          <p>Benefícios dos Padrões de Projeto:</p>
          <ul>
            <li>Código mais organizado e manutenível</li>
            <li>Soluções testadas e comprovadas</li>
            <li>Vocabulário comum entre desenvolvedores</li>
            <li>Redução de bugs e problemas de design</li>
          </ul>
        `,
        author: users[1]._id
      },
      {
        title: 'Segurança em Aplicações Web',
        content: `
          <h3>Práticas Essenciais de Segurança Web</h3>
          <p>A segurança é um aspecto crucial no desenvolvimento web moderno. Vamos explorar algumas das principais vulnerabilidades e como proteger contra elas:</p>

          <h4>1. Cross-Site Scripting (XSS)</h4>
          <p>Proteção contra XSS em React:</p>
          <pre><code>
// Errado
const UserInput = ({ data }) => (
  <div dangerouslySetInnerHTML={{ __html: data }} />
);

// Correto
const UserInput = ({ data }) => (
  <div>{data}</div>
);
          </code></pre>

          <h4>2. SQL Injection</h4>
          <p>Usando Prepared Statements:</p>
          <pre><code>
// Errado
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// Correto
const query = 'SELECT * FROM users WHERE id = ?';
connection.query(query, [userId]);
          </code></pre>

          <h4>3. CSRF Protection</h4>
          <pre><code>
// Express middleware
app.use(csrf());

// React component
const Form = () => (
  <form>
    <input type="hidden" name="_csrf" value={csrf_token} />
    {/* form fields */}
  </form>
);
          </code></pre>

          <blockquote>
            <p>"A segurança não é um produto, mas um processo." - Bruce Schneier</p>
          </blockquote>

          <h4>Checklist de Segurança:</h4>
          <ul>
            <li>Validação de entrada de dados</li>
            <li>Sanitização de saída</li>
            <li>Uso de HTTPS</li>
            <li>Autenticação forte</li>
            <li>Autorização adequada</li>
            <li>Logging e monitoramento</li>
          </ul>
        `,
        author: users[2]._id
      },
      {
        title: 'Arquitetura de Microsserviços',
        content: `
          <h3>Construindo Sistemas Distribuídos com Microsserviços</h3>
          <p>A arquitetura de microsserviços é um estilo arquitetural que estrutura uma aplicação como uma coleção de serviços pequenos e autônomos. Vamos explorar os principais conceitos e práticas:</p>

          <h4>Características dos Microsserviços</h4>
          <ul>
            <li><strong>Autonomia:</strong> Cada serviço pode ser desenvolvido, implantado e escalado independentemente</li>
            <li><strong>Especialização:</strong> Cada serviço é responsável por uma funcionalidade específica</li>
            <li><strong>Resiliência:</strong> Falhas em um serviço não devem afetar outros serviços</li>
            <li><strong>Descentralização:</strong> Gerenciamento descentralizado de dados e lógica</li>
          </ul>

          <h4>Exemplo de Comunicação entre Serviços</h4>
          <pre><code>
// Service A
@RestController
public class OrderController {
    @PostMapping("/orders")
    public Order createOrder(@RequestBody Order order) {
        // Processa o pedido
        kafkaTemplate.send("order-created", order);
        return orderRepository.save(order);
    }
}

// Service B
@KafkaListener(topics = "order-created")
public void handleOrderCreated(Order order) {
    // Processa o evento de pedido criado
    notificationService.notifyCustomer(order);
}
          </code></pre>

          <h4>Padrões de Microsserviços</h4>
          <ol>
            <li>Circuit Breaker</li>
            <li>Service Discovery</li>
            <li>API Gateway</li>
            <li>Event Sourcing</li>
            <li>CQRS</li>
          </ol>

          <blockquote>
            <p>"Não deixe que um serviço ruim derrube todo o seu sistema."</p>
          </blockquote>

          <h4>Ferramentas e Tecnologias</h4>
          <ul>
            <li>Docker e Kubernetes para containerização</li>
            <li>Spring Cloud para desenvolvimento</li>
            <li>Kafka ou RabbitMQ para mensageria</li>
            <li>Prometheus e Grafana para monitoramento</li>
            <li>ELK Stack para logging centralizado</li>
          </ul>
        `,
        author: users[0]._id
      },
      {
        title: 'Clean Code: Princípios e Práticas',
        content: `
          <h3>Escrevendo Código Limpo e Manutenível</h3>
          <p>Clean Code não é apenas sobre fazer o código funcionar, mas sobre torná-lo compreensível e manutenível. Vamos explorar os principais princípios e práticas:</p>

          <h4>1. Nomes Significativos</h4>
          <pre><code>
// Ruim
const d = new Date();
const x = users.filter(u => u.a > 18);

// Bom
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 18);
          </code></pre>

          <h4>2. Funções Pequenas e Focadas</h4>
          <pre><code>
// Ruim
function processUser(user) {
    // 100 linhas de código fazendo várias coisas
}

// Bom
function validateUser(user) {
    // validação específica
}

function saveUser(user) {
    // salvamento específico
}

function notifyUser(user) {
    // notificação específica
}
          </code></pre>

          <h4>3. Princípio da Responsabilidade Única</h4>
          <p>Cada classe ou módulo deve ter apenas uma razão para mudar:</p>
          <pre><code>
// Ruim
class UserManager {
    saveUser() { /* ... */ }
    sendEmail() { /* ... */ }
    generateReport() { /* ... */ }
}

// Bom
class UserRepository {
    save(user) { /* ... */ }
}

class EmailService {
    send(user) { /* ... */ }
}

class ReportGenerator {
    generate(data) { /* ... */ }
}
          </code></pre>

          <blockquote>
            <p>"Qualquer tolo pode escrever código que um computador entenda. Bons programadores escrevem código que humanos possam entender." - Martin Fowler</p>
          </blockquote>

          <h4>Princípios SOLID</h4>
          <ul>
            <li><strong>S</strong>ingle Responsibility Principle</li>
            <li><strong>O</strong>pen/Closed Principle</li>
            <li><strong>L</strong>iskov Substitution Principle</li>
            <li><strong>I</strong>nterface Segregation Principle</li>
            <li><strong>D</strong>ependency Inversion Principle</li>
          </ul>
        `,
        author: users[1]._id
      },
      {
        title: 'Testes Automatizados: Melhores Práticas',
        content: `
          <h3>Construindo uma Suite de Testes Robusta</h3>
          <p>Testes automatizados são essenciais para garantir a qualidade e manutenibilidade do código. Vamos explorar diferentes tipos de testes e melhores práticas:</p>

          <h4>1. Testes Unitários</h4>
          <pre><code>
describe('Calculator', () => {
  it('should add two numbers correctly', () => {
    const calculator = new Calculator();
    expect(calculator.add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    const calculator = new Calculator();
    expect(calculator.add(-2, 3)).toBe(1);
  });
});
          </code></pre>

          <h4>2. Testes de Integração</h4>
          <pre><code>
describe('UserService', () => {
  it('should create user and send welcome email', async () => {
    const userService = new UserService(
      new UserRepository(),
      new EmailService()
    );

    const user = await userService.createUser({
      name: 'John',
      email: 'john@example.com'
    });

    expect(user.id).toBeDefined();
    expect(emailService.sent).toBeTruthy();
  });
});
          </code></pre>

          <h4>3. Testes E2E</h4>
          <pre><code>
describe('Login Flow', () => {
  it('should login successfully', async () => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
          </code></pre>

          <h4>Pirâmide de Testes</h4>
          <ul>
            <li>Muitos testes unitários (base)</li>
            <li>Alguns testes de integração (meio)</li>
            <li>Poucos testes E2E (topo)</li>
          </ul>

          <blockquote>
            <p>"Testes são mais do que apenas encontrar bugs - eles são a documentação viva do seu código."</p>
          </blockquote>

          <h4>Boas Práticas</h4>
          <ol>
            <li>Siga o padrão AAA (Arrange, Act, Assert)</li>
            <li>Mantenha os testes independentes</li>
            <li>Use dados de teste significativos</li>
            <li>Evite lógica condicional nos testes</li>
            <li>Mantenha os testes rápidos</li>
          </ol>
        `,
        author: users[2]._id
      },
      {
        title: 'DevOps e CI/CD',
        content: `
          <h3>Implementando uma Pipeline de CI/CD Eficiente</h3>
          <p>DevOps é uma cultura que combina desenvolvimento e operações, enquanto CI/CD automatiza o processo de entrega de software. Vamos explorar como implementar essas práticas:</p>

          <h4>Pipeline Básica do GitHub Actions</h4>
          <pre><code>
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
        
    - name: Install Dependencies
      run: npm install
      
    - name: Run Tests
      run: npm test
      
    - name: Build
      run: npm run build
          </code></pre>

          <h4>Docker Compose para Ambiente de Desenvolvimento</h4>
          <pre><code>
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/usr/src/app
    depends_on:
      - db
      
  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
          </code></pre>

          <h4>Práticas Essenciais</h4>
          <ul>
            <li><strong>Integração Contínua:</strong>
              <ul>
                <li>Commits frequentes</li>
                <li>Testes automatizados</li>
                <li>Build automatizado</li>
              </ul>
            </li>
            <li><strong>Entrega Contínua:</strong>
              <ul>
                <li>Deploy automatizado</li>
                <li>Ambientes consistentes</li>
                <li>Rollback rápido</li>
              </ul>
            </li>
          </ul>

          <blockquote>
            <p>"Se dói, faça com mais frequência." - Martin Fowler sobre Integração Contínua</p>
          </blockquote>

          <h4>Ferramentas Populares</h4>
          <ol>
            <li>Jenkins</li>
            <li>GitHub Actions</li>
            <li>GitLab CI</li>
            <li>CircleCI</li>
            <li>Travis CI</li>
          </ol>
        `,
        author: users[0]._id
      }
    ];

    await Post.insertMany(posts);
    return res.status(201).json({ message: 'Posts criados com sucesso' });
  } catch (error) {
    console.error('Erro ao criar posts:', error);
    return res.status(500).json({ message: 'Erro ao criar posts' });
  }
}; 