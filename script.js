// --- BASE DE DADOS CENTRALIZADA ---
const bancoAnuncios = [
    { id: 1, categoria: "mural", tag: "coord", tipo: "Gestão", titulo: "Rematrícula 2026/2", desc: "Prezados alunos, o prazo de renovação de matrícula encerra no fim deste mês. Evitem contratempos realizando o processo na secretaria virtual." },
    { id: 2, categoria: "mural", tag: "prof", tipo: "Professor", titulo: "Entrega de Projetos - Redes", desc: "Professor Carlos avisa: A postagem dos relatórios finais de monitoramento de redes locais deve ser feita no ambiente virtual de aprendizagem até sexta." },
    { id: 5, categoria: "links", tag: "coord", tipo: "Links", titulo: "Ambiente Virtual de Aprendizagem (AVA)", desc: "Acesse o portal de conteúdos e aulas do SENAI: <a href='https://ava.sp.senai.br' target='_blank' style='color:var(--laranja-senai); text-decoration:underline; font-weight:600;'>ava.sp.senai.br</a>" },
    { id: 6, categoria: "links", tag: "coord", tipo: "Links", titulo: "Secretaria Digital Virtual", desc: "Consulte suas notas oficiais, faltas e emita documentos acadêmicos diretamente pelo portal: <a href='https://www.sp.senai.br' target='_blank' style='color:var(--laranja-senai); text-decoration:underline; font-weight:600;'>secretaria.virtual.senai</a>" },
    { id: 3, categoria: "vagas", tag: "job", tipo: "Estágio", titulo: "Desenvolvedor Node.js Júnior", desc: "Empresa de tecnologia busca estudante para atuar no desenvolvimento de integrações de microsserviços e automações. Desejável conhecimento em JavaScript." },
    { id: 4, categoria: "vagas", tag: "job", tipo: "Estágio", titulo: "Suporte em Infraestrutura", desc: "Oportunidade para monitoramento de ativos de rede e configuração de switches. Envie seu currículo diretamente pelo portal interno." }
];

// --- ESTADO GLOBAL ---
let abaAtual = "mural";
let filtroTagAtivo = "todos";
let dadosUsuario = {
    nome: "Caio Silva",
    rm: "2026110488",
    curso: "Análise e Desenv. de Sistemas",
    turma: "Turma A",
    turno: "Noite",
    email: "caio.silva@aluno.senai.br"
};

// --- TEMA ---
document.addEventListener("DOMContentLoaded", () => {
    const temaSalvo = localStorage.getItem("app-theme") || "light";
    document.documentElement.setAttribute("data-theme", temaSalvo);
    const iconeTema = document.querySelector("#theme-toggle i");
    if(iconeTema) iconeTema.className = temaSalvo === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
});

