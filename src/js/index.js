
// Global app controller

import Search from './models/Search';
import Recipe, { getHash } from './models/Recipes';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/SearchView';
import * as listView from './views/listView';
import * as recipeView from './views/RecipeView';
import * as likesView from './views/LikesView';
import { elements, renderLoader, clearLoader } from './views/Base';


const state = {};

// -------------- Search Controler ------------------

const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();

    
    if (query) {
        // 2) New search object and add to to state
        state.search = new Search(query);
        // 3) prepare UI for results;
        
        
        searchView.clearInput();
        searchView.clearResuts();
        renderLoader(elements.searchRes);
        try{
            await state.search.getResults().then(result => {
                state.search.result = result.recipes
                clearLoader();
                console.log(result);
                searchView.renderResults(result.recipes); // show results on UI
            });

        }catch(error){
            console.log("Error", error);
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResuts();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// ----------------- Recipe Controler -----------------------------
const controlRecipe = async () => {
    const id = getHash();

    if(id){
        recipeView.clearRecipe();
        if(state.search) searchView.hightLight(id);

        renderLoader(elements.recipe)
        state.recipe = new Recipe(id);
        
        // window.r = state.recipe;

        try{
            await state.recipe.getRecipe().then(result => {
            // parseIngredients();
            // console.log(`${state.recipe.title} posted By ${state.recipe.author} you are going to need: ${state.recipe.ingredients[1]}`)
            // console.log(state.recipe);
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients()
            
            // console.log(state.recipe)

            // console.log(result.recipe.image_url)
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        
            });
        } catch (error){
            console.log("Error", error);
        }
    }
};

// window.addEventListener('hashchange', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))




const controlList = () => {
    // create a new List if there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredietns to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item)
    });
}

// handle delete and update list item events
elements.shoppingList.addEventListener("click", e => {
   const id = e.target.closest(".shopping__item").dataset.itemid;
    
   // handle the delete button
   if(e.target.matches(".shopping__delete *")){
       // delete from state
       state.list.deleteItem(id);

       // delete from UI
       listView.deleteItem(id)

   } else if(e.target.matches(".shopping__count-value")){
       const val = parseFloat(e.target.value, 10);
       state.list.updateCount(id, val)
   }
})

// ----------------- Like Recipe Controler -----------------------------

// Just for testint the likes functionality before adding data persisting code


const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    // User has NOT like current recipe
    if(!state.likes.isLiked(currentId)) {
        // Add like to the state
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img)
        // toggle the like button
        likesView.toggleLikeBtn(true)
        // Add like to the UI list
        likesView.renderLike(newLike);

    // user has liked the Current recipe
    }else {
        // Remove like from the state
        state.likes.deleteLike(currentId)
        // toggle the like button
        likesView.toggleLikeBtn(false)
        // Remove like from the UI list

        likesView.deleteLike(currentId)
        console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

// Restore liked Recipes on page load

window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore Likes
    state.likes.readStorage();

    // Toggle Likes menu buttons
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

elements.recipe.addEventListener('click', e => {
    
    console.log(e.target)
    
        if(e.target.matches('.btn-decrease *')) {  // the * in this case means any child child elements of btn.decrease class
            // decrease btn is clicked:

            if(state.recipe.servings > 1) {
            console.log("hello")
                state.recipe.updateServings('dec');
                recipeView.updadeServingsIngredients(state.recipe)
            }
        } else if (e.target.matches('.btn-increase *')) {  
        // increase btn is clicked:
            state.recipe.updateServings('inc');
            recipeView.updadeServingsIngredients(state.recipe)
        } else if (e.target.matches('.recipe__btn-add *')){
            // Add ingredients to the shopping list
            controlList();
        } else if (e.target.matches(".recipe__love *")) {
            // Like controller
            controlLike();
        }
    // console.log(state.recipe)
});