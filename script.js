// ----------- NAVEGAÇÃO ENTRE TELAS -------------
function showScreen(screen) {
  // Oculta todos os jogos
  document.querySelectorAll('.game-container').forEach(el => el.classList.remove('active'));
  if (screen === 'home') {
    document.getElementById('homeScreen').classList.add('active');
  } else if (screen === 'quizrapido') {
    document.getElementById('quizRapidoGame').classList.add('active');
    startQuizRapido();
  } else if (screen === 'quem') {
    document.getElementById('quemGame').classList.add('active');
    startQuem();
  } else if (screen === 'sequencia') {
    document.getElementById('sequenciaGame').classList.add('active');
    startSequencia();
  } else if (screen === 'corta') {
    document.getElementById('cortaGame').classList.add('active');
    startCorta();
  } else if (screen === 'multiplica') {
    document.getElementById('multiplicaGame').classList.add('active');
    startMultiplica();
  } else if (screen === 'moedas') {
    document.getElementById('moedasGame').classList.add('active');
    startMoedas();
  }
}

function startGame(game) {
  showScreen(game);
}

// ----------- ESTATÍSTICAS -------------
let stats = { jogos: 0, acertos: 0 };
function atualizaStats(acertos = 0) {
  stats.jogos++;
  stats.acertos += acertos;
  document.getElementById('total-games').textContent = stats.jogos;
  document.getElementById('total-hits').textContent = stats.acertos;
}
function playAcerto() { document.getElementById('audio-certo').play(); }
function playErro() { document.getElementById('audio-errado').play(); }
function playClick() { document.getElementById('audio-click').play(); }

// ----------- QUIZ RÁPIDO -------------
const quizRapidoQuestoes = [
  { pergunta: "Ter uma reserva de emergência é importante.", resposta: true, explicacao: "Ajuda a evitar dívidas em imprevistos." },
  { pergunta: "Cheques são sempre a melhor forma de pagamento.", resposta: false, explicacao: "Existem opções mais seguras e práticas." },
  { pergunta: "Investimento em poupança nunca tem risco.", resposta: false, explicacao: "Toda aplicação financeira tem algum risco, mesmo pequeno." },
  { pergunta: "Fazer compras parceladas sempre custa o mesmo que à vista.", resposta: false, explicacao: "Parcelamentos geralmente incluem juros." }
];
let quizRapidoIndex = 0, quizRapidoScore = 0, quizRapidoTimer = null, quizRapidoTempo = 30;
function startQuizRapido() {
  quizRapidoIndex = 0; quizRapidoScore = 0;
  document.getElementById('quizrapido-score').style.display = 'none';
  document.getElementById('quizrapido-feedback').style.display = 'none';
  quizRapidoTempo = 30;
  document.getElementById('quizrapido-timer').textContent = `Tempo restante: ${quizRapidoTempo}s`;
  renderQuizRapido();
  if (quizRapidoTimer) clearInterval(quizRapidoTimer);
  quizRapidoTimer = setInterval(()=>{
    quizRapidoTempo--;
    document.getElementById('quizrapido-timer').textContent = `Tempo restante: ${quizRapidoTempo}s`;
    if(quizRapidoTempo<=0) { clearInterval(quizRapidoTimer); finalizaQuizRapido(); }
  },1000);
}
function renderQuizRapido() {
  if (quizRapidoIndex >= quizRapidoQuestoes.length) { finalizaQuizRapido(); return; }
  document.getElementById('quizrapido-question').textContent = quizRapidoQuestoes[quizRapidoIndex].pergunta;
}
function responderQuizRapido(v) {
  if (quizRapidoTempo <= 0) return;
  let certa = quizRapidoQuestoes[quizRapidoIndex].resposta === v;
  let fb = document.getElementById('quizrapido-feedback');
  fb.innerHTML = (certa ? "Correto! " : "Errado! ") + quizRapidoQuestoes[quizRapidoIndex].explicacao;
  fb.style.display = "block";
  if (certa) { quizRapidoScore++; playAcerto(); }
  else playErro();
  setTimeout(()=>{ fb.style.display = 'none'; quizRapidoIndex++; renderQuizRapido(); }, 900);
}
function finalizaQuizRapido() {
  clearInterval(quizRapidoTimer);
  document.getElementById('quizrapido-score').innerHTML = `Você acertou <strong>${quizRapidoScore} de ${quizRapidoQuestoes.length}</strong>!`;
  document.getElementById('quizrapido-score').style.display = 'block';
  atualizaStats(quizRapidoScore);
}

