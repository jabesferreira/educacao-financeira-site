// ====== NAVEGAÇÃO ENTRE TELAS ======
function showScreen(screen) {
  document.querySelectorAll('.game-container').forEach(el => el.classList.remove('active'));
  if (screen === 'home') document.getElementById('homeScreen').classList.add('active');
  else document.getElementById(screen + 'Game').classList.add('active');
}
function startGame(game) {
  showScreen(game);
  if (game === 'shop') startShopGame();
  else if (game === 'budget') {};
  else if (game === 'prioridades') startPrioridades();
  else if (game === 'quiz') startQuiz();
  else if (game === 'quizrapido') startQuizRapido();
  else if (game === 'quem') startQuem();
  else if (game === 'sequencia') startSequencia();
  else if (game === 'corta') startCorta();
  else if (game === 'juros') startJuros();
  else if (game === 'multiplica') startMultiplica();
  else if (game === 'moedas') startMoedas();
  else if (game === 'orcamento') startOrcamento();
}

// ====== ESTATÍSTICAS ======
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

// ====== LOJA ======
const allEmojis = ['📱','👕','👖','👟','🎮','📚','🍎','🍕','☕','🎁','💎','✈️','🎸','⚽','💻','⌚','🕶️','🧢','🎧','🍿'];
const emojiPrices = {
  '📱': 120.00, '👕': 40.00, '👖': 60.00, '👟': 80.00, '🎮': 200.00, '📚': 30.00, '🍎': 3.00, '🍕': 25.00,
  '☕': 6.50, '🎁': 90.00, '💎': 500.00, '✈️': 450.00, '🎸': 350.00, '⚽': 45.00, '💻': 1200.00, '⌚': 150.00,
  '🕶️': 70.00, '🧢': 35.00, '🎧': 180.00, '🍿': 12.00
};
let shop = { initialBalance: 1518, currentBalance: 1518, debt: 0, itemsPurchased: 0, currentEmojis: [] };
function startShopGame() {
  shop = { initialBalance: 1518, currentBalance: 1518, debt: 0, itemsPurchased: 0, currentEmojis: [] };
  selectNewEmojis(5);
  updateShopDisplay();
  document.getElementById('resultMessage').style.display = 'none';
}
function selectNewEmojis(count) {
  const available = [...allEmojis];
  shop.currentEmojis = [];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    shop.currentEmojis.push(available[idx]);
    available.splice(idx, 1);
  }
  updateEmojiDisplay();
}
function updateEmojiDisplay() {
  const grid = document.getElementById('emojiGrid');
  grid.innerHTML = '';
  shop.currentEmojis.forEach(emoji => {
    const el = document.createElement('div');
    el.className = 'emoji-item';
    el.innerHTML = `<div>${emoji}</div><div class="price-tag">R$ ${emojiPrices[emoji].toFixed(2).replace('.', ',')}</div>`;
    el.onclick = () => buyItem(emoji);
    grid.appendChild(el);
  });
}
function updateShopDisplay() {
  document.getElementById('currentBalance').textContent = `R$ ${shop.currentBalance.toFixed(2).replace('.', ',')}`;
  document.getElementById('currentDebt').textContent = `R$ ${shop.debt.toFixed(2).replace('.', ',')}`;
}
function buyItem(emoji) {
  const price = emojiPrices[emoji];
  if (shop.currentBalance < price) {
    alert('Saldo insuficiente!');
    return;
  }
  shop.currentBalance -= price;
  shop.debt += price;
  shop.itemsPurchased++;
  selectNewEmojis(5);
  updateShopDisplay();
}
function stopGame() {
  const perc = (shop.debt / shop.initialBalance * 100).toFixed(1);
  const msg = document.getElementById('resultMessage');
  let feedback = "";
  if (perc <= 30) feedback = "Excelente! Você manteve seus gastos com desejos dentro de um limite saudável.";
  else if (perc <= 50) feedback = "Atenção! Você ultrapassou o limite recomendado (30%) para desejos. Tente se controlar mais.";
  else feedback = "Cuidado! Você comprometeu uma grande parte da sua renda com desejos. Isso pode gerar dívidas!";
  msg.innerHTML = `
    <p>Você comprou ${shop.itemsPurchased} itens, gastando R$ ${shop.debt.toFixed(2).replace('.', ',')}</p>
    <p>Isso representa ${perc}% da sua renda</p>
    <p><strong>${feedback}</strong></p>`;
  msg.style.display = 'block';
}

