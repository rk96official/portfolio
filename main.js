const DEFAULT_PAGE = 'about';

function route() {
    const id = decodeURIComponent(location.hash.slice(1)) || DEFAULT_PAGE;
    const target = document.getElementById(id);
    const page = target && target.classList.contains('page') ? target : document.getElementById(DEFAULT_PAGE);

    document.querySelectorAll('.page.active').forEach(p => p.classList.remove('active'));
    page.classList.add('active');

    const navId = page.dataset.nav || page.id;
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${navId}`);
    });

    const heading = page.querySelector('h1, .page-title');
    document.title = page.id === DEFAULT_PAGE || !heading
        ? 'Rupak Kadel'
        : `${heading.textContent.trim()} · Rupak Kadel`;

    requestAnimationFrame(() => window.scrollTo(0, 0));
    closeMenu();
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

document.querySelectorAll('[data-limit]').forEach(list => {
    const limit = Number(list.dataset.limit);
    const extra = Array.from(list.children).slice(limit);
    if (!extra.length) return;

    extra.forEach(item => { item.hidden = true; });
    const button = document.createElement('button');
    button.className = 'show-more';
    button.type = 'button';
    button.textContent = `Show ${extra.length} more`;
    button.addEventListener('click', () => {
        const expanding = extra[0].hidden;
        extra.forEach(item => { item.hidden = !expanding; });
        button.textContent = expanding ? 'Show less' : `Show ${extra.length} more`;
    });
    list.after(button);
});

// Copy-to-clipboard buttons
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}

document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async e => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText(button.dataset.copy);
            showToast('Email copied to clipboard');
        } catch {
            showToast(button.dataset.copy);
        }
    });
});

const photo = document.getElementById('profilePhoto');
if (photo) {
    const fallback = () => {
        photo.hidden = true;
        document.getElementById('photoPlaceholder').hidden = false;
    };
    photo.addEventListener('error', fallback);
    if (photo.complete && photo.naturalWidth === 0) fallback();
}

document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('hashchange', route);
route();