// ---------- QUEM SOU EU -------------
const quemPerguntas = [
  { dica: "Sou uma quantia guardada para imprevistos.", resposta: "reserva de emergência" },
  { dica: "Sou o valor que sobra após pagar todas as contas.", resposta: "poupança" },
  { dica: "Sou o dinheiro emprestado pelo banco com cobrança de juros.", resposta: "empréstimo" },
  { dica: "Sou um documento para pagamento, muito usado no Brasil.", resposta: "boleto" }
];
let quemAtiva = 0, quemScore = 0;
function startQuem() {
  quemAtiva = 0; quemScore = 0;
  document.getElementById('quem-score').style.display = 'none';
  document.getElementById('quem-feedback').style.display = 'none';
  renderQuem();
}
function renderQuem() {
  if (quemAtiva >= quemPerguntas.length) { document.getElementById('quem-score').textContent = `Acertou ${quemScore} de ${quemPerguntas.length}`; document.getElementById('quem-score').style.display = 'block'; atualizaStats(quemScore); return; }
  document.getElementById('quem-dica').textContent = quemPerguntas[quemAtiva].dica;
  document.getElementById('quem-resposta').value = '';
}
function responderQuem() {
  let resposta = document.getElementById('quem-resposta').value.trim().toLowerCase();
  let correta = quemPerguntas[quemAtiva].resposta.toLowerCase();
  let fb = document.getElementById('quem-feedback');
  if(resposta === correta) { 
    fb.innerHTML = "Correto!"; 
    quemScore++; playAcerto();
  } else { 
    fb.innerHTML = `Errado! Resposta era: <b>${quemPerguntas[quemAtiva].resposta}</b>`; 
    playErro();
  }
  fb.style.display = 'block';
  quemAtiva++;
  setTimeout(()=>{ fb.style.display = 'none'; renderQuem(); }, 1100);
}

// ---------- ARRUME A SEQUÊNCIA -------------
const sequencias = [
  { etapas: ["Receber salário", "Pagar contas essenciais", "Guardar para emergências", "Gastar com lazer"], correta: [0,1,2,3] }
];
let seqAtiva = 0, seqOrdem = [];
function startSequencia() {
  seqAtiva = 0;
  seqOrdem = [...sequencias[seqAtiva].etapas];
  renderSequencia();
  document.getElementById('sequencia-feedback').style.display = 'none';
}
function renderSequencia() {
  let lista = document.getElementById('sequencia-lista');
  lista.innerHTML = '';
  seqOrdem.forEach((etapa, idx) => {
    let el = document.createElement('div');
    el.className = 'sequencia-item';
    el.draggable = true;
    el.textContent = etapa;
    el.ondragstart = (e)=>{ e.dataTransfer.setData('idx', idx); };
    el.ondrop = (e)=>{
      let from = parseInt(e.dataTransfer.getData('idx'));
      let to = idx;
      seqOrdem.splice(to,0,seqOrdem.splice(from,1)[0]);
      renderSequencia();
    };
    el.ondragover = (e)=>e.preventDefault();
    lista.appendChild(el);
  });
}
function verificaSequencia() {
  let correta = sequencias[seqAtiva].correta.map(i => sequencias[seqAtiva].etapas[i]);
  let acertos = seqOrdem.filter((v,i)=>v===correta[i]).length;
  let fb = document.getElementById('sequencia-feedback');
  if (acertos === correta.length) {
    fb.innerHTML = "Parabéns! Sequência correta!";
    playAcerto();
    atualizaStats(1);
  } else {
    fb.innerHTML = `Você acertou ${acertos} de ${correta.length} posições.<br>Dica: Tente lembrar da ordem lógica dos eventos financeiros.`;
    playErro();
  }
  fb.style.display = 'block';
}