// ====== SIMULAÇÃO 50-30-20 ======
function calcularSimulacao() {
  const valor = parseFloat(document.getElementById('rendaInput').value);
  const container = document.getElementById('resultadoSimulador');
  if (isNaN(valor) || valor <= 0) {
    container.innerHTML = '';
    return;
  }
  const n = (valor * 0.5).toFixed(2).replace('.', ',');
  const d = (valor * 0.3).toFixed(2).replace('.', ',');
  const p = (valor * 0.2).toFixed(2).replace('.', ',');
  container.innerHTML = `
    <div class="simulador-box"><strong>50%</strong><br>Necessidades: R$ ${n}</div>
    <div class="simulador-box"><strong>30%</strong><br>Desejos: R$ ${d}</div>
    <div class="simulador-box"><strong>20%</strong><br>Poupança: R$ ${p}</div>`;
}

// ====== DESAFIO DAS PRIORIDADES ======
const prioridadesGastos = [
  { nome: "Aluguel", cat: "necessidades" },
  { nome: "Internet", cat: "necessidades" },
  { nome: "Cinema", cat: "desejos" },
  { nome: "Supermercado", cat: "necessidades" },
  { nome: "Restaurante caro", cat: "desejos" },
  { nome: "Plano de saúde", cat: "necessidades" },
  { nome: "Tênis novo", cat: "desejos" },
  { nome: "Energia elétrica", cat: "necessidades" }
];
let prioridadesEmbaralhadas = [];
let prioridadesResposta = { necessidades: [], desejos: [] };
function startPrioridades() {
  document.getElementById('prioridades-feedback').style.display = 'none';
  prioridadesEmbaralhadas = prioridadesGastos.slice().sort(() => Math.random() - 0.5);
  prioridadesResposta = { necessidades: [], desejos: [] };
  renderPrioridades();
}
function renderPrioridades() {
  const draggablesDiv = document.getElementById('prioridades-draggables');
  draggablesDiv.innerHTML = '';
  prioridadesEmbaralhadas.forEach((item,i) => {
    if (
      !prioridadesResposta.necessidades.includes(item.nome) &&
      !prioridadesResposta.desejos.includes(item.nome)
    ) {
      const el = document.createElement('div');
      el.className = 'draggable';
      el.draggable = true;
      el.textContent = item.nome;
      el.id = 'drag-'+i;
      el.ondragstart = (e) => { e.dataTransfer.setData('text', item.nome); };
      draggablesDiv.appendChild(el);
    }
  });
  ['necessidades','desejos'].forEach(cat=>{
    const dz = document.getElementById('dz-'+cat+'-items');
    dz.innerHTML = '';
    prioridadesResposta[cat].forEach(n=>{
      const el = document.createElement('div');
      el.className = 'draggable';
      el.textContent = n;
      el.draggable = false;
      el.style.opacity = 0.7;
      dz.appendChild(el);
    });
  });
}
function dropPrioridade(ev, cat) {
  ev.preventDefault();
  const nome = ev.dataTransfer.getData('text');
  if (!prioridadesResposta[cat].includes(nome)) {
    prioridadesResposta[cat].push(nome);
    renderPrioridades();
  }
}
function verificaPrioridades() {
  let acertos = 0;
  let total = prioridadesGastos.length;
  prioridadesGastos.forEach(item=>{
    if (prioridadesResposta[item.cat].includes(item.nome)) acertos++;
  });
  let msg = `Você classificou corretamente ${acertos} de ${total} gastos.<br>`;
  if (acertos === total) msg += "Parabéns! Tudo certo!";
  else if (acertos >= total-2) msg += "Muito bom! Só pequenos ajustes.";
  else msg += "Tente novamente para melhorar seu resultado.";
  const fb = document.getElementById('prioridades-feedback');
  fb.innerHTML = msg;
  fb.style.display = 'block';
}

