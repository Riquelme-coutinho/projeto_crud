// 1. IMPORTAÇÕES PRINCIPAIS
// =============================================
require('dotenv').config(); // Carrega o .env
const express = require('express');
const path = require('path');
const session = require('express-session'); // Para o login

// 2. IMPORTAÇÃO DAS ROTAS
// =============================================
// Importa o "menu" de autenticação (login, cadastro, logout)
const authRoutes = require('./src/routes/authRoutes');
// Importa o "menu" do perfil
const profileRoutes = require('./src/routes/profileRoutes');

// 3. INICIALIZAÇÃO DO APP
// =============================================
const app = express();
const PORT = process.env.PORT || 3000;

// SEGURANÇA (Dica: O Helmet deve vir no início, antes das rotas)
const helmet = require('helmet');

app.use(
  helmet({
    contentSecurityPolicy: false,
    strictTransportSecurity: false, // Remove HSTS
    crossOriginOpenerPolicy: false, // Remove erro de política de abertura
    crossOriginResourcePolicy: false, // Permite carregar recursos externos
    originAgentCluster: false // Remove aviso de cluster
  })
);

// 4. CONFIGURAÇÃO (Middlewares)
// =============================================
// Configura o EJS (views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Configura a pasta de arquivos estáticos (CSS, imagens)
app.use(express.static(path.join(__dirname, 'src/public')));

// Configura o leitor de formulários
app.use(express.urlencoded({ extended: true }));
// Configura o leitor de JSON (para requisições AJAX/fetch)
app.use(express.json());

// Configura a Sessão (DEVE VIR ANTES DAS ROTAS)
app.use(session({
    secret: process.env.SESSION_SECRET || 'chave-padrao-desenvolvimento', // Usa variável de ambiente
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Em produção (HTTPS) mude para 'true'
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
}));

// 5. USO DAS ROTAS
// =============================================
// Rota Principal (Home)
app.get('/', (req, res) => {
    // Redireciona para o login, que é a "porta de entrada"
    res.redirect('/login');
});

// "Diz" ao Express para usar os "menus" que importamos.
// Todas as rotas em authRoutes (como /login, /cadastro) estarão ativas.
app.use(authRoutes);
// Todas as rotas em profileRoutes (como /perfil) estarão ativas.
app.use(profileRoutes);

// 6. INICIALIZAÇÃO DO SERVIDOR
// =============================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Local: http://localhost:${PORT}`);
    // O console avisa para você procurar o IP
    console.log(`🌐 Rede:  http://192.168.15.5:${PORT}`); 
});