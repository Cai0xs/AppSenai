// --- BASE DE DADOS CENTRALIZADA ---
const bancoAnuncios = [
    { id: 1, categoria: "mural", tag: "coord", tipo: "Coordenação", titulo: "Rematrícula 2026/2", desc: "Prezados alunos, o prazo de renovação de matrícula encerra no fim deste mês. Evitem contratempos realizando o processo na secretaria virtual." },
    { id: 2, categoria: "mural", tag: "prof", tipo: "Professor", titulo: "Entrega de Projetos - Redes", desc: "Professor Carlos avisa: A postagem dos relatórios finais de monitoramento de redes locais deve ser feita no ambiente virtual de aprendizagem até sexta." },
    { id: 3, categoria: "vagas", tag: "job", tipo: "Estágio", titulo: "Desenvolvedor Node.js Júnior", desc: "Empresa de tecnologia busca estudante para atuar no desenvolvimento de integrações de microsserviços e automações. Desejável conhecimento em JavaScript." },
    { id: 4, categoria: "vagas", tag: "job", tipo: "Estágio", titulo: "Suporte em Infraestrutura", desc: "Oportunidade para monitoramento de ativos de rede e configuração de switches. Envie seu currículo através da aba de serviços do portal." }
];

let abaAtual = "mural";
let filtroTagAtivo = "todos";

