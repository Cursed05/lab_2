document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація AOS
    AOS.init({
        duration: 800, // тривалість анімації
        once: true,    // анімація спрацьовує лише один раз
        offset: 50     // відступ від краю екрану для спрацювання анімації
    });

    // ... (решта вашого JS коду залишається)

    // 1. Зберігання інформації про ОС і браузер... (код без змін)
    const systemData = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        deviceMemory: navigator.deviceMemory || 'N/A'
    };
    localStorage.setItem('systemInfo', JSON.stringify(systemData));
    const infoDiv = document.getElementById('systemInfo');
    if (infoDiv) {
        infoDiv.textContent = JSON.stringify(systemData, null, 2);
    }

    // 2. Отримання коментарів із JSONPlaceholder
    const commentsDiv = document.getElementById('comments');
    const loaderContainer = commentsDiv ? commentsDiv.querySelector('.loader-container') : null;

    if (commentsDiv && loaderContainer) {
        // Показати loader на старті (він вже видимий через HTML, але це для ясності)
        loaderContainer.style.display = 'flex'; 

        fetch('https://jsonplaceholder.typicode.com/posts/13/comments')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(comments => {
                loaderContainer.style.display = 'none'; // Приховати loader
                commentsDiv.innerHTML = ''; // Очистити, щоб видалити loader контейнер
                comments.forEach(comment => {
                    const commentCard = document.createElement('div');
                    commentCard.classList.add('comment-card');
                    commentCard.setAttribute('data-aos', 'fade-left'); // Анімація для кожного коментаря
                    commentCard.innerHTML = `
                        <h4><i class="fa-solid fa-comment-dots"></i> ${comment.name}</h4>
                        <p class="comment-email"><i class="fa-solid fa-envelope-open-text"></i> <em>${comment.email}</em></p>
                        <p class="comment-body">${comment.body}</p>
                    `;
                    commentsDiv.appendChild(commentCard);
                });
                AOS.refresh(); // Оновити AOS для нових елементів (якщо вони додані після init)
            })
            .catch(error => {
                console.error('Не вдалося завантажити коментарі:', error);
                if (loaderContainer) loaderContainer.style.display = 'none'; // Приховати loader у випадку помилки
                commentsDiv.innerHTML = '<p class="error-message"><i class="fa-solid fa-circle-exclamation"></i> Не вдалося завантажити коментарі. Будь ласка, спробуйте пізніше.</p>';
            });
    }

    // 3. Модальне вікно (код без змін, окрім AOS атрибуту в HTML)
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('closeModal');
    if (modal && closeModalButton) {
        setTimeout(() => {
            if(modal.classList.contains('hidden')) { // Перевіряємо чи модалка вже не видима
                modal.classList.remove('hidden');
                AOS.refreshHard(); // Перерахувати позиції для анімації модалки
            }
        }, 60000);
        closeModalButton.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (event) => {
            if (event.target === modal) modal.classList.add('hidden');
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }

    // 4. Нічний/денний режим
    const themeToggleButton = document.getElementById('themeToggle');
    const themeIcon = themeToggleButton ? themeToggleButton.querySelector('i') : null;
    const themeText = themeToggleButton ? themeToggleButton.querySelector('.theme-text') : null;
    const body = document.body;
    
    function applyTheme(theme) {
        if (theme === 'night-mode') {
            body.classList.add('night-mode');
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun'; // Змінити іконку
            if (themeText) themeText.textContent = 'Денний режим';
        } else {
            body.classList.remove('night-mode');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon'; // Змінити іконку
            if (themeText) themeText.textContent = 'Нічний режим';
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const hour = new Date().getHours();
        if (hour < 7 || hour >= 21) { // Умова для нічної теми: до 7 ранку або після 21 вечора
            applyTheme('night-mode');
            localStorage.setItem('theme', 'night-mode'); 
        } else {
            applyTheme('day-mode'); // "day-mode" це просто відсутність "night-mode"
            localStorage.setItem('theme', 'day-mode');
        }
    }
    
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const isNightMode = body.classList.toggle('night-mode');
            if (isNightMode) {
                localStorage.setItem('theme', 'night-mode');
                if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
                if (themeText) themeText.textContent = 'Денний режим';
            } else {
                localStorage.setItem('theme', 'day-mode');
                if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
                if (themeText) themeText.textContent = 'Нічний режим';
            }
        });
    }
});