// Global app controller
import Search from './models/Search'
import { elements, renderLoader, clearLoader } from './views/base'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import Recipe from './models/Recipes';
import List from './models/List';
import Likes from './models/Like';


const state = {

}
const controlSearch = async () => {
    const query = searchView.getInput();
    if (query) {
        state.search = new Search(query)
        //3 prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //Search for the recipes
        try {
            await state.search.getResults();//we need the result before execute this function, so we have to asynce await

            //render in the UI
            clearLoader();
            //parseIngredients();
            searchView.renderResults(state.search.result)

        } catch (err) {
            alert("Error")
            console.log(err);

        }
    }

}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();


})
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        searchView.clearResults();
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.renderResults(state.search.result, goToPage)

        console.log(goToPage);

    }
})
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        renderLoader(elements.recipe)
        if (state.search) searchView.highlightSelected(id)
        state.recipe = new Recipe(id)
        try {
            await state.recipe.getRecipe();

            state.recipe.calcTime();
            state.recipe.calcServing();
            state.recipe.parseIngredients();
            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipe(state.recipe)

        } catch (err) {
            console.log(err);

        }


    }

}

['hashchange', 'load'].forEach(el => window.addEventListener(el, controlRecipe))

const controlList = () => {
    if (!state.list) {
        state.list = new List();
    }
    //add ingredient to the user interface
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item)
    })

}
//Delte and update list item
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete,.shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val=parseFloat(e.target.value,10)
        state.list.updateCount(id,val)
    }
})
const controlLike = () => {
    if (!state.like) {
        state.like = new Likes();
    }
    const currentID = state.recipe.id;
    //add like
    if(!state.like.isLiked(currentID)){
        //Add like to state
        const newLike=state.like.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img1
        )
        console.log(newLike);
        
        //toggle like
    }else{
        state.likes.deleteLike(currentID)
    }

}




elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
            console.log(state.recipe.servings);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
        console.log(state.recipe.servings);
    } else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')) {
        controlList();
        console.log('12');
    }else if(e.target.matches('.recipe__love,.recipe__love *')){
        controlLike();
    }
})

window.l = new List();