// ====== QUIZ DE VERDADEIRO OU FALSO ======
const quizQuestoes = [
  { pergunta: "Guardar dinheiro só vale a pena se for muito.", resposta: false, explicacao: "Guardar qualquer valor é importante, mesmo que pequeno. O hábito conta!" },
  { pergunta: "Cartão de crédito é dinheiro extra.", resposta: false, explicacao: "Cartão de crédito é uma forma de pagamento, não dinheiro a mais." },
  { pergunta: "Ter uma reserva de emergência ajuda a evitar dívidas.", resposta: true, explicacao: "Uma reserva cobre imprevistos sem precisar recorrer a empréstimos." },
  { pergunta: "Investir sempre envolve algum risco.", resposta: true, explicacao: "Todo investimento tem riscos, mesmo os mais conservadores." },
  { pergunta: "Juros compostos fazem o dinheiro render mais ao longo do tempo.", resposta: true, explicacao: "Juros compostos aumentam o rendimento ao reinvestir os ganhos." },
  { pergunta: "É seguro compartilhar senhas bancárias com amigos.", resposta: false, explicacao: "Jamais compartilhe suas senhas! É perigoso e pode causar prejuízos." }
];
let quizIndex = 0, quizScore = 0;
function startQuiz() {
  quizIndex = 0;
  quizScore = 0;
  document.getElementById('quiz-feedback').style.display = 'none';
  document.getElementById('quiz-score').style.display = 'none';
  renderQuiz();
}
function renderQuiz() {
  if (quizIndex >= quizQuestoes.length) {
    document.getElementById('quiz-question').textContent = '';
    document.getElementById('quiz-score').innerHTML = `Você acertou <strong>${quizScore} de ${quizQuestoes.length}</strong>!`;
    document.getElementById('quiz-score').style.display = 'block';
    atualizaStats(quizScore);
    return;
  }
  document.getElementById('quiz-question').textContent = quizQuestoes[quizIndex].pergunta;
}
function responderQuiz(v) {
  if (quizIndex >= quizQuestoes.length) return;
  const certa = quizQuestoes[quizIndex].resposta === v;
  const explicacao = quizQuestoes[quizIndex].explicacao;
  let fb = document.getElementById('quiz-feedback');
  fb.innerHTML = (certa ? "Correto! " : "Errado! ") + explicacao;
  fb.style.background = certa ? "#e6f4ea" : "#ffebee";
  fb.style.color = certa ? "#2e7d32" : "#b71c1c";
  fb.style.display = "block";
  if (certa) quizScore++;
  setTimeout(()=>{
    fb.style.display = 'none';
    quizIndex++;
    renderQuiz();
  }, 1700);
}

// ====== QUIZ RÁPIDO ======
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
  if (certa) { quizRapidoScore++; }
  setTimeout(()=>{ fb.style.display = 'none'; quizRapidoIndex++; renderQuizRapido(); }, 900);
}
function finalizaQuizRapido() {
  clearInterval(quizRapidoTimer);
  document.getElementById('quizrapido-score').innerHTML = `Você acertou <strong>${quizRapidoScore} de ${quizRapidoQuestoes.length}</strong>!`;
  document.getElementById('quizrapido-score').style.display = 'block';
  atualizaStats(quizRapidoScore);
}

// ====== QUEM SOU EU ======
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
    quemScore++;
  } else { 
    fb.innerHTML = `Errado! Resposta era: <b>${quemPerguntas[quemAtiva].resposta}</b>`; 
  }
  fb.style.display = 'block';
  quemAtiva++;
  setTimeout(()=>{ fb.style.display = 'none'; renderQuem(); }, 1100);
}

// ====== ARRUME A SEQUÊNCIA ======
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
    atualizaStats(1);
  } else {
    fb.innerHTML = `Você acertou ${acertos} de ${correta.length} posições.<br>Dica: Tente lembrar da ordem lógica dos eventos financeiros.`;
  }
  fb.style.display = 'block';
}

