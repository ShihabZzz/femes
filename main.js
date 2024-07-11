import './style.css'
import { loadThemes } from './themes.js'
import { loadTrash, loadSaved, loadMaximize } from './svgUtils.js'
import { shuffle } from './shuffle.js'

let set = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

let get = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

let apiKey = get('apiKey') || '';
let search = document.getElementById('search');
const setAPI_btn = document.getElementById('setAPI_btn');
const askAPI_modal = document.getElementById('askAPI_modal');
const saved_modal = document.getElementById('saved_modal');
const max_modal = document.getElementById('max_modal');
const apiSubmit = document.getElementById('apiSubmit');
const errorMsg = document.getElementById('errorMsg');
const dropDownContent = document.querySelector('div[data-choose-theme] ul.dropdown-content');


let demoStatus = () => {
    const urlQuery = new URL(document.location).searchParams;
    const status = urlQuery.get('demo');
    return (status === 'true');
}
console.log(demoStatus())

let demo = async (fileName) => {
    if (demoStatus()) {
        feedConditions();
        localStorage.clear();
        const demoJSON = `/${fileName}.json`;
        try {
            showSpinner()
            const ep = await fetch(demoJSON);
            if (!ep) {
                throw new Error('Facing network response issue...')
            }
            const response = await ep.json();

            shuffle(response);

            set('fav', []);
            showStats();
            drawerStats()
            feedBuilder(response);
        } catch (error) {
            console.error('Unexpected Erorr:', error.message, error.status);
        } finally {
            hideSpinner();
        }
    }
}

// themes-generation
if (dropDownContent) {
    const themesList = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine",
        "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
        "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset",
    ];
    function createList(theme) {
        const li = document.createElement('li');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'theme-dropdown';
        input.classList.add('btn', 'btn-sm', 'btn-block', 'btn-ghost', 'justify-start');
        input.ariaLabel = theme;
        input.value = theme;

        li.appendChild(input);
        dropDownContent.appendChild(li);
    }
    for (let i = 0; i < themesList.length; i++) {
        createList(themesList[i]);
    }
}

loadThemes();


let drawerStats = () => {
    const drawerStatsID = document.getElementById('drawerStats');
    drawerStatsID.classList.remove('hidden');

    const drawerClearAPI = document.getElementById('drawerClearAPI');
    drawerClearAPI.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    })
}

let showStats = () => {
    const stats = document.getElementById('stats');
    stats.classList.remove('lg:hidden');
    stats.classList.add('lg:flex');

    const clearAPI = document.getElementById('clearAPI');
    clearAPI.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    })
}

let updateStats = (favSize) => {
    const favCount = document.getElementById('favCount');
    const drawerFavCount = document.getElementById('drawerFavCount');
    favCount.innerText = favSize;
    drawerFavCount.innerText = favSize;
}

let deleteItem = (index) => {
    const fav = JSON.parse(localStorage.getItem('fav'));
    const savedSvgId = fav[index].id;

    fav.splice(index, 1);
    localStorage.setItem('fav', JSON.stringify(fav));
    updateStats(fav.length);
    sideBarBuilder();
    drawer();
    // Reset the color of the savedIcon
    const savedIcon = document.getElementById(`svg-${savedSvgId}`);
    if (savedIcon) {
        savedIcon.querySelector('path').setAttribute('fill', 'currentColor');
    }
}

let drawer = () => {
    const fav = JSON.parse(localStorage.getItem('fav'));
    const drawer = document.getElementById('drawer_mobile');
    drawer.innerText = "";

    fav.forEach((item, index) => {
        const parentConatiner = document.createElement('div');
        parentConatiner.classList.add('flex', 'justify-between', 'items-center', 'group')

        const liTag = document.createElement('li');
        liTag.classList.add('font-medium');
        const aTag = document.createElement('a');
        aTag.innerText = item.title;
        liTag.appendChild(aTag);

        const trashIcon = loadTrash();
        trashIcon.id = index;
        trashIcon.dataset.name = 'loadTrash';
        trashIcon.classList.add('opacity-0', 'group-hover:opacity-100', 'hover:text-error');

        parentConatiner.appendChild(liTag);
        parentConatiner.appendChild(trashIcon);
        drawer.insertAdjacentElement('afterbegin', parentConatiner);
    });

    drawer.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        const svgElement = event.target.closest('svg');
        if (!svgElement) {
            const imgElement = event.target.closest('div').querySelector('svg');
            if (imgElement) {
                const imgTag = max_modal.querySelector('div img');
                const favArr = get('fav');
                imgTag.src = favArr[imgElement.id].src;
                max_modal.showModal();
            }
            return;
        }
        if (svgElement.dataset.name === 'loadTrash') {
            const id = svgElement.id;
            deleteItem(id);
        }
    })

}

