import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'BibliotecaSecret123',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

app.use(cookieParser());

var listaLivros = [];
var listaLeitores = [];

app.get('/menu', isLogado, (req, res) => {
    const ultimoAcesso = req.cookies?.ultimoAcesso || 'Primeiro acesso';

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Menu Principal - Biblioteca</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    background: linear-gradient(135deg, #36502c, #60af4c);
                }
                .container-main {
                    height: 100vh;
                }
                .row {
                    height: 100%;
                    margin: 0;
                }
                .menu-box {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .titulo {
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                .btn-custom {
                    background-color: #36502c;
                    color: white;
                }
                .btn-custom:hover {
                    background-color: #1a2f1a;
                    color: white;
                }
                .imagem {
                    background-image: url('https://i.pinimg.com/736x/d4/b0/31/d4b031c5fbc0cbab11e922c9ece130f2.jpg');
                    background-size: cover;
                    background-position: center;
                    height: 100vh;
                }
                .ultimo-acesso {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #555;
                }
            </style>
        </head>
        <body>
        <div class="container-fluid container-main">
            <div class="row align-items-center h-100">
                <div class="col-md-6 d-flex justify-content-center">
                    <div class="menu-box">
                        <h3 class="titulo">Sistema de Biblioteca</h3>
                        <div id="ultimoAcesso" class="ultimo-acesso">
                            Último acesso: ${ultimoAcesso}
                        </div>
                        <div class="d-grid gap-2 mt-4">
                            <a href="/cadastroLivro" class="btn btn-custom">Cadastro de Livros</a>
                            <a href="/cadastroLeitor" class="btn btn-custom">Cadastro de Leitores</a>
                            <a href="/logout" class="btn btn-danger">Logout</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 d-none d-md-block p-0">
                    <div class="imagem"></div>
                </div>
            </div>
        </div>
        </body>
        </html>
        `);
});
    
app.get('/cadastroLivro', isLogado, (req, res) => {
    res.write(`
        
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Livros</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    background: linear-gradient(135deg, #36502c, #60af4c);
                }
                .container-main {
                    min-height: 100vh;
                    padding: 20px;
                }
                .form-box {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 500px;
                }
                .title {
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .btn-custom {
                    background-color: #36502c;
                    color: white;
                }
                .btn-custom:hover {
                    background-color: #1a2f1a;
                    color: white;
                }
            </style>
        </head>
        <body>
        <div class="container container-main d-flex justify-content-center">
            <div class="form-box">
                <h3 class="title">Cadastro de Livro</h3>
                <form method="POST" action="/cadastroLivro">
                    <div class="mb-3">
                        <label class="form-label">Título do Livro</label>
                        <input type="text" class="form-control" placeholder="Digite o título" name="titulo" id="titulo">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nome do Autor</label>
                        <input type="text" class="form-control" placeholder="Digite o autor" name="autor" id="autor">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">ISBN / Código</label>
                        <input type="text" class="form-control" placeholder="Digite o ISBN ou código" name="isbn" id="isbn">
                    </div>
                    <div class="d-grid gap-2 mt-3">
                        <button type="submit" class="btn btn-custom">Cadastrar</button>
                        <a href="/menu" class="btn btn-secondary">Voltar</a>
                    </div>
                </form>
            </div>
        </div>
        </body>
        </html>

        `);
    res.end();
});

app.post('/cadastroLivro', isLogado, (req, res) => {
    
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const isbn = req.body.isbn;

    if(!titulo || !autor || !isbn){
    
        let html = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Livros</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    background: linear-gradient(135deg, #36502c, #60af4c);
                }
                .container-main {
                    min-height: 100vh;
                    padding: 20px;
                }
                .form-box {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 500px;
                }
                .title {
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .btn-custom {
                    background-color: #36502c;
                    color: white;
                }
                .btn-custom:hover {
                    background-color: #1a2f1a;
                    color: white;
                }
            </style>
        </head>
        <body>
        <div class="container container-main d-flex justify-content-center">
            <div class="form-box">
                <h3 class="title">Cadastro de Livro</h3>
                <form method="POST" action="/cadastroLivro">
                    <div class="mb-3">
                        <label class="form-label">Título do Livro</label>
                        <input type="text" class="form-control" placeholder="Digite o título" name="titulo" id="titulo" value="${titulo}">`;

                        if(!titulo){

                            html+= `
                                <div class="alert alert-danger" role="alert">
                                Por favor, informe o título do livro.
                                </div>
                                `; 
                        }

                        html+= `
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nome do Autor</label>
                        <input type="text" class="form-control" placeholder="Digite o autor" name="autor" id="autor" value="${autor}">`

                        if(!autor){

                            html+= `
                                <div class="alert alert-danger" role="alert">
                                Por favor, informe o autor do livro.
                                </div>
                                `; 
                        }

                        html+= `
                    </div>
                    <div class="mb-3">
                        <label class="form-label">ISBN / Código</label>
                        <input type="text" class="form-control" placeholder="Digite o ISBN ou código" name="isbn" id="isbn" value="${isbn}">`;

                        if(!isbn){

                            html+= `
                                <div class="alert alert-danger" role="alert">
                                Por favor, informe o ISBN ou código do livro.
                                </div>
                                `; 
                        }

                        html+= `
                    </div>
                    <div class="d-grid gap-2 mt-3">
                        <button type="submit" class="btn btn-custom">Cadastrar</button>
                        <a href="/menu" class="btn btn-secondary">Voltar</a>
                    </div>
                </form>
            </div>
        </div>
        </body>
        </html>`;

    res.write(html);
    res.end();

    } else {

        listaLivros.push({
            "titulo": titulo,
            "autor": autor,
            "isbn": isbn
        });

        res.redirect('/listaLivros');
    }
});

app.get('/listaLivros', isLogado, (req, res) => {

    let linhas = '';

    if(listaLivros.length === 0){
        linhas += `
            <tr>
                <td colspan="3">Nenhum livro cadastrado</td>
            </tr>
        `;
    } else {
        for(let i = 0; i < listaLivros.length; i++){
            linhas += `
                <tr>
                    <td>${listaLivros[i].titulo}</td>
                    <td>${listaLivros[i].autor}</td>
                    <td>${listaLivros[i].isbn}</td>
                </tr>
            `;
        }
    }

    res.send(`

        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Livros Cadastrados</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    background: linear-gradient(135deg, #36502c, #60af4c);
                }
                .container-main {
                    min-height: 100vh;
                    padding: 20px;
                }
                .table-box {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 800px;
                }
                .title {
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .btn-custom {
                    background-color: #36502c;
                    color: white;
                }
                .btn-custom:hover {
                    background-color: #1a2f1a;
                    color: white;
                }
            </style>
        </head>
        <body>
        <div class="container container-main d-flex justify-content-center">
            <div class="table-box">
                <h3 class="title">Livros Cadastrados</h3>
                <div class="table-responsive">
                    <table class="table table-striped text-center">
                        <thead class="table-dark">
                            <tr>
                                <th>Título</th>
                                <th>Autor</th>
                                <th>ISBN</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${linhas}
                        </tbody>
                    </table>
                </div>
                <div class="d-grid gap-2 mt-3">
                    <a href="/cadastroLivro" class="btn btn-custom">Cadastrar Novo Livro</a>
                    <a href="/menu" class="btn btn-secondary">Voltar ao Menu</a>
                </div>
            </div>
        </div>
        </body>
        </html>

    `);
});

app.get('/cadastroLeitor', isLogado, (req, res) => {
    
    let options = '';

    for(let i = 0; i < listaLivros.length; i++){
        options += `<option value="${listaLivros[i].titulo}">${listaLivros[i].titulo}</option>`;
    }

    res.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Leitor</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    background: linear-gradient(135deg, #36502c, #60af4c);
                }
                .container-main {
                    min-height: 100vh;
                    padding: 20px;
                }
                .form-box {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 500px;
                }
                .title {
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .btn-custom {
                    background-color: #36502c;
                    color: white;
                }
                .btn-custom:hover {
                    background-color: #1a2f1a;
                    color: white;
                }
            </style>
        </head>
        <body>
        <div class="container container-main d-flex justify-content-center">
            <div class="form-box">
                <h3 class="title">Cadastro de Leitor</h3>
                <form method="POST" action="/cadastroLeitor">
                    <div class="mb-3">
                        <label class="form-label">Nome do Leitor</label>
                        <input type="text" class="form-control" placeholder="Digite o nome" name="nome" id="nome">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">CPF</label>
                        <input type="text" class="form-control" placeholder="Digite o CPF" name="cpf" id="cpf">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Telefone</label>
                        <input type="tel" class="form-control" placeholder="Digite o telefone" name="telefone" id="telefone">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Data de Empréstimo</label>
                        <input type="date" class="form-control" name="dataEmprestimo" id="dataEmprestimo">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Data de Devolução</label>
                        <input type="date" class="form-control" name="dataDevolucao" id="dataDevolucao">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Livro</label>
                        <select class="form-control" name="nomeLivro" id="nomeLivro">
                            <option value="">Selecione um livro</option>
                            ${options}
                        </select>
                    </div>
                    <div class="d-grid gap-2 mt-3">
                        <button type="submit" class="btn btn-custom">Cadastrar</button>
                        <a href="/menu" class="btn btn-secondary">Voltar</a>
                    </div>
                </form>
            </div>
        </div>
        </body>
        </html>

        `);
    res.end();
});

app.post('/cadastroLeitor', isLogado, (req, res) => {
    
const nome = req.body.nome;
const cpf = req.body.cpf;
const telefone = req.body.telefone;
const dataEmprestimo = req.body.dataEmprestimo;
const dataDevolucao = req.body.dataDevolucao;
const nomeLivro = req.body.nomeLivro;

let options = '';
for(let i = 0; i < listaLivros.length; i++){
    options += `<option value="${listaLivros[i].titulo}" ${nomeLivro === listaLivros[i].titulo ? 'selected' : ''}>${listaLivros[i].titulo}</option>`;
}

    if(!nome || !cpf || !telefone || !dataEmprestimo || !dataDevolucao || !nomeLivro){

        let html = `
    <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Leitor</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    margin: 0;
                    background: linear-gradient(135deg, #36502c, #60af4c);
                }
                .container-main {
                    min-height: 100vh;
                    padding: 20px;
                }
                .form-box {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 500px;
                }
                .title {
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .btn-custom {
                    background-color: #36502c;
                    color: white;
                }
                .btn-custom:hover {
                    background-color: #1a2f1a;
                    color: white;
                }
            </style>
        </head>
        <body>
        <div class="container container-main d-flex justify-content-center">
            <div class="form-box">
                <h3 class="title">Cadastro de Leitor</h3>
                <form method="POST" action="/cadastroLeitor">
                    <div class="mb-3">
                        <label class="form-label">Nome do Leitor</label>
                        <input type="text" class="form-control" placeholder="Digite o nome" name="nome" id="nome" value="${nome}">`;

                        if(!nome){
                            html += `<div class="alert alert-danger" role="alert">
                            O campo Nome do Leitor é obrigatório!
                            </div>`;
                        }

                        html += `
                    </div>
                    <div class="mb-3">
                        <label class="form-label">CPF</label>
                        <input type="text" class="form-control" placeholder="Digite o CPF" name="cpf" id="cpf" value="${cpf}">`;

                        if(!cpf){
                            html += `<div class="alert alert-danger" role="alert">
                            O campo CPF é obrigatório!
                            </div>`;
                        }

                        html += `
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Telefone</label>
                        <input type="tel" class="form-control" placeholder="Digite o telefone" name="telefone" id="telefone" value="${telefone}">`;

                        if(!telefone){
                            html += `<div class="alert alert-danger" role="alert">
                            O campo Telefone é obrigatório!
                            </div>`;
                        }

                        html += `
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Data de Empréstimo</label>
                        <input type="date" class="form-control" name="dataEmprestimo" id="dataEmprestimo" value="${dataEmprestimo}">`;

                        if(!dataEmprestimo){    
                            html += `<div class="alert alert-danger" role="alert">
                            O campo Data de Empréstimo é obrigatório!
                            </div>`;
                        }
                        
                        html += `
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Data de Devolução</label>
                        <input type="date" class="form-control" name="dataDevolucao" id="dataDevolucao" value="${dataDevolucao}">`;

                        if(!dataDevolucao){
                            html += `<div class="alert alert-danger" role="alert">
                            O campo Data de Devolução é obrigatório!
                            </div>`;
                        }

                        html += `
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nome do Livro</label>
                        <select class="form-control" name="nomeLivro" id="nomeLivro">
                            <option value="">Selecione um livro</option>
                            ${options}
                        </select>`;

                        if(!nomeLivro){
                            html += `<div class="alert alert-danger" role="alert">
                            O campo Nome do Livro é obrigatório!
                            </div>`;
                        }

                        html += `
                    </div>
                    <div class="d-grid gap-2 mt-3">
                        <button type="submit" class="btn btn-custom">Cadastrar</button>
                        <a href="/menu" class="btn btn-secondary">Voltar</a>
                    </div>
                </form>
            </div>
        </div>
        </body>
        </html>`;

        res.write(html);
        res.end();

    } else {
        listaLeitores.push({
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "dataEmprestimo": dataEmprestimo,
            "dataDevolucao": dataDevolucao,
            "nomeLivro": nomeLivro
        });

        res.redirect("/menu");
    }
});

app.get('/login', (req, res) => {
    
    res.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login - Biblioteca</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background: linear-gradient(135deg, #36502c, #60af4c);
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .login-container {
                    background-color: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0px 4px 20px rgba(0,0,0,0.2);
                    width: 100%;
                    max-width: 400px;
                }
                .titulo-login {
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .btn-custom {
                    background-color: #36502c;
                    color: white;
                }
                .btn-custom:hover {
                    background-color: #1a2f1a;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h3 class="titulo-login">BIBLIOTECA - LOGIN</h3>
                <form method="POST" action="/login">
                    <div class="mb-3">
                        <label class="form-label">Usuário</label>
                        <input type="text" class="form-control" placeholder="Digite seu usuário" id="usuario" name="usuario">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Senha</label>
                        <input type="password" class="form-control" placeholder="Digite sua senha" id="senha" name="senha">
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-custom">Entrar</button>
                    </div>
                    <div class="text-center mt-3">
                        <small>© 2026 Sistema de Gerenciamento de Biblioteca - PPI</small>
                    </div>
                </form>
            </div>
        </body>
        </html>
    `);
    res.end();
});

app.post('/login', (req, res) => {
    const usuario = req.body.usuario;
    const senha   = req.body.senha;

    if (usuario === 'admin' && senha === '123456') {
        req.session.logado = true; // marca o usuário como autenticado na sessão

        const dataUltimoAcesso = new Date();
        res.cookie('ultimoAcesso', dataUltimoAcesso.toLocaleString(), {
            maxAge: 1000 * 60 * 30, // cookie dura 30 minutos
            httpOnly: true
        });

        res.redirect('/menu');
    } else {
        // reexibe o formulário com mensagem de erro
        res.write(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Login - Biblioteca</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background: linear-gradient(135deg, #36502c, #60af4c);
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .login-container {
                        background-color: white;
                        padding: 30px;
                        border-radius: 15px;
                        box-shadow: 0px 4px 20px rgba(0,0,0,0.2);
                        width: 100%;
                        max-width: 400px;
                    }
                    .titulo-login {
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .btn-custom {
                        background-color: #36502c;
                        color: white;
                    }
                    .btn-custom:hover {
                        background-color: #1a2f1a;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="login-container">
                    <h3 class="titulo-login">Biblioteca - Login</h3>
                    <form method="POST" action="/login">
                        <div class="mb-3">
                            <label class="form-label">Usuário</label>
                            <input type="text" class="form-control" placeholder="Digite seu usuário" id="usuario" name="usuario">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Senha</label>
                            <input type="password" class="form-control" placeholder="Digite sua senha" id="senha" name="senha">
                        </div>
                        <div class="d-grid">
                            <button type="submit" class="btn btn-custom">Entrar</button>
                        </div>
                        <div class="text-center mt-3">
                            <div class="alert alert-danger" role="alert">Usuário ou senha inválidos!</div>
                            <small>© 2026 Sistema de Gerenciamento de Biblioteca - PPI</small>
                        </div>
                    </form>
                </div>
            </body>
            </html>
            `);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(); // encerra e apaga a sessão
    res.redirect('/login');
});

function isLogado(req, res, prox){

    if(req.session?.logado){
        prox();
    } else {
        res.redirect('/login');
    }
}

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});