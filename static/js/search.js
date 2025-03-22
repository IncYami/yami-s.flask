document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const resetFilters = document.getElementById("resetFilters");
    const cards = document.querySelectorAll(".card");
    const animeContainer = document.querySelector(".container.mb-5 .row .col-12");
    
    function filterCards() {
        const searchText = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
        let hasResults = false;
        
        cards.forEach(card => {
            const title = card.querySelector(".card-title").textContent.toLowerCase();
            const hasFilter = activeFilter === "all" || card.querySelector(`.badge.bg-${getBadgeColor(activeFilter)}`);
            const isVisible = title.includes(searchText) && hasFilter;
            card.parentElement.style.display = isVisible ? "block" : "none";
            
            if (isVisible) {
                hasResults = true;
            }
        });
        
        // Mostrar mensagem se não houver resultados
        const existingMessage = document.getElementById("noResultsMessage");
        if (!hasResults && (searchText !== "" || activeFilter !== "all")) {
            if (!existingMessage) {
                const message = document.createElement("div");
                message.id = "noResultsMessage";
                message.className = "text-center mt-4 mb-4 p-3 bg-dark rounded border border-secondary";
                message.innerHTML = `
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente usar termos diferentes na sua pesquisa ou ajuste os filtros.</p>
                    <button class="btn btn-outline-light mt-2" id="resetAllBtn">
                        <i class="fas fa-sync-alt me-2"></i>Limpar Todos os Filtros
                    </button>
                `;
                animeContainer.appendChild(message);
                
                // Adicionar listener para o botão de reset
                document.getElementById("resetAllBtn").addEventListener("click", function() {
                    searchInput.value = "";
                    filterButtons.forEach(btn => btn.classList.remove("active"));
                    document.querySelector('[data-filter="all"]').classList.add("active");
                    filterCards();
                });
            }
        } else if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    function getBadgeColor(filter) {
        const colors = {
            "releasing": "success",
            "batch": "primary",
            "rev": "danger",
            "planning": "info"
        };
        return colors[filter] || "";
    }
    
    searchInput.addEventListener("input", filterCards);
    
    clearSearch.addEventListener("click", () => {
        searchInput.value = "";
        filterCards();
    });
    
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            filterCards();
        });
    });
    
    resetFilters.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        document.querySelector('[data-filter="all"]').classList.add("active");
        filterCards();
    });
    
    // Inicializar filtro "Todos" como ativo
    if (!document.querySelector(".filter-btn.active")) {
        document.querySelector('[data-filter="all"]').classList.add("active");
    }
    
    filterCards();
});