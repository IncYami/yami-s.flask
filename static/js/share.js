// Função para compartilhar anime
function shareAnime(event, id, animeName, anilistId) {
    event.stopPropagation(); // Previne que o card se expanda ao clicar no botão de compartilhar
    
    // Criar URL com o ID do AniList
    const url = new URL(window.location.href);
    url.hash = anilistId ? 'anilist-' + anilistId : 'anime-' + id;
    
    // Copiar URL para o clipboard
    navigator.clipboard.writeText(url.toString())
        .then(() => {
            // Mostrar feedback diretamente no botão
            const shareBtn = event.currentTarget;
            const originalHTML = shareBtn.innerHTML;
            
            // Mudar o conteúdo do botão
            shareBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copiado!';
            shareBtn.classList.add('bg-success');
            
            // Restaurar o botão após 2 segundos
            setTimeout(() => {
                shareBtn.innerHTML = originalHTML;
                shareBtn.classList.remove('bg-success');
            }, 2000);
        })
        .catch(err => {
            console.error('Erro ao copiar URL: ', err);
            // Fallback para navegadores que não suportam clipboard API
            fallbackCopyTextToClipboard(url.toString());
        });
}

// Fallback para navegadores sem suporte a Clipboard API
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Tornar invisível
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            // Mostrar alerta de sucesso
            alert('Link copiado para a área de transferência!');
        } else {
            console.error('Falha ao copiar texto');
        }
    } catch (err) {
        console.error('Erro ao copiar texto: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Função para verificar se há um hash na URL e abrir o modal correspondente
function checkUrlHash() {
    const hash = window.location.hash;
    
    // Verificar link com ID do AniList
    if (hash && hash.startsWith('#anilist-')) {
        const anilistId = hash.replace('#anilist-', '');
        
        setTimeout(() => {
            // Percorrer os cards para encontrar o que corresponde ao ID do AniList
            const animeModals = document.querySelectorAll('.modal');
            let foundIndex = null;
            
            animeModals.forEach((modal) => {
                const anilistLink = modal.querySelector('a[href^="https://anilist.co/anime/"]');
                if (anilistLink) {
                    const modalAnilistId = anilistLink.getAttribute('href').split('/').pop();
                    if (modalAnilistId === anilistId) {
                        const modalId = modal.id;
                        foundIndex = modalId.split('-')[1]; // Extrair o index do ID do modal
                    }
                }
            });
            
            if (foundIndex) {
                openAnimeModal(foundIndex);
            }
        }, 300);
    }
    // Manter compatibilidade com o formato antigo (por ID do modal)
    else if (hash && hash.startsWith('#anime-')) {
        const animeId = hash.replace('#anime-', '');
        
        if (!isNaN(animeId)) {
            // Se for um número, abrir diretamente
            openAnimeModal(animeId);
        } else {
            // Busca pelo nome do anime (compatibilidade com versão anterior)
            const animeSlug = animeId;
            
            setTimeout(() => {
                const animeCards = document.querySelectorAll('.card');
                let foundIndex = null;
                
                animeCards.forEach((card, index) => {
                    const nameElement = card.querySelector('.card-title');
                    if (nameElement) {
                        const cardName = nameElement.textContent.trim();
                        const cardSlug = cardName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
                        
                        if (cardSlug === animeSlug) {
                            foundIndex = index + 1;
                        }
                    }
                });
                
                if (foundIndex) {
                    openAnimeModal(foundIndex);
                }
            }, 300);
        }
    }
}

// Verificar hash na URL quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    checkUrlHash();
    
    // Verificar também quando o hash muda (navegação dentro da página)
    window.addEventListener('hashchange', checkUrlHash);
});