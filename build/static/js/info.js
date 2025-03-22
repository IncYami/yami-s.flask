// Adicionar ao seu arquivo de JavaScript existente ou criar um novo

document.addEventListener('DOMContentLoaded', function() {
    // Efeito de hover para os blocos de informação
    const infoBlocks = document.querySelectorAll('.info-block');
    
    infoBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(0,0,0,0.3)';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Detecção e destaque de informações técnicas especiais
    const infoLines = document.querySelectorAll('.info-item-line');
    
    infoLines.forEach(line => {
        // Highlight resoluções
        if (line.textContent.match(/\b\d{3,4}[px]\b|\b\d{3,4}x\d{3,4}\b/)) {
            line.classList.add('resolution-info');
        }
        
        // Highlight para bitrates
        if (line.textContent.match(/\b\d+(\.\d+)?\s*(kbps|mbps)\b/i)) {
            line.classList.add('bitrate-info');
        }
        
        // Highlight para codecs
        if (line.textContent.match(/\b(h\.264|h\.265|hevc|avc|xvid|vp9|av1)\b/i)) {
            line.classList.add('codec-info');
        }
    });
});