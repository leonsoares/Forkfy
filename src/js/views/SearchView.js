import { elements } from './Base';

export const getInput = () => elements.searchInput.value; // Arrow function if on  the same line will altomatically return the variable

export const clearInput = () => {
    elements.searchInput.value = '';
}
export const clearResuts = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const hightLight = id => {
    const resultArr = Array.from(document.querySelectorAll(".results__link"));
    resultArr.forEach(el=> {
        el.classList.remove('results__link--active')
    })
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}

//________________________________________________________________
// export const limitRecipeTitle = (title, limit = 17) => {
//     const newTitle = [];
//     if (title.length > limit) {
//         title.split(" ").reduce((acc, current) => {
//             if( acc + current.lenght <= limit) {
//                 newTitle.push(current);
//             }
//             return acc + current.length;
//         }, 0);
//         return `${newTitle.join(' ')}...`;
//     }
//     console.log(title);
//     return title;
// };

export const limitRecipeTitle = (title, limit = 17) => {
    if (title.length >= limit) {
        return `${title.slice(0, limit)}...`;
    }
    
    return title;
};
//_________________________________________________________________

export const renderRecipe = recipe => {
    const markup = 
        `<li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;
        elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButtons = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`

const renderButtons = (page, numResults, resPerPages) => {
    const pages = Math.ceil(numResults / resPerPages);

    let button 
    if (page === 1 && pages > 1){
        // Display only Next page button
        button = createButtons(page, 'next')
    } else if (page < pages){
        // Display Prev and Next buttons
        button = `
        ${createButtons(page, 'prev')}
        ${createButtons(page, 'next')}
        `
        console.log(button)
    } else if(page === pages && pages > 1){
        // Display only Prev button
        button = createButtons(page, 'prev')
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    let start = (page - 1) * resPerPage; // 0
    let end = page * resPerPage; // 10
    console.log(recipes);
    recipes.slice(start, end).forEach(renderRecipe);
    
    // Render Pagination buttons
    renderButtons(page, recipes.length, resPerPage)
};


