document.addEventListener("DOMContentLoaded", function() {

    // --- Seleção dos Elementos ---
    const slides = document.querySelectorAll(".carousel-slide");
    const indicatorsContainer = document.querySelector(".carousel-indicators");
    const prevButton = document.querySelector(".carousel-control.prev");
    const nextButton = document.querySelector(".carousel-control.next");
    
    // --- Variáveis de Controle ---
    let currentSlide = 0;
    let autoplayInterval = null;
    const autoplayDuration = 5000; // 5 segundos

    // Se não houver slides, o script para aqui.
    if (slides.length === 0) return;

    // --- FUNÇÕES ---

    // 1. Cria os traços dos indicadores dinamicamente
    function createIndicators() {
        slides.forEach((slide, index) => {
            const indicator = document.createElement("div");
            indicator.classList.add("indicator");
            // Adiciona um evento de clique para navegar para o slide correspondente
            indicator.addEventListener("click", () => {
                showSlide(index);
            });
            indicatorsContainer.appendChild(indicator);
        });
    }

    // 2. Mostra um slide específico e atualiza o indicador ativo
    function showSlide(index) {
        // Remove a classe ativa de todos os slides e indicadores
        slides.forEach(slide => slide.classList.remove('active-slide'));
        document.querySelectorAll('.indicator').forEach(ind => ind.classList.remove('active-indicator'));
        
        // Adiciona a classe ativa apenas ao slide e indicador corretos
        slides[index].classList.add('active-slide');
        document.querySelectorAll('.indicator')[index].classList.add('active-indicator');
        
        currentSlide = index;
        resetAutoplay(); // Reinicia o contador toda vez que o slide muda
    }

    // 3. Inicia o autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const nextSlideIndex = (currentSlide + 1) % slides.length;
            showSlide(nextSlideIndex);
        }, autoplayDuration);
    }

    // 4. Reinicia o autoplay (para quando o usuário interage)
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // --- INICIALIZAÇÃO DO CARROSSEL ---

    createIndicators();

    // Adiciona eventos de clique aos botões de seta
    prevButton.addEventListener('click', () => {
        const prevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevSlideIndex);
    });

    nextButton.addEventListener('click', () => {
        const nextSlideIndex = (currentSlide + 1) % slides.length;
        showSlide(nextSlideIndex);
    });

    // Remove os 'onclick' do HTML, pois já estamos controlando pelo JS
    prevButton.removeAttribute('onclick');
    nextButton.removeAttribute('onclick');

    // Mostra o primeiro slide e inicia o carrossel
    showSlide(0);

});