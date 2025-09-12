// Função que executa assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
});

// Função assíncrona para buscar e renderizar os vídeos
async function loadVideos() {
    try {
        // Busca o nosso arquivo JSON
        const response = await fetch('../assets/data/po1_videos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const videos = await response.json();

        // Pega o container no HTML
        const container = document.getElementById('video-list-container');
        if (!container) return; // Para de executar se não achar o container

        // Limpa qualquer conteúdo que possa estar lá (ex: uma mensagem de "carregando...")
        container.innerHTML = '';

        // Cria o HTML para cada vídeo da lista
        videos.forEach(video => {
            // Cria um link para os slides somente se a URL existir
            const slidesLink = video.slidesUrl 
                ? `<a href="${video.slidesUrl}" class="support-link" target="_blank">
                       <i data-lucide="file-text"></i> Baixar Slides da Aula
                   </a>`
                : ''; // Se não existir, a string fica vazia

            const videoHtml = `
                <article class="video-item">
                    <div class="video-container">
                        <iframe 
                            src="https://www.youtube.com/embed/${video.youtubeId}" 
                            title="${video.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                    </div>
                    <div class="video-description">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                        <p><strong>Tópicos:</strong> ${video.topics}</p>
                        ${slidesLink}
                    </div>
                </article>
            `;
            // Adiciona o HTML do vídeo criado ao container
            container.innerHTML += videoHtml;
        });

        // Re-ativa os ícones Lucide depois de adicioná-los dinamicamente
        lucide.createIcons();

    } catch (error) {
        console.error("Falha ao carregar os vídeos:", error);
        const container = document.getElementById('video-list-container');
        if (container) {
            container.innerHTML = '<p>Ocorreu um erro ao carregar os vídeos. Por favor, tente novamente mais tarde.</p>';
        }
    }
}