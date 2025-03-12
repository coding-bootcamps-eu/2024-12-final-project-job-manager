export async function parseJobPage(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ошибка загрузки страницы');
  
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
  
      // Пример парсинга заголовка вакансии и описания
      const title = doc.querySelector('h1')?.innerText || 'Название не найдено';
      const description = doc.querySelector('p, .description, .job-description')?.innerText || 'Описание отсутствует';
  
      return {
        title,
        description,
        url,
        parsedAt: new Date().toLocaleString()
      };
    } catch (error) {
      console.error('Ошибка парсинга:', error);
      return { title: 'Ошибка', description: 'Не удалось получить данные', url };
    }
  }
  