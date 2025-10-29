document.addEventListener('DOMContentLoaded', () => {

    const accordionWrapper = document.getElementById('accordion-wrapper');

    // --- (NOVO!) VERIFICA SE O CONTAINER EXISTE ANTES ---
    if (!accordionWrapper) {
        // Se a página não tem o #accordion-wrapper, o script não faz nada.
        // console.log('Container #accordion-wrapper não encontrado nesta página.'); 
        return; 
    }

    // --- (NOVO!) LÊ O NOME DO ARQUIVO JSON DO ATRIBUTO data-* ---
    const jsonFileName = accordionWrapper.getAttribute('data-json-source');

    // Se o atributo não for encontrado, exibe um erro
    if (!jsonFileName) {
        accordionWrapper.innerHTML = '<p>Erro: Fonte de dados JSON não especificada no HTML (data-json-source).</p>';
        console.error('Atributo data-json-source não encontrado em #accordion-wrapper.');
        return; // Para a execução
    }

    // --- (NOVO!) CONSTRÓI O CAMINHO COMPLETO DINAMICAMENTE ---
    const jsonPath = `../assets/data/${jsonFileName}`;
    // Função principal para carregar e construir o HTML

    async function loadLessons() {
        try {
            // --- (MODIFICADO!) USA O CAMINHO DINÂMICO ---
            const response = await fetch(jsonPath); // <<-- Mudou aqui!
            
            if (!response.ok) {
                // (MELHORADO!) Mensagem de erro mais específica
                throw new Error(`Falha ao carregar ${jsonPath}. Status: ${response.status}`);
            }
            
            const lessons = await response.json();
            // if (!accordionWrapper) return; // Checagem já feita acima
            accordionWrapper.innerHTML = ''; // Limpa o "Carregando..."

            // Cria o HTML para cada aula
            lessons.forEach(lesson => {
                
                // --- 1. Prepara o HTML dos Materiais ---
                const materialHtml = (lesson.slidesUrl && lesson.slidesUrl.trim() !== "")
                    ? `<div class="material-item">
                           <a href="${lesson.slidesUrl}" target="_blank">
                               <i data-lucide="file-text"></i>
                               <span>Slides da Aula / Material de Apoio</span>
                           </a>
                       </div>`
                    : '<p>Nenhum material de apoio disponível para esta aula.</p>';

                // --- 2. Prepara o HTML do Conteúdo de Vídeo (com a nova lógica) ---
                let videoContentHtml = '';
                
                if (lesson.subVideos && lesson.subVideos.length > 0) {
                    // SE TEM SUB-VÍDEOS, constrói as ABAS
                    let tabButtons = '';
                    let tabPanes = '';
                    lesson.subVideos.forEach((video, index) => {
                        const isActive = index === 0 ? 'active' : '';
                        tabButtons += `<button class="tab-btn ${isActive}" data-tab="video-${lesson.id}-${index}">${video.title}</button>`;
                        tabPanes += `<div class="video-tab-pane ${isActive}" id="video-${lesson.id}-${index}">
                                       <div class="video-container">
                                           <iframe src="https://www.youtube.com/embed/${video.youtubeId}" 
                                                   title="${video.title}" frameborder="0" 
                                                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                   allowfullscreen loading="lazy">
                                           </iframe>
                                       </div>
                                   </div>`;
                    });
                    videoContentHtml = `
                        <div class="video-tab-container">
                            <nav class="tab-navigation">${tabButtons}</nav>
                            <div class="tab-content">${tabPanes}</div>
                        </div>
                    `;
                } else if (lesson.youtubeId) {
                    // SE TEM SÓ 1 VÍDEO, constrói o player único
                    videoContentHtml = `
                        <div class="video-container">
                            <iframe 
                                src="https://www.youtube.com/embed/${lesson.youtubeId}" 
                                title="${lesson.title}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                                loading="lazy">
                            </iframe>
                        </div>
                    `;
                } else {
                    // Se não tiver nenhum
                    videoContentHtml = '<p>O vídeo para esta aula será disponibilizado em breve.</p>';
                }


                // --- 3. Monta o HTML FINAL do item (na sua estrutura) ---
                const itemHtml = `
                    <div class="accordion-item">
                        <button class="accordion-header" aria-expanded="false">
                            <span>${lesson.title}</span>
                            <i data-lucide="chevron-down" class="accordion-arrow"></i>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-content-inner">
                                
                                <div class="lesson-details">
                                    <h4>Descrição da Aula</h4>
                                    <p>${lesson.description || 'Sem descrição.'}</p>
                                    <h4>Tópicos Abordados</h4>
                                    <p>${lesson.topics || 'Sem tópicos definidos.'}</p>
                                </div>

                                ${videoContentHtml}

                                <div class="material-section">
                                    <h4>Materiais de Apoio</h4>
                                    ${materialHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                accordionWrapper.innerHTML += itemHtml;
            });

            lucide.createIcons();
            addAccordionEvents();
            addTabEvents(); // Ativa a nova função das abas

        } catch (error) {
            console.error('Erro ao carregar aulas:', error);
            // (MELHORADO!) Mensagem de erro mais específica
            accordionWrapper.innerHTML = `<p>Não foi possível carregar as aulas de ${jsonFileName}. Detalhes: ${error.message}</p>`;
        }
    }

    // Função que faz o accordion abrir e fechar (sem mudanças)
    function addAccordionEvents() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                header.classList.toggle('active');

                if (header.classList.contains('active')) {
                    header.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    header.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = '0px';
                }
            });
        });
    }

    // (NOVA FUNÇÃO) Adiciona eventos de clique para as Abas
    function addTabEvents() {
        const tabContainers = document.querySelectorAll('.video-tab-container');
        
        tabContainers.forEach(container => {
            const tabButtons = container.querySelectorAll('.tab-btn');
            const tabPanes = container.querySelectorAll('.video-tab-pane');

            tabButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Impede que o clique na aba feche o accordion
                    e.stopPropagation(); 

                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabPanes.forEach(pane => pane.classList.remove('active'));

                    button.classList.add('active');
                    const tabId = button.getAttribute('data-tab');
                    container.querySelector(`#${tabId}`).classList.add('active');
                });
            });
        });
    }

    // Inicia o processo
    loadLessons();
});