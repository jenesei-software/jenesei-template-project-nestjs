import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

const theme = new SwaggerTheme();

const themes: Record<string, string> = {
  'theme-default': '',
  'theme-dracula': theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
  'theme-monokai': theme.getBuffer(SwaggerThemeNameEnum.MONOKAI),
  'theme-material': theme.getBuffer(SwaggerThemeNameEnum.MATERIAL),
  'theme-feeling-blue': theme.getBuffer(SwaggerThemeNameEnum.FEELING_BLUE),
};

const themesJson = JSON.stringify(themes);
const baseStyles = `
    .theme-selector-container {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      background: #1b1b1b;
      gap: 10px;
      font-family: sans-serif;
      color: #fff;
      position: relative;
      z-index: 100;
    }
    .theme-selector-container select {
      padding: 5px 10px;
      border-radius: 4px;
      border: 1px solid #555;
      background: #333;
      color: #fff;
      cursor: pointer;
    }
  `;

const customJsCode = `
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = function(query) {
      if (query.includes('prefers-color-scheme: dark') || query.includes('prefers-color-scheme')) {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: function() {},
          removeListener: function() {},
          addEventListener: function() {},
          removeEventListener: function() {}
        };
      }
      return originalMatchMedia.call(window, query);
    };

    document.documentElement.classList.remove('dark-mode');
    window.addEventListener('load', () => {
    document.documentElement.classList.remove('dark-mode', 'theme-dark');
      
      const themes = ${themesJson};

      // Создаём тег <style> для динамической подмены темы
      const styleTag = document.createElement('style');
      styleTag.id = 'swagger-dynamic-theme';
      document.head.appendChild(styleTag);

      // Создаём контейнер с селектором тем
      const container = document.createElement('div');
      container.className = 'theme-selector-container';
      container.innerHTML =
        '<span>Theme:</span>' +
        '<select id="theme-select">' +
          '<option value="theme-default">Default (Light)</option>' +
          '<option value="theme-dracula">Dracula</option>' +
          '<option value="theme-monokai">Monokai</option>' +
          '<option value="theme-material">Material</option>' +
          '<option value="theme-feeling-blue">Feeling Blue</option>' +
        '</select>';

      const topbar = document.querySelector('.topbar') || document.body;
      if (topbar === document.body) {
        topbar.insertBefore(container, topbar.firstChild);
      } else {
        topbar.appendChild(container);
      }

      const select = document.getElementById('theme-select');

      const changeTheme = (themeName) => {
        // Подменяем содержимое тега <style> — никаких конфликтов селекторов
        const dynamicStyle = document.getElementById('swagger-dynamic-theme');
        if (dynamicStyle) {
          dynamicStyle.textContent = themes[themeName] || '';
        }
        localStorage.setItem('swagger-ui-theme', themeName);
        select.value = themeName;
      };

      const savedTheme = localStorage.getItem('swagger-ui-theme') || 'theme-default';
      changeTheme(savedTheme);

      select.addEventListener('change', (e) => changeTheme(e.target.value));
    });
  `;

export { baseStyles, customJsCode };
