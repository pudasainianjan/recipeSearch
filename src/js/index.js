import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './view/searchView';  //we need all
import * as recipeView from './view/recipeView';  
import * as listView from './view/listView';  
import * as likesView from './view/likesView';  
import { elements, renderLoader, clearLoader } from './view/base';


/*Global state of the app 
 * -Search Object--all search data
 *- Current Recipe object 
 *- shopping list object
 *- liked recipe
*/ 

const state ={};    //each timee we reeload our app state will be empty or like this
// window.state = state;  //*FOR TESTING ONLY

//*SEARCH CONTROLLER */
const controlSearch = async () =>{      //async to use await
    //1 get the query from viw
    const query = searchView.getInput();   
    // const query = 'pizza';   //*testing only
    state.query = query;



    if(query){
        //2 newe search object and add to state
        state.search = new Search(query);

        //3 prepare UI for results (eeeg:loading sign)
        searchView.clearImput();
        searchView.clearResults();
        renderLoader(elements.searchRes);


        try{
            //4 search for reciepes
            await state.search.getResults();

            //5 render results on UI
            clearLoader();   
            searchView.renderResults(state.search.result);
            
            // createRecipe(state.search.result);
            // console.log('type of ',typeof(state.search.result));  //object
        }
        catch(err){
            alert('something went wrong with the search...');
            clearLoader();
        }
        

    }
};

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});

//* TESTING just for developer testing otherwise remove this
// window.addEventListener('load', e=>{
//     e.preventDefault();
//     controlSearch();
// });

//i used event delegation because pagination buttons are not yet there wheen the page is loaded 
//i found one problem i.e when clicked inside button target is sometimes span or icon but it should be button
//so i found closeest method to solve this issue
elements.searchResPages.addEventListener('click',e=>{
    const btn = e.target.closest('.btn-inline'); //now clickeed in svg will give button not svg so we can do something
    // console.log(btn);
    if(btn){
        const goTopage = parseInt(btn.dataset.goto,10);      //dataset stores what is in data attribute  //10 is base 10 system 0-9
        // console.log(goTopage);
        searchView.clearResults()
        searchView.renderResults(state.search.result,goTopage);
    }
});


//*RECIPE CONTROLLER
    

// function getIndex(){
    
//     elements.searchResultList.addEventListener('click',e=>{
//       let index;
//       const list = e.target.closest('.results__link'); //now clickeed in svg will give button not svg so we can do something
//       // console.log(btn);
//       if(list){
//            index = parseInt(list.getAttribute("id"));      //dataset stores what is in data attribute  //10 is base 10 system 0-9
//            console.log(parseInt(list.getAttribute("id")));
//            controlRecipe(index);
//       }
      
//      });
     
//   }
let index; 
  const controlRecipe = () =>{
    //*test
      //get the Hash from the url
    //   let foodLabel = window.location.hash.replace('#','');       //hash inside lment href attribute
      let foodLabel = window.location.hash.replace(/%20/g,' '); 
      foodLabel = foodLabel.split('-resultIndex');
      index = parseInt(foodLabel[1],10);
      //console.log(foodLabel);  //this code is just to show that we can get data on hash change and act on it...href="#somethingLink"

      if(foodLabel && state.search){
          //prepare UI for changes
          recipeView.clearRecipe()
          renderLoader(elements.recipe);

          //highlight selecteed search tile
          if(state.search){
          searchView.highLightedSelected(index);
          }

          //get the index of result form the UI
            //this is outside of function

          //create new recipe object and parse ingridents
        //  console.log(index);
         state.recipe = new Recipe(index,state.search.result);

          //*Testing 
        //   window.r = state.recipe;  //*exposing to window jst for testing


          try{
                //get the recipe data
          state.recipe.getRecipe();
          state.recipe.parseIngredients();

          //Calculate servings and time
          state.recipe.calcTime();
          state.recipe.calcServings();

          //render the recipe
            clearLoader();
            const isLikedID = state.query+'--'+index;
            recipeView.renderRecipe(
              state.recipe,
              state.likes.isLiked(isLikedID)    //cannot read of undefined error comes if we do dont have created obj yet
              );
          }
          catch(err){
              console.error('error processing recipe',err.message);
          }
      }
      
  };



//   window.addEventListener('hashchange',controlRecipe);
//!when the page is reeeloaded we need hash to reset, so adding another listner
//   window.addEventListener('load',controlRecipe);

//todo both above call same methods, what abt adding same event listeneers
['hashchange','load'].forEach(event=> window.addEventListener(event,controlRecipe));

//****
  //*LIST CONtROLLER
//****

const controlList = () =>{
  //create a new list if there is none yet
  if(!state.List) state.List = new List();

  //Add each ingredients to list and UI
  state.recipe.ingredients.forEach(el=>{
    const item = state.List.addItem(el.count,el.unit,el.ingrident);
    listView.renderItem(item);
  });
}

//handle delete and update list item events
elements.shopping.addEventListener('click',e=>{
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // console.log('item id is ',id);
  //handle the delete button 
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    //delete from state
    try{
    if(state.list){ state.list.deleteItem(id); }
    }
    catch(err){
      alert(err);
    }

    //delete from ui
    listView.deleteItem(id);
  }
  //handle the count update
  // else if(e.target.matches('.shopping__count-value')){
  //   const val = parseFloat(e.target.value,10);
  //   state.list.updateCount(id,val);
  // }
});

//****
  //*LIKE CONtROLLER
//****
state.likes = new Likes();  //*TESTING

const controlLike = () =>{
  if(!state.likes) state.likes = new Likes();
  const currentID = state.query+'--'+index;
  //console.log(currentID);
  //user has not yet liked current reecipe
  if(!state.likes.isLiked(currentID)){  
    //add the like to the data
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    //toggle the like button
    likesView.toggleLikedBtn(true);

    //add like to the ui list
    try{
    likesView.renderLike(newLike);
    }
    catch(err){
      console.log(err);
    }
    console.log(state.likes);
  }
  //user has not yet liked current reecipe
  else{
    //remove like from the state
    state.likes.deleteLike(currentID);
    
    //toggle the like button
    likesView.toggleLikedBtn(false);

    //remove like form the ui list
    // likesView.deleteLike(currentID);

  }

 
};

//restore like recipes on page load 
window.addEventListener('load', ()=>{
  state.likes =  new Likes();

  //restore likes
  state.likes.readStorage();

  //toggle like  menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //render the existing likes
  state.likes.likes.forEach(like=>{
    likesView.renderLike(like)
  });
  

});


//handling recipe button clicks
elements.recipe.addEventListener('click',e=>{
  //matches method   //all el below aree not present at dom by time we load page
  if(e.target.matches('.btn-decrease,.btn-decrease *')){  //btn-decrease * means btn-decrease * any child of btn decreease because btn decrease also contains svgs inside
    //decrease btn is clicked
    if(state.recipe.servings > 1){
    state.recipe.updateServings('dec');
    //updating in ui
    recipeView.updateServingsIngridents(state.recipe);
    }
  } else if(e.target.matches('.btn-increase,.btn-increase *')){  
    //increase btn is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngridents(state.recipe);
  } else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){   //matchs takes css selector
    //add ingridents to shopping list
    controlList();
  }else if(e.target.matches('.recipe__love, .recipe__love *')){
    controlLike();
  }
  // console.log(state.recipe);
});







  