let sideBarBuilder = () => {
    const fav = JSON.parse(localStorage.getItem('fav'));
    const sideBar = document.getElementById('sideBar');
    sideBar.innerText = "";
    fav.forEach((item, index) => {
        const parent = document.createElement('li');
        parent.classList.add('group');

        const avatar = document.createElement('div');
        avatar.classList.add('avatar', 'p-0.5');

        const mask = document.createElement('div');
        mask.classList.add('mask', 'mask-squircle', 'h-12', 'w-12');
        const img = document.createElement('img');
        img.src = item.src;
        mask.appendChild(img);

        const aTag = document.createElement('a');
        aTag.classList.add('font-semibold', 'p-0');
        aTag.innerText = item.title;

        const trashIcon = loadTrash();
        trashIcon.id = index;
        trashIcon.dataset.name = 'loadTrash';
        trashIcon.classList.add('opacity-0', 'group-hover:opacity-100', 'hover:text-error');

        avatar.appendChild(mask);
        avatar.appendChild(aTag);
        avatar.appendChild(trashIcon);
        parent.appendChild(avatar);
        sideBar.insertAdjacentElement('afterbegin', parent);
    });
    sideBar.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        const svgElement = event.target.closest('svg');
        if (!svgElement) {
            const imgElement = event.target.closest('li').querySelector('img');
            if (imgElement) {
                const imgTag = max_modal.querySelector('div img');
                imgTag.src = imgElement.src;
                max_modal.showModal();
            }
            return;
        }
        if (svgElement.dataset.name === 'loadTrash') {
            const id = svgElement.id;
            deleteItem(id);
        }
    })
}

let isAvailable = (id) => {
    const fav = JSON.parse(localStorage.getItem('fav'));
    if (fav) {
        const isItThere = fav.find(item => item.id == id);
        if (isItThere) return true;
    }
    return false;
}

let sideBar = (id, src, savedIconColor) => {
    const fav = JSON.parse(localStorage.getItem('fav'));
    if (fav) {
        const createTitle = document.getElementById('createTitle');
        createTitle.addEventListener('click', () => {
            const saved_title = document.getElementById('saved_title').value || '';
            const obj = {
                src: src,
                id: id,
                title: saved_title,
            }
            fav.push(obj);
            localStorage.setItem('fav', JSON.stringify(fav));
            saved_modal.close();
            savedIconColor.setAttribute('fill', 'green');
            updateStats(fav.length);
            sideBarBuilder();
            drawer();
        })
    }
}

let showSpinner = () => {
    const spinner = document.getElementById('spinner');
    spinner.classList.remove('hidden');
}

let hideSpinner = () => {
    const spinner = document.getElementById('spinner');
    spinner.classList.add('hidden');
}

let warning = () => {
    const warning = document.getElementById('warning')
    warning.classList.remove('flex');
    warning.classList.add('hidden');
    return warning;
}

let feedConditions = () => {
    askAPI_modal.close();
    const initMsg = document.querySelector('#feed p.text-center');
    initMsg.classList.add('hidden');
    const setAPIbtn = document.querySelector('#feed div.text-center.mt-3'); //
    setAPIbtn.classList.add('hidden'); //
}

let feedBuilder = (memes) => {

    const memesContainer = document.getElementById('memesContainer');
    memesContainer.classList.remove('hidden');
    memesContainer.classList.add('grid');
    memesContainer.innerText = "";

    for (let i = 0; i < memes.length; i++) {
        const imgConatiner = document.createElement('div');
        imgConatiner.classList.add('box-border', 'w-60', 'h-80', 'xs:w-64', 'md:w-60',
            'rounded-xl', 'shadow-xl', 'place-content-center', 'overflow-hidden',
            'transition', 'duration-500', 'hover:scale-110', 'relative', 'group');
        // 'hover:-translate-y-2.5'

        const img = document.createElement('img');
        img.classList.add('w-full', 'h-60', 'block', 'object-contain');
        img.src = memes[i].url;
        img.id = memes[i].id;
        imgConatiner.appendChild(img);

        const hoverContainerRight = document.createElement('div');
        hoverContainerRight.classList.add(
            'absolute', 'bottom-0',
            'right-0', '-translate-x-1/2', '-translate-y-1/2',
            'opacity-0', 'transition-opacity', 'duration-500', 'group-hover:opacity-100',
            'hover:cursor-pointer'
        );
        const savedIcon = loadSaved();
        savedIcon.id = `svg-${memes[i].id}`;
        savedIcon.dataset.name = 'loadSaved';
        if (isAvailable(memes[i].id)) {
            savedIcon.querySelector('path').setAttribute('fill', 'green');
        }
        hoverContainerRight.appendChild(savedIcon);

        const hoverContainerLeft = document.createElement('div');
        hoverContainerLeft.classList.add(
            'absolute', 'bottom-0',
            'left-0', 'translate-x-1/2', '-translate-y-1/2',
            'opacity-0', 'transition-opacity', 'duration-500', 'group-hover:opacity-100',
            'hover:cursor-pointer'
        );
        const maximizeIcon = loadMaximize();
        maximizeIcon.dataset.name = 'loadMaximize';
        hoverContainerLeft.appendChild(maximizeIcon);

        imgConatiner.appendChild(hoverContainerRight);
        imgConatiner.appendChild(hoverContainerLeft);
        memesContainer.appendChild(imgConatiner);
    }
    memesContainer.addEventListener('click', (event) => {
        const svgElement = event.target.closest('svg');
        if (!svgElement) {
            return;
        }
        const src = event.target.closest('div.box-border').querySelector('img').src;

        if (svgElement.dataset.name === 'loadSaved') {
            const savedIconColor = event.target.closest('svg').querySelector('path');
            const id = event.target.closest('div.box-border').querySelector('img').id;
            if (isAvailable(id)) {
                return;
            }
            saved_modal.showModal();
            sideBar(id, src, savedIconColor);
        } else if (svgElement.dataset.name === 'loadMaximize') {
            const imgTag = max_modal.querySelector('div img');
            imgTag.src = src;
            max_modal.showModal();
        }
    })
}

