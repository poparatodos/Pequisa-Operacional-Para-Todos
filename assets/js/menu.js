document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o botão e o menu no HTML
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');

    // Verifica se os dois elementos existem na página antes de continuar
    if (menuToggle && sideMenu) {
        // Adiciona um "ouvinte de evento" que espera por um clique no botão
        menuToggle.addEventListener('click', () => {
            // A cada clique, ele ADICIONA ou REMOVE a classe 'side-menu--open' do menu
            sideMenu.classList.toggle('side-menu--open');
        });
    }
});