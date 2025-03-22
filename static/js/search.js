// Funcionalidade de pesquisa
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const animeItems = document.querySelectorAll('.anime-item');

    // Função para filtrar os animes baseado no texto de pesquisa
    function filterAnimes() {
        const searchText = searchInput.value.toLowerCase().trim();
        let hasResults = false;
        
        animeItems.forEach(item => {
            const title = item.querySelector('.card-title').textContent.toLowerCase();
            const filesContent = item.querySelector('.anime-files')?.textContent.toLowerCase() || '';
            const infoContent = item.querySelector('.info-content')?.textContent.toLowerCase() || '';
            
            // Verifica se o texto da pesquisa está presente no título, arquivos ou informações
            if (title.includes(searchText) || filesContent.includes(searchText) || infoContent.includes(searchText)) {
                item.style.display = 'block';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Mostrar mensagem se não houver resultados
        const noResultsMsg = document.getElementById('noResultsMessage');
        if (!hasResults && searchText !== '') {
            if (!noResultsMsg) {
                const container = document.querySelector('.container.mb-5 .row .col-12');
                const message = document.createElement('div');
                message.id = 'noResultsMessage';
                message.className = 'text-center mt-4 mb-4';
                message.innerHTML = '<h3>Nenhum resultado encontrado</h3><p>Tente usar termos diferentes na sua pesquisa.</p>';
                container.appendChild(message);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Evento de input para a caixa de pesquisa
    searchInput.addEventListener('input', filterAnimes);

    // Evento para limpar a pesquisa
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        filterAnimes();
        searchInput.focus();
    });

    // Permitir a limpeza da pesquisa com a tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            filterAnimes();
        }
    });
});