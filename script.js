document.addEventListener('DOMContentLoaded', () => {
    // 1. Зберігання інформації про ОС і браузер у localStorage
    const systemData = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        deviceMemory: navigator.deviceMemory || 'N/A' // Доступно не у всіх браузерах
    };

    localStorage.setItem('systemInfo', JSON.stringify(systemData));

    // Відображення інформації у футері
    const infoDiv = document.getElementById('systemInfo');
    if (infoDiv) {
        infoDiv.textContent = JSON.stringify(systemData, null, 2);
    }

    // 2. Отримання коментарів із JSONPlaceholder
    const commentsDiv = document.getElementById('comments');
    if (commentsDiv) {
        fetch('https://jsonplaceholder.typicode.com/posts/13/comments')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(comments => {
                commentsDiv.innerHTML = ''; // Очистити "Завантаження..."
                comments.forEach(comment => {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${comment.name} (<em>${comment.email}</em>)</strong>: ${comment.body}`;
                    commentsDiv.appendChild(p);
                });
            })
            .catch(error => {
                console.error('Не вдалося завантажити коментарі:', error);
                commentsDiv.innerHTML = '<p>Не вдалося завантажити коментарі. Будь ласка, спробуйте пізніше.</p>';
            });
    }

    // 3. Модальне вікно
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('closeModal');

    if (modal && closeModalButton) {
        // Показати модальне вікно через 60 секунд
        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 60000); // 60000 мс = 60 секунд

        // Закрити вікно по кнопці
        closeModalButton.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Закрити модальне вікно при кліку поза ним (на фон)
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
        
        // Закрити модальне вікно при натисканні Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }

    // 4. Нічний/денний режим
    const themeToggleButton = document.getElementById('themeToggle');
    const body = document.body;
    
    function applyTheme(theme) {
        if (theme === 'night-mode') {
            body.classList.add('night-mode');
            if (themeToggleButton) themeToggleButton.textContent = 'Денний режим';
        } else {
            body.classList.remove('night-mode');
            if (themeToggleButton) themeToggleButton.textContent = 'Нічний режим';
        }
    }

    // Застосувати збережену тему або автоматичну
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Автоматичне переключення теми за часом
        const hour = new Date().getHours();
        if (hour < 7 || hour >= 20) { // Нічний режим з 20:00 до 07:00
            applyTheme('night-mode');
            localStorage.setItem('theme', 'night-mode'); 
        } else {
            applyTheme('day-mode');
            localStorage.setItem('theme', 'day-mode');
        }
    }
    
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const isNightMode = body.classList.toggle('night-mode');
            if (isNightMode) {
                localStorage.setItem('theme', 'night-mode');
                themeToggleButton.textContent = 'Денний режим';
            } else {
                localStorage.setItem('theme', 'day-mode');
                themeToggleButton.textContent = 'Нічний режим';
            }
        });
    }
});