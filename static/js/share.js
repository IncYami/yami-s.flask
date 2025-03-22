// Função para compartilhar anime
function shareAnime(event, id, animeName) {
    event.stopPropagation(); // Previne que o card se expanda ao clicar no botão de compartilhar
    
    // Criar URL com o nome do anime (formatado para URL)
    const url = new URL(window.location.href);
    const animeSlug = animeName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    url.hash = 'anime-' + animeSlug;
    
    // Copiar URL para o clipboard
    navigator.clipboard.writeText(url.toString())
        .then(() => {
            // Mostrar tooltip de sucesso
            const shareBtn = event.currentTarget;
            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '<i class="fas fa-check me-1"></i> Copiado!';
            setTimeout(() => {
                shareBtn.innerHTML = originalText;
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

// Função para verificar se há um hash na URL e expandir o card correspondente
function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#anime-')) {
        const animeSlug = hash.replace('#anime-', '');
        
        // Encontrar o card correspondente pelo nome do anime
        setTimeout(() => {
            // Percorrer todos os cards para encontrar o que corresponde ao slug
            const animeCards = document.querySelectorAll('.anime-item');
            let foundIndex = null;
            
            animeCards.forEach((card, index) => {
                const nameElement = card.querySelector('.card-title');
                if (nameElement) {
                    const cardName = nameElement.textContent.trim();
                    const cardSlug = cardName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
                    
                    if (cardSlug === animeSlug) {
                        foundIndex = index + 1; // +1 porque os IDs começam em 1, não em 0
                    }
                }
            });
            
            if (foundIndex) {
                const id = foundIndex;
                const detailsEl = document.getElementById('details-' + id);
                const iconEl = document.getElementById('icon-' + id);
                const itemEl = document.getElementById('item-' + id);
            
            if (detailsEl && iconEl && itemEl) {
                // Expandir o card
                detailsEl.classList.add('open');
                iconEl.classList.add('rotate');
                itemEl.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
                
                // Rolar para o item
                itemEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            }
        }, 300); // Pequeno atraso para garantir que a página já carregou
    }
}

// Verificar hash na URL quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    checkUrlHash();
    
    // Verificar também quando o hash muda (navegação dentro da página)
    window.addEventListener('hashchange', checkUrlHash);
});