// ====== CORTA DESPESAS ======
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
    atualizaStats(1);
  } else {
    fb.innerHTML = "Atenção! Corte apenas gastos que não são essenciais.";
  }
  fb.style.display = 'block';
}

// ====== JOGO DOS JUROS ======
const jurosItens = [
  { nome: "Celular", preco: 1500, parcelas: 10, jurosMes: 0.037 },
  { nome: "Tênis", preco: 400, parcelas: 5, jurosMes: 0.025 },
  { nome: "Fogão", preco: 900, parcelas: 8, jurosMes: 0.03 },
  { nome: "Notebook", preco: 2500, parcelas: 12, jurosMes: 0.035 },
  { nome: "Bicicleta", preco: 1200, parcelas: 6, jurosMes: 0.028 },
  { nome: "Sofá", preco: 2000, parcelas: 10, jurosMes: 0.032 }
];
let jurosAtivo = 0;
let jurosPerguntaAtual = 0;
function startJuros() {
  jurosPerguntaAtual = 0;
  document.getElementById('juros-feedback').style.display = 'none';
  document.getElementById('juros-orientacao').style.display = 'none';
  document.getElementById('juros-next-btn').style.display = 'none';
  renderJuros();
}
function renderJuros() {
  if (jurosPerguntaAtual >= jurosItens.length) {
    document.getElementById('juros-pergunta').innerHTML = '';
    document.getElementById('juros-opcoes').innerHTML = '';
    document.getElementById('juros-next-btn').style.display = 'none';
    document.getElementById('juros-feedback').style.display = 'none';
    document.getElementById('juros-orientacao').style.display = 'block';
    document.getElementById('juros-orientacao').innerHTML = `<strong>Orientação:</strong><br>
    O pagamento à vista geralmente é mais vantajoso, pois evita juros e dívidas futuras. 
    Ao parcelar, o valor total pago costuma ser maior por conta dos juros. Sempre verifique o valor final antes de decidir.`;
    return;
  }
  document.getElementById('juros-orientacao').style.display = 'none';
  jurosAtivo = jurosPerguntaAtual;
  document.getElementById('juros-feedback').style.display = 'none';
  document.getElementById('juros-next-btn').style.display = 'none';
  const item = jurosItens[jurosAtivo];
  document.getElementById('juros-pergunta').innerHTML =
    `Você quer comprar um <strong>${item.nome}</strong> que custa <strong>R$ ${item.preco.toFixed(2).replace('.',',')}</strong>.<br>Você pode pagar à vista ou em ${item.parcelas}x com juros de ${(item.jurosMes*100).toFixed(1)}% ao mês. Como prefere pagar?`;
  const opcoes = document.getElementById('juros-opcoes');
  opcoes.innerHTML = '';
  const btn1 = document.createElement('button');
  btn1.className = 'decision-button';
  btn1.style.background = '#4caf50'; btn1.style.color = '#fff';
  btn1.textContent = 'À vista';
  btn1.onclick = ()=>respondeJuros('avista');
  opcoes.appendChild(btn1);
  const btn2 = document.createElement('button');
  btn2.className = 'decision-button';
  btn2.style.background = '#1976d2'; btn2.style.color = '#fff';
  btn2.textContent = `Parcelado (${item.parcelas}x)`;
  btn2.onclick = ()=>respondeJuros('parcelado');
  opcoes.appendChild(btn2);
}
function respondeJuros(op) {
  const item = jurosItens[jurosAtivo];
  let msg = '';
  if (op === 'avista') {
    msg = `Você pagou <strong>R$ ${item.preco.toFixed(2).replace('.',',')}</strong> à vista, sem juros!`;
  } else {
    const vf = item.preco * Math.pow(1+item.jurosMes, item.parcelas);
    msg = `Parcelado, você pagará <strong>R$ ${vf.toFixed(2).replace('.',',')}</strong> no total.<br>
    Ou seja, pagará <strong>R$ ${(vf-item.preco).toFixed(2).replace('.',',')}</strong> a mais em juros.`;
  }
  const fb = document.getElementById('juros-feedback');
  fb.innerHTML = msg;
  fb.style.display = 'block';
  document.getElementById('juros-next-btn').style.display = 'inline-block';
}
function proximaPerguntaJuros() {
  jurosPerguntaAtual++;
  renderJuros();
}

