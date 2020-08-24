import { elements } from './base';
//! import { EvalSourceMapDevToolPlugin } from 'webpack';


    //return the imput value of the field
export const getInput = () =>elements.searchInput.value;

export const clearImput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () =>{      //so that previous results list will bee cleared after next search
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highLightedSelected = id =>{
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el=>{
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[id="${id}"]`).classList.add('results__link--active');     //giving css selector
}



//testing algorithm:  'Pasta with tomato and spinach'
/*
acc 0 /acc + curr.length =0+5=5  //newTitle = ['Pasta']
acc 5 /acc + curr.length =5+4=9  //newTitle = ['Pasta','with']
acc 9 /acc + curr.length =9+6=15  //newTitle = [Pasta','with','tomato']   //still 15 > 17
acc 15 /acc + curr.length =15+3=18  //newTitle = ['Pasta','with','tomato']  //! 'and' cant be pushed beecause 18!<=17
acc 18 /acc + curr.length =18+7=25  //newTitle = ['Pasta','with','tomato']


*/
const limitRecipeTitle = (title, limit=17) =>{      //PRIVATE FNX
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc,curr)=>{
            if(acc + curr.length <= limit){
                newTitle.push(curr);
            }
            return acc + curr.length; //this becomes acc for next iteration
        },0);
        return `${newTitle.join(' ')} ...`;      //opposite of split ----here it joins by space between arr elements
    }
    return title;
};

const renderRecipee = (recipe,recipes) =>{    //we dont need outside this modeule (private function)
    const markup = `
            <li>
                <a class="results__link" id=${recipes.indexOf(recipe)} href="#${recipe.recipe.label}--resultIndex${recipes.indexOf(recipe)}">
                    <figure class="results__fig">
                        <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${limitRecipeTitle(recipe.recipe.label)}</h4>
                        <p class="results__author">${recipe.recipe.source}</p>
                    </div>
                </a>
            </li>
    `;
    
    elements.searchResultList.insertAdjacentHTML('beforeend',markup);
};


//type: prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${ type === 'prev'? page-1: page + 1 }>
    <span>Page ${ type === 'prev'? page-1: page + 1 }</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${ type === 'prev'? 'left': 'right' }"></use>
    </svg>
    
    </button>
`;

const renderButtons = (page, numResults, resPerPage) =>{
    const pages = Math.ceil(numResults/resPerPage);     //no of pages
    let button;

    if(page === 1 && pages>1){
        //button to go to next page
        button = createButton(page,'next');
    }
    else if(page<pages){
        //both buttons
        button = `
           ${createButton(page,'prev')}
           ${createButton(page,'next')}  `;
    } 
    else if(page === pages && pages > 1){
        //only button to go to previous page
        button = createButton(page,'prev');
    }
    elements.searchResPages.insertAdjacentHTML("afterbegin",button);
};

export const renderResults = (recipes, page=1, resPerPage=4) =>{
    // console.log(recipes);
    //rendeeer results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    // recipes.slice(start,end).forEach(renderRecipee); //if done like this it will auto pass all elements into renderecipe
    recipes.slice(start,end).forEach((recipe)=>renderRecipee(recipe,recipes));

    //render pagination buuons
    renderButtons(page,recipes.length, resPerPage);
};
