const CHAVE = "clientes";

function lerClientes(){
  const texto = localStorage.getItem(CHAVE);
  return texto ? JSON.parse(texto) : [];
}

function salvarClientes(lista){
  localStorage.setItem(CHAVE, JSON.stringify(lista));
}

function criarCard(cliente){ // essa funcção cria os cards de clientes dinamicamente

    const link = document.createElement("a");
    link.href = "#";
    link.dataset.bsToggle = "modal";
    link.dataset.bsTarget = "#janelaCliente";

    const card = document.createElement("div");
    card.className = "cliente-card";
    card.dataset.id = cliente.id;
    card.dataset.categoria = cliente.categoria;

    const nome = document.createElement("span");
    nome.className = "nomeCliente";
    nome.textContent = cliente.nome;

    const cnpj = document.createElement("div");
    cnpj.className = "cnpjCliente";
    const forte = document.createElement("strong");
    forte.textContent = "CNPJ:";
    cnpj.append(forte, " " + cliente.cnpj);

    const botao = document.createElement("button")
    botao.className = "fa-solid fa-ellipsis-vertical btnElipse"
    botao.dataset.bsToggle = "dropdown"
    botao.type = "button"

    const ulBotao = document.createElement("ul")
    ulBotao.className = "dropdown-menu"

    const li = document.createElement("li")

    const b1 = document.createElement("button")
    b1.className = "dropdown-item excluirCliente"
    b1.textContent = "Excluir"

    b1.addEventListener("click", () =>{
      if(!confirm ("Deseja mesmo excluir esse cliente?")) return;
      const clientes = lerClientes();
      listaNova = clientes.filter((item) => item.id !== cliente.id)
      salvarClientes(listaNova)
      mostrarClientes();
      filtrarClientes();
      aplicarFiltros();
    })

    const b2 = document.createElement("button")
    b2.className = "dropdown-item"
    b2.textContent = "Editar"


    link.append(nome, cnpj);
    li.append(b2, b1)
    ulBotao.append(li)
    botao.append(ulBotao)
    card.append(link, botao);
  
  return card;
}



function mostrarClientes(){ // essa função mostra os cards no container da section clientes
  const container = document.querySelector(".cliente-container");
  container.innerHTML = "";
  lerClientes().forEach(cliente => container.append(criarCard(cliente)));
}

mostrarClientes();

async function copiarCNPJ() {
  try {
   
    const cnpj = document.getElementById("modalCNPJ").innerHTML;
    
    
    await navigator.clipboard.writeText(cnpj);

    const toast = document.getElementById('toastCNPJ');
    toast.classList.add('mostrar');
    
    setTimeout(() => {
      toast.classList.remove('mostrar');
    }, 3000);

  } catch (err) {
    console.error('Erro ao copiar CNPJ:', err);
    alert('Não foi possível copiar o CNPJ automaticamente.');
  }
}



function trocarAba(){ // essa função navega pelas sections
const links = document.querySelectorAll(".sidebar-content li");
const abas = document.querySelectorAll(".aba");

links.forEach((link) => {
  link.addEventListener("click", (evento) => {
    evento.preventDefault();

    abas.forEach((page) => page.classList.remove("ativa"));

    const nome = link.dataset.page;
    document.getElementById(nome).classList.add("ativa");

    links.forEach((l) => l.classList.remove("selecionado"));
    link.classList.add("selecionado");
  });
});
}

trocarAba();

function pesquisarClientes(){ // essa função é a de pesquisar clientes
  const campoPesquisa = document.getElementById("pesquisaCliente");

  campoPesquisa.addEventListener("input", () => {
    const text = campoPesquisa.value.toLowerCase();

    document.querySelectorAll(".cliente-card").forEach((cliente) => {
      const conteudo = cliente.textContent.toLowerCase();
      cliente.classList.toggle("escondido", !conteudo.includes(text));
    });
  });
}

pesquisarClientes();

