// Script para manipular pesquisa, filtros e interações com o navbar
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterInfo = document.getElementById('filterInfo');
    const filterBadges = document.getElementById('filterBadges');
    const animeCards = document.querySelectorAll('.col');
    
    // Armazenar filtros ativos
    let activeFilters = [];
    
    // Função para aplicar filtros
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        animeCards.forEach(card => {
            const titleElement = card.querySelector('.card-title');
            if (!titleElement) return;
            
            const title = titleElement.textContent.toLowerCase();
            let matchesSearch = true;
            let matchesFilters = true;
            
            // Verificar texto de pesquisa
            if (searchTerm && !title.includes(searchTerm)) {
                matchesSearch = false;
            }
            
            // Verificar filtros ativos
            if (activeFilters.length > 0) {
                matchesFilters = activeFilters.some(filter => {
                    if (filter === 'all') return true;
                    
                    const hasReleasing = card.querySelector('.badge.bg-success') !== null;
                    const hasBatch = card.querySelector('.badge.bg-primary') !== null;
                    const hasRev = card.querySelector('.badge.bg-danger') !== null;
                    const hasPlanning = card.querySelector('.badge.bg-info') !== null;
                    
                    switch (filter) {
                        case 'releasing': return hasReleasing;
                        case 'batch': return hasBatch;
                        case 'rev': return hasRev;
                        case 'planning': return hasPlanning;
                        default: return false;
                    }
                });
            }
            
            // Mostrar ou esconder com base nos critérios combinados
            if (matchesSearch && matchesFilters) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Atualizar UI dos filtros
        updateFilterBadges();
    }
    
    // Atualizar os badges de filtro
    function updateFilterBadges() {
        // Limpar badges existentes
        filterBadges.innerHTML = '';
        
        // Adicionar badge para texto de pesquisa se houver
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const searchBadge = document.createElement('span');
            searchBadge.className = 'badge bg-primary';
            searchBadge.innerHTML = `Busca: ${searchTerm} <i class="fas fa-times ms-1" data-search="clear"></i>`;
            searchBadge.querySelector('i').addEventListener('click', () => {
                searchInput.value = '';
                applyFilters();
            });
            filterBadges.appendChild(searchBadge);
        }
        
        // Adicionar badges para cada filtro ativo
        activeFilters.forEach(filter => {
            if (filter === 'all') return;
            
            const filterBadge = document.createElement('span');
            filterBadge.className = 'badge bg-secondary';
            
            let filterText = '';
            switch (filter) {
                case 'releasing': filterText = 'Em Lançamento'; break;
                case 'batch': filterText = 'Batch'; break;
                case 'rev': filterText = 'Em Revisão'; break;
                case 'planning': filterText = 'Em Planejamento'; break;
                default: filterText = filter;
            }
            
            filterBadge.innerHTML = `${filterText} <i class="fas fa-times ms-1" data-filter="${filter}"></i>`;
            filterBadge.querySelector('i').addEventListener('click', () => {
                // Remover esse filtro
                activeFilters = activeFilters.filter(f => f !== filter);
                applyFilters();
            });
            
            filterBadges.appendChild(filterBadge);
        });
        
        // Mostrar ou esconder a área de filtros
        if (searchTerm || activeFilters.length > 0) {
            filterInfo.style.display = 'block';
        } else {
            filterInfo.style.display = 'none';
        }
    }
    
    // Event listeners
    
    // Pesquisa
    searchInput.addEventListener('input', applyFilters);
    
    // Limpar pesquisa
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        applyFilters();
    });
    
    // Aplicar filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Se for um filtro existente, remova-o
            if (activeFilters.includes(filter)) {
                activeFilters = activeFilters.filter(f => f !== filter);
            } else {
                // Caso contrário, adicione-o
                activeFilters.push(filter);
            }
            
            applyFilters();
        });
    });
    
    // Resetar filtros
    resetFiltersBtn.addEventListener('click', () => {
        activeFilters = [];
        applyFilters();
    });
    
    // Limpar todos os filtros
    clearAllFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        activeFilters = [];
        applyFilters();
    });
    
    // Detectar pressionamento de tecla Escape para limpar pesquisa
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            applyFilters();
        }
    });
    
    // Efeito de navbar scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }
    });
});