// ---------- CORTA DESPESAS -------------
const cortaGastos = [
  { nome: "Aluguel", essencial: true },
  { nome: "Cinema", essencial: false },
  { nome: "Assinatura de streaming", essencial: false },
  { nome: "Supermercado", essencial: true },
  { nome: "Viagem internacional", essencial: false },
  { nome: "Plano de saúde", essencial: true }
];
let cortaSelecionados = [];
function startCorta() {
  cortaSelecionados = [];
  let lista = document.getElementById('corta-lista');
  lista.innerHTML = '';
  cortaGastos.forEach((g, i)=>{
    let el = document.createElement('div');
    el.className = 'corta-item';
    el.textContent = g.nome;
    el.onclick = ()=>{
      if(cortaSelecionados.includes(i)) cortaSelecionados = cortaSelecionados.filter(x=>x!==i);
      else cortaSelecionados.push(i);
      el.classList.toggle('selected');
    };
    lista.appendChild(el);
  });
  document.getElementById('corta-feedback').style.display = 'none';
}
function verificaCorta() {
  let acertos = 0;
  cortaGastos.forEach((g,i)=>{
    if(!g.essencial && cortaSelecionados.includes(i)) acertos++;
  });
  let fb = document.getElementById('corta-feedback');
  if (acertos === cortaGastos.filter(g=>!g.essencial).length) {
    fb.innerHTML = "Muito bem! Você cortou apenas gastos não essenciais.";
    playAcerto();
    atualizaStats(1);
  } else {
    fb.innerHTML = "Atenção! Corte apenas gastos que não são essenciais.";
    playErro();
  }
  fb.style.display = 'block';
}

// ---------- MULTIPLIQUE SEU DINHEIRO -------------
function startMultiplica() {
  document.getElementById('multiplica-feedback').style.display = 'none';
  document.getElementById('multiplica-valor').value = '';
  document.getElementById('multiplica-taxa').value = '';
  document.getElementById('multiplica-meses').value = '';
}
function calculaMultiplica() {
  let valor = parseFloat(document.getElementById('multiplica-valor').value);
  let taxa = parseFloat(document.getElementById('multiplica-taxa').value)/100;
  let meses = parseInt(document.getElementById('multiplica-meses').value);
  let fb = document.getElementById('multiplica-feedback');
  if (!valor || !taxa || !meses) {
    fb.innerHTML = "Preencha todos os campos!";
    playErro();
    fb.style.display = 'block';
    return;
  }
  let final = valor * Math.pow(1+taxa, meses);
  let juros = final - valor;
  fb.innerHTML = `Após ${meses} meses, seu dinheiro será <b>R$ ${final.toFixed(2).replace('.',',')}</b><br>Você ganhou <b>R$ ${juros.toFixed(2).replace('.',',')}</b> só de juros!`;
  fb.style.display = 'block';
  playAcerto();
  atualizaStats(1);
}

// ---------- DESAFIO DAS MOEDAS -------------
const moedasValores = [0.05,0.10,0.25,0.50,1,2,5];
let moedasDesafioValor = 0, moedasSelecionadas = [];
function startMoedas() {
  moedasDesafioValor = [1.75,2.90,4.55,6.85][Math.floor(Math.random()*4)];
  moedasSelecionadas = [];
  document.getElementById('moedas-desafio').innerHTML = `Monte <b>R$ ${moedasDesafioValor.toFixed(2).replace('.',',')}</b> usando as moedas abaixo:`;
  let lista = document.getElementById('moedas-lista');
  lista.innerHTML = '';
  moedasValores.forEach((v,i)=>{
    let el = document.createElement('div');
    el.className = 'moeda';
    el.textContent = `R$ ${v.toFixed(2).replace('.',',')}`;
    el.onclick = ()=>{
      moedasSelecionadas.push(v);
      el.classList.add('selecionada');
      setTimeout(()=>el.classList.remove('selecionada'), 300);
    };
    lista.appendChild(el);
  });
  document.getElementById('moedas-feedback').style.display = 'none';
}
function verificaMoedas() {
  let soma = moedasSelecionadas.reduce((a,b)=>a+b,0);
  let fb = document.getElementById('moedas-feedback');
  if(Math.abs(soma-moedasDesafioValor)<0.01) {
    fb.innerHTML = "Parabéns, você acertou!";
    playAcerto();
    atualizaStats(1);
  } else {
    fb.innerHTML = `Tente novamente! Você montou <b>R$ ${soma.toFixed(2).replace('.',',')}</b>.`;
    playErro();
  }
  fb.style.display = 'block';
}