let requestSegment = async (keywords) => {

    showSpinner()

    const apiKeyValue = get('apiKey') || document.getElementById('apiKey').value || '';
    // console.log(apiKeyValue);
    const number = 10;
    const mediaType = 'image';
    const reqOptions = {
        method: 'GET',
        headers: {
            'x-api-key': apiKeyValue
        },
        redirect: 'follow'
    }
    try {
        let url = `https://api.humorapi.com/memes/search?number=${number}&media-type=${mediaType}`;
        if (keywords) {
            url += `&keywords=${keywords}`;
        }
        const ep = await fetch(url, reqOptions);
        if (!ep.ok) {
            const response = await ep.json();
            console.log(response.code);

            if (response.code == 402) {
                if (!apiKey) {
                    feedConditions();
                    showStats();
                }
                const warningID = warning();
                warningID.classList.remove('hidden');
                warningID.classList.add('flex');
                const warningMsg = warningID.querySelector('span');
                warningMsg.innerText = `${response.message}`;

                if (!apiKey) {
                    localStorage.setItem('apiKey', JSON.stringify(apiKeyValue));
                    apiKey = localStorage.getItem('apiKey') || '';
                    // localStorage.setItem('memes', JSON.stringify(response.memes));
                    localStorage.setItem('fav', JSON.stringify([]));
                }
            } else {
                // const errorMsg = document.getElementById('errorMsg');
                errorMsg.classList.remove('hidden');
                errorMsg.textContent = `${response.message}` || 'Client Error';
            }

            const error = new Error('Unexpected Erorr:');
            error.status = ep.status;
            throw error;
        }
        const response = await ep.json();
        // console.log(response);

        if (!apiKey) {
            localStorage.setItem('apiKey', JSON.stringify(apiKeyValue));
            apiKey = localStorage.getItem('apiKey') || '';
            // localStorage.setItem('memes', JSON.stringify(response.memes));
            localStorage.setItem('fav', JSON.stringify([]));
        }
        feedConditions();
        showStats();
        feedBuilder(response.memes);
    } catch (error) {
        console.error(error.message, error.status);
    } finally {
        hideSpinner();
    }
}

demo('demo_memes');

if (!apiKey && !demoStatus())
    localStorage.clear();

if (apiKey) {
    // feedBuilder();
    warning();
    feedConditions();
    requestSegment();
    showStats();
    const fav = JSON.parse(localStorage.getItem('fav'));
    if (fav) {
        updateStats(fav.length || '0');
    }
    sideBarBuilder();
    drawer();
    drawerStats();

}

let timeOutId;
search.addEventListener('input', () => {
    clearTimeout(timeOutId);
    const searchErroMsg = document.getElementById('searchErroMsg');
    searchErroMsg.classList.add('hidden');
    if (demoStatus() && search.value) {
        if (search.validity.tooShort) {
            searchErroMsg.classList.remove('hidden');
        } else {
            timeOutId = setTimeout(() => demo('demo_search'), 2000);
        }
    } else if (!apiKey && search.value)
        askAPI_modal.showModal();
    else {
        if (search.validity.tooShort) {
            searchErroMsg.classList.remove('hidden');
        } else if (search.value != '') {
            timeOutId = setTimeout(() => requestSegment(search.value), 2000);
        }
    }
})

apiSubmit.addEventListener('click', () => {
    errorMsg.classList.add('hidden');
    requestSegment();
});

setAPI_btn.addEventListener('click', () => {
    errorMsg.classList.add('hidden');
    document.getElementById('apiKey').value = "";
    askAPI_modal.showModal();
})