// ====== MULTIPLIQUE SEU DINHEIRO ======
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
    fb.style.display = 'block';
    return;
  }
  let final = valor * Math.pow(1+taxa, meses);
  let juros = final - valor;
  fb.innerHTML = `Após ${meses} meses, seu dinheiro será <b>R$ ${final.toFixed(2).replace('.',',')}</b><br>Você ganhou <b>R$ ${juros.toFixed(2).replace('.',',')}</b> só de juros!`;
  fb.style.display = 'block';
}

// ====== DESAFIO DAS MOEDAS ======
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
    atualizaStats(1);
  } else {
    fb.innerHTML = `Tente novamente! Você montou <b>R$ ${soma.toFixed(2).replace('.',',')}</b>.`;
  }
  fb.style.display = 'block';
}

// ====== MONTE SEU ORÇAMENTO ======
const orcamentoLimite = 1518;
function startOrcamento() {
  document.getElementById('orcamento-feedback').textContent = '';
  ['moradia','alimentacao','lazer','transporte','educacao','poupanca'].forEach(cat=>{
    document.getElementById('input-'+cat).value = 0;
    document.getElementById('input-'+cat).oninput = orcamentoInputHandler;
  });
}
function orcamentoInputHandler() {
  const inputs = [
    'moradia','alimentacao','lazer','transporte','educacao','poupanca'
  ].map(cat=>document.getElementById('input-'+cat));
  let valores = inputs.map(input=>parseInt(input.value)||0);
  let soma = valores.reduce((a,b)=>a+b,0);
  if (soma > orcamentoLimite) {
    let diff = soma - orcamentoLimite;
    let inputAtual = this;
    let novoValor = Math.max(0, parseInt(inputAtual.value) - diff);
    inputAtual.value = novoValor;
    valores = inputs.map(input=>parseInt(input.value)||0);
    soma = valores.reduce((a,b)=>a+b,0);
  }
  const restante = orcamentoLimite - soma;
  document.getElementById('orcamento-feedback').innerHTML = `Você ainda tem <strong>R$ ${restante.toFixed(2).replace('.',',')}</strong> para distribuir.`;
}
function verificaOrcamento() {
  const renda = orcamentoLimite;
  const valores = {
    moradia: Number(document.getElementById('input-moradia').value),
    alimentacao: Number(document.getElementById('input-alimentacao').value),
    lazer: Number(document.getElementById('input-lazer').value),
    transporte: Number(document.getElementById('input-transporte').value),
    educacao: Number(document.getElementById('input-educacao').value),
    poupanca: Number(document.getElementById('input-poupanca').value)
  };
  const total = Object.values(valores).reduce((a,b)=>a+b,0);
  let msg = '';
  if (total < renda) msg = `Você ainda tem <strong>R$ ${(renda-total).toFixed(2).replace('.',',')}</strong> para distribuir.`;
  else if (total > renda) msg = `Você ultrapassou a renda em <strong>R$ ${(total-renda).toFixed(2).replace('.',',')}</strong>!`;
  else msg = "Ótimo! Você distribuiu exatamente sua renda.";
  let dicas = [];
  if (valores.moradia+valores.alimentacao > renda*0.6) dicas.push("Tente gastar até 60% com moradia e alimentação.");
  if (valores.lazer > renda*0.2) dicas.push("Cuidado para não exagerar nos gastos com lazer (máx 20%).");
  if (valores.poupanca < renda*0.1) dicas.push("Tente poupar pelo menos 10% da renda.");
  document.getElementById('orcamento-feedback').innerHTML = msg + (dicas.length? "<br>Dicas: "+dicas.join(" ") : "");
}
