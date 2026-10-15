const CHAVE = "clientes";

function lerClientes(){
  const texto = localStorage.getItem(CHAVE);
  return texto ? JSON.parse(texto) : [];
}

function salvarClientes(lista){
  localStorage.setItem(CHAVE, JSON.stringify(lista));
}

function criarCard(cliente){

    const link = document.createElement("a");
    link.href = "#";
    link.dataset.bsToggle = "modal";
    link.dataset.bsTarget = "#janelaCliente";

    const card = document.createElement("div");
    card.className = "cliente-card";
    card.dataset.id = cliente.id;

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

    const a1 = document.createElement("a")
    a1.className = "dropdown-item firstItem"
    a1.href = "#"
    a1.textContent = "Excluir"

    const a2 = document.createElement("a")
    a2.className = "dropdown-item"
    a2.href = "#"
    a2.textContent = "Editar"


    link.append(nome, cnpj);
    li.append(a1, a2)
    ulBotao.append(li)
    botao.append(ulBotao)
    card.append(link, botao);
  
  return card;
}



function mostrarClientes(){
  const container = document.querySelector(".cliente-container");
  container.innerHTML = "";
  lerClientes().forEach(cliente => container.append(criarCard(cliente)));
}

mostrarClientes();




function trocarAba(){
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

function pesquisarClientes(){
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
    card.addEventListener("click", (evento) =>{
     const idCard = Number(card.dataset.id)

    const cliente = lerClientes().find((cliente) => cliente.id === idCard)
    
    const nome = document.getElementById("modalNome");
    nome.textContent = cliente.nome;

    const cnpj = document.getElementById("modalCNPJ");
    cnpj.textContent = cliente.cnpj;

    const endereco = cliente.cidade + ", " + cliente.bairro + ", " + cliente.cep.value + ", " + cliente.rua

    const iframe = document.getElementById("iframe")
    iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(endereco) + "&z=13&output=embed"

    })
  })


}

infoClientes()

/*function btnElipse(){
  const elipse = document.querySelectorAll(".btnElipse")


  elipse.forEach(botao => {
    botao.addEventListener("click", () => {
      
    })})
    

}

btnElipse()*/