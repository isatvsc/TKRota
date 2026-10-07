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