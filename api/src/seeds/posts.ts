import mongoose from 'mongoose';
import { IPost } from '../models/Post';
import { User } from '../models/User';

export const seedPosts = async () => {
  try {
    const Post = mongoose.model<IPost>('Post');
    const count = await Post.countDocuments();
    if (count > 0) {
      console.log('Posts já existem no banco de dados');
      return;
    }

    const users = await User.find();
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado para criar posts');
      return;
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
      }
    ];

    await Post.insertMany(posts);
    console.log('Posts criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar posts:', error);
  }
}; 