// --- PERSISTÊNCIA DO TEMA (LOCAL STORAGE) ---
document.addEventListener("DOMContentLoaded", () => {
    const temaSalvo = localStorage.getItem("app-theme") || "light";
    document.documentElement.setAttribute("data-theme", temaSalvo);
    
    const iconeTema = document.querySelector("#theme-toggle i");
    if (iconeTema) {
        iconeTema.className = temaSalvo === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
});

function alternarTema() {
    const temaAtual = document.documentElement.getAttribute("data-theme");
    const novoTema = temaAtual === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", novoTema);
    localStorage.setItem("app-theme", novoTema);
    
    const iconeTema = document.querySelector("#theme-toggle i");
    iconeTema.className = novoTema === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// --- CONTROLE DE TELAS (AUTENTICAÇÃO) ---
function alternarFormLogin(exibirRecuperacao) {
    document.getElementById("login-form-group").classList.toggle("hidden", exibirRecuperacao);
    document.getElementById("recovery-form-group").classList.toggle("hidden", !exibirRecuperacao);
    document.getElementById("login-error").innerText = "";
}

function efetuarLogin() {
    const rmInput = document.getElementById("login-rm").value.trim();
    const passwordInput = document.getElementById("login-password").value.trim();

    if (!rmInput || !passwordInput) {
        document.getElementById("login-error").innerText = "Por favor, preencha todos os campos.";
        return;
    }

    document.getElementById("login-screen").classList.remove("active");
    document.getElementById("app-screen").classList.add("active");
    renderizarConteudoComSkeleton();
}

function atualizarSenha() {
    document.getElementById("login-error").innerText = "Senha updated com sucesso!";
    alternarFormLogin(false);
}

function fecharSessao() {
    document.getElementById("app-screen").classList.remove("active");
    document.getElementById("login-screen").classList.add("active");
    document.getElementById("login-rm").value = "";
    document.getElementById("login-password").value = "";
}

// --- ORQUESTRADOR DE SKELETON SCREEN E ANIMAÇÕES ---
function renderizarConteudoComSkeleton() {
    const area = document.getElementById("content-area");
    area.classList.remove("fade-in-active");
    
    let skeletonsHtml = "";
    for(let i = 0; i < 2; i++) {
        skeletonsHtml += `
            <div class="skeleton-card">
                <div class="skeleton-line skeleton-tag"></div>
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-text-1"></div>
                <div class="skeleton-line skeleton-text-2"></div>
                <div class="skeleton-line skeleton-text-3"></div>
            </div>
        `;
    }
    area.innerHTML = skeletonsHtml;

    const barraFiltros = document.getElementById("quick-filters");
    if (abaAtual === "mural" || abaAtual === "vagas") {
        barraFiltros.style.display = "flex";
    } else {
        barraFiltros.style.display = "none";
    }

    setTimeout(() => {
        if (abaAtual === "servicos") {
            renderizarServicos(area);
        } else if (abaAtual === "horas-complementares") {
            renderizarHorasComplementares(area);
        } else if (abaAtual === "notas-faltas") {
            renderizarNotasFaltas(area);
        } else if (abaAtual === "cronograma") {
            renderizarCronograma(area);
        } else if (abaAtual === "perfil") {
            renderizarPerfil(area);
        } else {
            renderizarCardsFiltros(area);
        }
        area.classList.add("fade-in-active");
    }, 650);
}

// --- RENDERIZADORES DE INTERFACE COMPLETA ---

function renderizarCardsFiltros(container) {
    const termoPesquisa = document.getElementById("search-input").value.toLowerCase();
    
    const dadosFiltrados = bancoAnuncios.filter(item => {
        const pertenceAba = item.categoria === abaAtual;
        const pertenceTag = filtroTagAtivo === "todos" || item.tag === filtroTagAtivo;
        const batePesquisa = item.titulo.toLowerCase().includes(termoPesquisa) || item.desc.toLowerCase().includes(termoPesquisa);
        return pertenceAba && pertenceTag && batePesquisa;
    });

    if (dadosFiltrados.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-secondary); font-size:14px;"><i class="fa-solid fa-box-open" style="font-size:24px;margin-bottom:8px;display:block;"></i>Nenhum registro encontrado...</div>`;
        return;
    }

    container.innerHTML = dadosFiltrados.map(card => `
        <div class="card">
            <div class="card-header">
                <h3>${card.titulo}</h3>
                <span class="tag ${card.tag}">${card.tipo}</span>
            </div>
            <p class="card-desc">${card.desc}</p>
        </div>
    `).join('');
}

// RENDERIZA A GRADE DE SERVIÇOS PADRONIZADA COM O ÍCONE DO RELÓGIO LARANJA NO TOPO DO BOTÃO
function renderizarServicos(container) {
    container.innerHTML = `
        <h4 class="secao-titulo">Secretaria & Acadêmico</h4>
        <div class="links-grid">
            <a href="#" class="btn-link-util" onclick="mudarSubTela('notas-faltas')">
                <i class="fa-solid fa-file-invoice"></i>
                <span>Notas e Faltas</span>
            </a>
            <a href="#" class="btn-link-util" onclick="mudarSubTela('cronograma')">
                <i class="fa-solid fa-calendar-days"></i>
                <span>Cronograma</span>
            </a>
            <a href="https://www.sp.senai.br" target="_blank" class="btn-link-util">
                <i class="fa-solid fa-graduation-cap"></i>
                <span>Secretaria Virtual</span>
            </a>
            
            <a href="#" class="btn-link-util" onclick="mudarSubTela('horas-complementares')">
                <i class="fa-solid fa-clock"></i>
                <span>Horas Complementares</span>
            </a>
        </div>
        
        <h4 class="secao-titulo">Sistemas Externos</h4>
        <div class="links-grid">
            <a href="https://www.youtube.com" target="_blank" class="btn-link-util">
                <i class="fa-solid fa-circle-play"></i>
                <span>Portal de Vídeos</span>
            </a>
            <a href="https://www.sp.senai.br" target="_blank" class="btn-link-util">
                <i class="fa-solid fa-book"></i>
                <span>Biblioteca Digital</span>
            </a>
        </div>
    `;
}

function renderizarHorasComplementares(container) {
    container.innerHTML = `
        <div class="horas-container">
            <button class="btn-voltar-servicos" onclick="mudarSubTela('servicos')"><i class="fa-solid fa-chevron-left"></i> Voltar para Serviços</button>
            
            <div class="card-progresso-horas">
                <div class="relogio-status"><i class="fa-solid fa-clock"></i></div>
                <div class="horas-numeros">45h / 100h</div>
                <p class="horas-meta">Você concluiu 45% da carga horária obrigatória</p>
                <div class="barra-progresso-bg">
                    <div class="barra-progresso-fill"></div>
                </div>
            </div>

            <h4 class="secao-titulo">Atividades Validadas</h4>
            <div class="lista-atividades">
                <div class="atividade-item">
                    <div class="atividade-info">
                        <h4>Hackathon Frontend SENAI</h4>
                        <span>Validado em: 14/04/2026</span>
                    </div>
                    <div class="atividade-qtd">+25h</div>
                </div>
                <div class="atividade-item">
                    <div class="atividade-info">
                        <h4>Curso Extensão IoT (ESP32)</h4>
                        <span>Validado em: 05/05/2026</span>
                    </div>
                    <div class="atividade-qtd">+20h</div>
                </div>
            </div>
        </div>
    `;
}

function renderizarNotasFaltas(container) {
    container.innerHTML = `
        <button class="btn-voltar-servicos" onclick="mudarSubTela('servicos')"><i class="fa-solid fa-chevron-left"></i> Voltar para Serviços</button>
        <h4 class="secao-titulo" style="margin-top:15px;">Notas e Faltas</h4>
        <div class="card">
            <h3>Análise e Modelagem de Sistemas</h3>
            <p class="card-desc" style="margin-top:5px;">Média Parcial: <b>8.5</b> | Faltas: <b>2</b></p>
        </div>
        <div class="card">
            <h3>Arquitetura de Redes e IoT</h3>
            <p class="card-desc" style="margin-top:5px;">Média Parcial: <b>9.0</b> | Faltas: <b>0</b></p>
        </div>
    `;
}

function renderizarCronograma(container) {
    container.innerHTML = `
        <button class="btn-voltar-servicos" onclick="mudarSubTela('servicos')"><i class="fa-solid fa-chevron-left"></i> Voltar para Serviços</button>
        <h4 class="secao-titulo" style="margin-top:15px;">Cronograma de Aulas</h4>
        <div class="card">
            <h3>Segunda a Sexta</h3>
            <p class="card-desc" style="margin-top:5px;">Horário: 13h00 às 17h00<br>Ambiente: Laboratório de Redes e Automação</p>
        </div>
    `;
}

function renderizarPerfil(container) {
    container.innerHTML = `
        <div class="card" style="text-align: center; padding: 25px 15px;">
            <div style="width: 75px; height: 75px; background: var(--laranja-senai); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 12px auto; font-size: 26px; font-weight: bold; box-shadow: 0 4px 10px rgba(255,107,0,0.25);">
                CS
            </div>
            <h3 style="font-size: 18px; margin-bottom: 4px;">Caio Silva</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 15px;">RM: 2026110488</p>
            <div style="border-top: 1px solid var(--border-color); padding-top: 15px; text-align: left; font-size: 13.5px;">
                <p style="margin-bottom: 8px; color: var(--text-secondary);"><strong>Curso:</strong> Análise e Desenv. de Sistemas</p>
                <p style="margin-bottom: 8px; color: var(--text-secondary);"><strong>Período:</strong> 1º Módulo - Turma A</p>
                <p style="color: var(--text-secondary);"><strong>E-mail:</strong> caio.silva@aluno.senai.br</p>
            </div>
        </div>
    `;
}

// --- COMPLEMENTOS DE NAVEGAÇÃO ---
function mudarTab(idAba, evento) {
    abaAtual = idAba;
    filtroTagAtivo = "todos";

    const botoesFiltro = document.querySelectorAll(".filter-btn");
    botoesFiltro.forEach((btn, idx) => {
        btn.classList.toggle("active", idx === 0);
    });

    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    if (evento) {
        evento.currentTarget.classList.add("active");
    } else {
        document.getElementById(`tab-${idAba}`).classList.add("active");
    }

    renderizarConteudoComSkeleton();
}

function mudarSubTela(idSubTela) {
    abaAtual = idSubTela;
    renderizarConteudoComSkeleton();
}

function filtrarPorTag(idTag, botaoClicado) {
    filtroTagAtivo = idTag;
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    botaoClicado.classList.add("active");
    
    const area = document.getElementById("content-area");
    renderizarCardsFiltros(area);
}

function filtrarConteudo() {
    const area = document.getElementById("content-area");
    if (abaAtual === "mural" || abaAtual === "vagas") {
        renderizarCardsFiltros(area);
    }
}

// --- NOTIFICAÇÕES (PAINEL SLIDE-OUT) ---
function abrirNotificacoes() {
    document.getElementById("sidebar-overlay").style.display = "block";
    document.getElementById("notification-sidebar").classList.add("open");
    
    document.getElementById("sidebar-content").innerHTML = `
        <div class="noti-item">
            <h4>Aviso de Feriado</h4>
            <p>Não haverá aula nesta quinta-feira devido ao feriado regional prolongado.</p>
        </div>
        <div class="noti-item">
            <h4>Inscrições abertas</h4>
            <p>Inscrições para a maratona interna de desenvolvimento e redes encerram amanhã às 18h.</p>
        </div>
    `;
}

function fecharNotificacoes() {
    document.getElementById("sidebar-overlay").style.display = "none";
    document.getElementById("notification-sidebar").classList.remove("open");
}