function aplicarFiltros(){
  const textoPesquisa = document.getElementById("pesquisaCliente").value
  textoPesquisa.toLowerCase()

  const listaCaixinhas = Array.from(document.querySelectorAll("#menu input:checked"))

  categoriasMarcadas = listaCaixinhas.map((caixa) => caixa.value)

  const cards = document.querySelectorAll(".cliente-card")

  cards.forEach(card => {
    
    const passouFiltro = categoriasMarcadas.length === 0 || categoriasMarcadas.includes(card.dataset.categoria)
    /*const passouPesquisa = card.textContent.includes(pesquisarClientes())
    passouPesquisa.toString().toLowerCase()*/
  
     
    const deveAparecer = /*passouPesquisa &&*/ passouFiltro 

    //console.log(card.dataset.categoria)    
    //console.log(categoriasMarcadas)
    //console.log(passouPesquisa)
    //console.log(passouFiltro)

    card.classList.toggle("escondido", !deveAparecer)

  });
  

}


function filtrarClientes(){
  const campoFiltro = document.getElementById("menu")
  campoFiltro.innerHTML = ""

    const clientes = lerClientes()

    const todasCategorias = clientes.map((cliente) => cliente.categoria)

    const categoriasFiltros = Array.from(new Set(todasCategorias))
    categoriasFiltros.sort()
    

    categoriasFiltros.forEach((categoria, posicao) => {
      const div = document.createElement("div")
      div.className = "form-check"

      const input = document.createElement("input")
      input.type = "checkbox"
      input.value = categoria
      input.id = "filtro-" + posicao
      input.className = "form-check-input"

      const label = document.createElement("label")
      label.textContent = categoria
      label.className = "form-check-label"
      label.htmlFor = input.id
      
      div.append(label, input)
      campoFiltro.append(div)
    })

      const divBtn = document.createElement("div")
      divBtn.className = "aplicarFiltro"

      const botao = document.createElement("button")
      botao.className = "btnAplicarFiltro"
      botao.textContent = "Aplicar Filtros"
      botao.onclick = () => aplicarFiltros()
      
      

      divBtn.append(botao)
      campoFiltro.append(divBtn)

          

}
filtrarClientes()


/*      FORMULARIO       */


function permitirCadastro(){
  document.getElementById("formulario").addEventListener("submit", function(cadastro){

    cadastro.preventDefault();

    let formulario = true;
    const camposObrigatorios = document.querySelectorAll(".required")
    
    

    camposObrigatorios.forEach(campo =>{
      let spanErro = document.getElementById("erro-" + campo.id);
      const invalido = campo.value.trim() === "";


      if(invalido){
        formulario = false;
        campo.classList.add("erro");
          if(spanErro){
            spanErro.textContent = "Este campo é obrigatório.";
          }
        } else {            
            campo.classList.remove("erro");
          if(spanErro){
          spanErro.textContent = "";
        }
      }
    })


    const cnpj = document.getElementById("inputCNPJ");
    const spanErroCNPJ = document.getElementById("erro-inputCNPJ");
    const regexcnpj = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$/;

    if(cnpj.value.trim() !== "" && !regexcnpj.test(cnpj.value.trim())){
    formulario = false;
    cnpj.classList.add("erro")
      if(spanErroCNPJ)
        spanErroCNPJ.textContent ="Digite um CNPJ válido (formato: 00.000.000/0000-00)"
    };


    const telefone = document.getElementById("inputTel")
    const spanErroTel = document.getElementById("erro-inputTel")
    const regexTel = /^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/

    if(telefone.value.trim() !== "" && !regexTel.test(telefone.value.trim())){
      formulario = false;
      telefone.classList.add("erro");
      if(spanErroTel){
        spanErroTel.textContent = "Digite um Telefone válido (formato: (00) 00000-0000)"
      }
    }


    const CEP = document.getElementById("inputCEP")
    const spanErroCEP = document.getElementById("erro-inputCEP")
    const regexCEP = /^[0-9]{5}-?[0-9]{3}$/

    if(CEP.value.trim() !== "" && !regexCEP.test(CEP.value.trim())){
      formulario = false;
      CEP.classList.add("erro");
      if(spanErroCEP){
        spanErroCEP.textContent = "Digite um CEP válido (formato: 00000-000)"
      }
    }

    


    if(!formulario){
    return
    }

    const clientes = lerClientes();

    const cnpjNumeros = cnpj.value.replace(/\D/g, "");
    const repetido = clientes.some(c => c.cnpj.replace(/\D/g, "") === cnpjNumeros);

    if(repetido){
      cnpj.classList.add("erro");
      if(spanErroCNPJ){
        spanErroCNPJ.textContent = "Já existe um cliente com esse CNPJ.";
      }
      return;
    }

    const categoria = document.getElementById("inputCategorias");

    clientes.push({
      id: Date.now(),
      nome: document.getElementById("inputEstabelecimento").value.trim(),
      cnpj: cnpj.value.trim(),
      categoria: categoria.options[categoria.selectedIndex].textContent,
      telefone: document.getElementById("inputTel").value.trim(),
      contato: document.getElementById("inputNome").value.trim(),
      cep: document.getElementById("inputCEP").value.trim(),
      rua: document.getElementById("inputRua").value.trim(),
      bairro: document.getElementById("inputBairro").value.trim(),
      cidade: document.getElementById("inputCidade").value.trim(),
      estado: document.getElementById("inputEstado").value
    });

    salvarClientes(clientes);
    mostrarClientes();

    const janela = bootstrap.Modal.getInstance(document.getElementById("adicionarCliente"));
    janela.hide();
  })

  document.getElementById("adicionarCliente").addEventListener("hidden.bs.modal", () => {
    document.getElementById("formulario").reset();
    document.querySelectorAll(".erro").forEach(campo => campo.classList.remove("erro"));
    document.querySelectorAll(".mensagem-erro").forEach(span => span.textContent = "");
  })  
  
    
  

  
}