function alternarTema() {
    const novoTema = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", novoTema);
    localStorage.setItem("app-theme", novoTema);
    document.querySelector("#theme-toggle i").className = novoTema === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// --- LOGIN ---
function efetuarLogin() {
    if (!document.getElementById("login-rm").value || !document.getElementById("login-password").value) {
        document.getElementById("login-error").innerText = "Preencha todos os campos.";
        return;
    }
    document.getElementById("login-screen").classList.remove("active");
    document.getElementById("app-screen").classList.add("active");
    document.getElementById("welcome-text").innerText = "Olá, Sou seu Comunic!";
    renderizarConteudoComSkeleton();
}

function fecharSessao() {
    document.getElementById("app-screen").classList.remove("active");
    document.getElementById("login-screen").classList.add("active");
}

// --- RENDERIZAÇÃO ---
function renderizarConteudoComSkeleton() {
    const area = document.getElementById("content-area");
    area.innerHTML = `<div class="skeleton-card" style="height:150px; margin-bottom:10px;"></div>`.repeat(2);
    
    const filtros = document.getElementById("quick-filters");
    if(filtros) filtros.style.display = (abaAtual === "perfil") ? "none" : "flex";
    
    setTimeout(() => {
        abaAtual === "perfil" ? renderizarPerfil(area) : renderizarCardsFiltros(area);
    }, 500);
}

function renderizarCardsFiltros(container) {
    // Busca removida: apenas filtra por categoria e tag
    const filtrados = bancoAnuncios.filter(i => 
        i.categoria === abaAtual && 
        (filtroTagAtivo === "todos" || i.tag === filtroTagAtivo)
    );
    
    container.innerHTML = filtrados.length ? filtrados.map(c => `
        <div class="card">
            <div class="card-header"><h3>${c.titulo}</h3><span class="tag ${c.tag}">${c.tipo}</span></div>
            <p class="card-desc">${c.desc}</p>
        </div>`).join('') : `<p style="text-align:center; padding:20px;">Nenhum registro encontrado.</p>`;
}

function renderizarPerfil(container) {
    const iniciais = dadosUsuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    container.innerHTML = `
        <div class="card" style="padding: 20px 15px; position: relative;">
            <div style="position: absolute; top: 15px; right: 15px; display: flex; gap: 14px; font-size: 16px;">
                <button onclick="executarAtualizacaoPerfil(this)" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; transition: color 0.2s, transform 0.5s ease;" onmouseover="this.style.color='var(--laranja-senai)'" onmouseout="this.style.color='var(--text-secondary)'">
                    <i class="fa-solid fa-rotate-right"></i>
                </button>
                <button onclick="abrirModalPerfil()" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--laranja-senai)'" onmouseout="this.style.color='var(--text-secondary)'">
                    <i class="fa-solid fa-gear"></i>
                </button>
            </div>

            <div style="text-align: center; margin-top: 10px;">
                <div style="width: 75px; height: 75px; background: var(--laranja-senai); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 12px auto; font-size: 26px; font-weight: bold; box-shadow: 0 4px 10px rgba(255,107,0,0.25);">
                    ${iniciais}
                </div>
                <h3 style="font-size: 18px; margin-bottom: 4px; color: var(--text-primary);">${dadosUsuario.nome}</h3>
                <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 15px;">RM: ${dadosUsuario.rm}</p>
            </div>

            <div style="border-top: 1px solid var(--border-color); padding-top: 15px; text-align: left; font-size: 13.5px;">
                <p style="margin-bottom: 8px; color: var(--text-secondary);"><strong>Curso:</strong> ${dadosUsuario.curso}</p>
                <p style="margin-bottom: 8px; color: var(--text-secondary);"><strong>Turma:</strong> ${dadosUsuario.turma}</p>
                <p style="margin-bottom: 8px; color: var(--text-secondary);"><strong>Turno:</strong> ${dadosUsuario.turno}</p>
                <p style="color: var(--text-secondary);"><strong>E-mail:</strong> ${dadosUsuario.email}</p>
            </div>
        </div>
    `;
}

// --- AÇÕES DO PERFIL ---
function executarAtualizacaoPerfil(botao) {
    botao.style.transform = "rotate(360deg)";
    setTimeout(() => { botao.style.transform = "rotate(0deg)"; }, 500);
    renderizarConteudoComSkeleton();
}

function abrirModalPerfil() {
    document.getElementById("edit-nome").value = dadosUsuario.nome;
    document.getElementById("edit-curso").value = dadosUsuario.curso;
    document.getElementById("edit-turma").value = dadosUsuario.turma;
    document.getElementById("edit-turno").value = dadosUsuario.turno;
    document.getElementById("modal-overlay").style.display = "flex";
}

function fecharModalPerfil() { document.getElementById("modal-overlay").style.display = "none"; }

function salvarConfiguracoesPerfil() {
    dadosUsuario.nome = document.getElementById("edit-nome").value;
    dadosUsuario.curso = document.getElementById("edit-curso").value;
    dadosUsuario.turma = document.getElementById("edit-turma").value;
    dadosUsuario.turno = document.getElementById("edit-turno").value;

    document.getElementById("welcome-text").innerText = "Olá, Sou seu Comunic!";
    document.getElementById("user-info").innerText = dadosUsuario.curso;

    fecharModalPerfil();
    renderizarPerfil(document.getElementById("content-area"));
}

// --- NAVEGAÇÃO E FILTROS ---
function mudarTab(id, e) {
    abaAtual = id;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    e.currentTarget.classList.add("active");
    renderizarConteudoComSkeleton();
}

function filtrarPorTag(tag, btn) {
    filtroTagAtivo = tag;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderizarCardsFiltros(document.getElementById("content-area"));
}

function abrirNotificacoes() {
    const container = document.getElementById("sidebar-content");
    
    const minhasNotificacoes = [
        { titulo: "Rematrícula 2026/2", tag: "Gest", tipo: "Gestão", desc: "O prazo encerra no fim deste mês. Realize na secretaria." },
        { titulo: "Entrega de Projetos", tag: "prof", tipo: "Professor", desc: "Postagem no AVA até sexta-feira." }
    ];

    container.innerHTML = `
        <div style="padding: 10px;">
            ${minhasNotificacoes.map(n => `
                <div class="card" style="margin-bottom: 15px; cursor: pointer;">
                    <div class="card-header">
                        <h3 style="font-size: 14px;">${n.titulo}</h3>
                        <span class="tag ${n.tag}" style="font-size: 9px; padding: 3px 6px;">${n.tipo}</span>
                    </div>
                    <p class="card-desc" style="font-size: 12px; margin-top: 5px;">${n.desc}</p>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById("sidebar-overlay").style.display = "block";
    document.getElementById("notification-sidebar").classList.add("open");
}

function fecharNotificacoes() {
    document.getElementById("sidebar-overlay").style.display = "none";
    document.getElementById("notification-sidebar").classList.remove("open");
}