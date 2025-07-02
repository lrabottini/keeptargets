function waitForElements(callback) {
    const maxTries = 20;
    let tries = 0;
  
    const interval = setInterval(() => {
      const header = document.getElementById("rg-header");
      const content = document.getElementById("rg-content");
      const table = document.getElementById("table-info");
      const resume = document.getElementById("rg-resume");
  
      if (header && content && table && resume) {
        clearInterval(interval);
        callback({ header, content, table, resume });
      }
  
      tries++;
      if (tries > maxTries) clearInterval(interval);
    }, 300);
  }
  
  waitForElements(({ header, content, table, resume }) => {
    content.style.scrollBehavior = "smooth";
  
    content.onscroll = () => {
      requestAnimationFrame(() => {
        header.scrollLeft = content.scrollLeft;
        table.scrollTop = content.scrollTop;
        resume.scrollTop = content.scrollTop;
      });
    };
  
    table.addEventListener('wheel', (e) => {
      e.preventDefault();
      content.scrollBy({
        top: e.deltaY,
        behavior: 'smooth'
      });
    }, { passive: false });
  
    resume.addEventListener('wheel', (e) => {
      e.preventDefault();
      content.scrollBy({
        top: e.deltaY,
        behavior: 'smooth'
      });
    }, { passive: false });
  
    header.addEventListener('wheel', (e) => {
      e.preventDefault();
      content.scrollBy({
        left: e.deltaX,
        behavior: 'smooth'
      });
    }, { passive: false });
  });
  
 

<style>
  /* Oculta scrolls visuais dos elementos sincronizados */
  #rg-header,
  #table-info,
  #rg-resume {
    overflow: hidden !important;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }

  #rg-header::-webkit-scrollbar,
  #table-info::-webkit-scrollbar,
  #rg-resume::-webkit-scrollbar {
    display: none !important;
  }

  /* Estiliza a barra horizontal visível do rg-content */
  #rg-content::-webkit-scrollbar {
    height: 6px;
  }

  #rg-content::-webkit-scrollbar-track {
    background: transparent;
  }

  #rg-content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  #rg-content {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  }
</style>