permitirCadastro()

function buscarCEP(){
  const CEP = document.getElementById("inputCEP");
  const spanErroCEP = document.getElementById("erro-inputCEP");

  CEP.addEventListener("blur", () => {
    const cep = CEP.value.replace(/\D/g, ""); 

    if(cep === ""){
      limparEndereco();
      return;
    }

    if(!/^\d{8}$/.test(cep)){
      limparEndereco();
      spanErroCEP.textContent = "Digite um CEP válido (formato: 00000-000)";
      return;
    }

    spanErroCEP.textContent = "";

    fetch("https://viacep.com.br/ws/" + cep + "/json/")
      .then(resposta => resposta.json())
      .then(dados => {
        if(dados.erro){
          limparEndereco();
          spanErroCEP.textContent = "CEP não encontrado.";
          return;
        }

        document.getElementById("inputRua").value = dados.logradouro;
        document.getElementById("inputBairro").value = dados.bairro;
        document.getElementById("inputCidade").value = dados.localidade;
        document.getElementById("inputEstado").value = dados.uf;
      })
      .catch(() => {
        spanErroCEP.textContent = "Não foi possível consultar o CEP. Tente de novo.";
      });
  });
}

function limparEndereco(){
  document.getElementById("inputRua").value = "";
  document.getElementById("inputBairro").value = "";
  document.getElementById("inputCidade").value = "";
  document.getElementById("inputEstado").value = "";
}

buscarCEP();

function infoClientes(){
  const cards = [...document.querySelectorAll(".cliente-card")]

  cards.forEach((card) =>{
    card.addEventListener("click", () =>{
    const idCard = Number(card.dataset.id)

    const cliente = lerClientes().find((cliente) => cliente.id === idCard)
    
    const nome = document.getElementById("modalNome");
    nome.textContent = cliente.nome;

    const cnpj = document.getElementById("modalCNPJ");
    cnpj.textContent = cliente.cnpj;

    const mapa = cliente.cidade + ", " + cliente.bairro + ", " + cliente.rua

    const iframe = document.getElementById("iframe")
    iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(mapa) + "&z=13&output=embed"

    const responsavel = document.getElementById("nomeResponsavel")
    responsavel.textContent = cliente.contato

    const endereco = document.getElementById("enderecoEstabelecimento")
    endereco.textContent = cliente.rua + ", Bairro " + cliente.bairro + ", Cidade: " + cliente.cidade + ", Estado: " + cliente.estado + ", CEP: " + cliente.cep

    const telefone = document.getElementById("telefoneEstabelecimento")
    const telefoneNormal = cliente.telefone.replace(/\D/g, "")
    const telefoneFormatado = telefoneNormal.replace(/($1) $2-$3/)
    telefone.textContent = telefoneFormatado

    })
  })


}

infoClientes()

/*function excluirCliente(){


  const btnExcluir = document.querySelectorAll(".excluirCliente")

  btnExcluir.forEach(btn => {
    btn.addEventListener("click", () => {
      console.log("Excluir")
      const clientes = JSON.parse(localStorage.getItem("clientes"))
      console.log(clientes)
      const idClientes = clientes.id
      console.log(idClientes)
      
  })
  });
  
    

}

excluirCliente()*/