export function loadThemes() {
    const apply = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);

        const url = new URL(document.location);
        url.searchParams.set('theme', theme);

        window.history.pushState({}, '', url); // pushState(data, title, url)
        localStorage.setItem('theme', theme);
    }

    const selection = () => {
        const urlQuery = new URL(document.location).searchParams;
        const theme = urlQuery.get('theme');

        const themesList = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine",
            "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
            "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
        ];

        let saved = localStorage.getItem('theme') || 'cupcake';
        if (theme && themesList.includes(theme)) {
            saved = theme;
        }

        const current = document.querySelector(`input[name='theme-dropdown'][value='${saved}']`);
        if (current) {
            current.checked = true;
        }
        apply(saved);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const dropDown = document.querySelector('div[data-choose-theme] ul.dropdown-content');
        if (dropDown) {
            selection();
            dropDown.addEventListener('change', (e) => {
                apply(e.target.closest('input').value);
            })
        }
    })
}