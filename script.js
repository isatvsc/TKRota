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



function pesquisarClientes(){
  const clientes = document.querySelectorAll(".cliente-card");

  const campoPesquisa = document.getElementById("pesquisaCliente");
  
  campoPesquisa.addEventListener("input", () => {
    const text = campoPesquisa.value.toLowerCase();


    clientes.forEach((cliente) => {
      const conteudo = cliente.textContent.toLowerCase()
      const contem = conteudo.includes(text);
      cliente.classList.toggle("escondido", !contem)
    })
})
}

pesquisarClientes()





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