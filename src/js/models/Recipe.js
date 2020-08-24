

export default class Recipe{
    constructor(index,result){
        this.index = index;
        this.result = result;
    }

     getRecipe(){
        try{
            // console.log('from recipe class: ',this.result)
            this.title = this.result[this.index].recipe.label;
            this.author = this.result[this.index].recipe.source;
            this.img = this.result[this.index].recipe.image;
            this.url = this.result[this.index].recipe.url;
            this.ingredients = this.result[this.index].recipe.ingredientLines;    
        }
        catch(err){
            console.log(err);
            alert('something went wrong inside while getting recipe...:(');
        }
    }

    calcTime(){
        //wee just assume every 3 ingridents we need 15 min
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods*15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];  
        const units = [...unitShort,'kg','g']
        const newIngridents = this.ingredients.map(el=>{
            //1 uniform units
            let ingrident = el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingrident = ingrident.replace(unit,unitShort[i]);
            });

            //2 removee parenthesis like {} inside ingridents //!if theey exist
            ingrident = ingrident.replace(/ *\([^)]*\) */g, ' ');    //regular expreession for remove parenthesis

            //3) parse ingridents into count, unit and ingrident -->separate nums and text
            const arrIng = ingrident.split(' ');    //*whenever there is space, each word become new array
            const unitIndex = arrIng.findIndex(el2=>{ //el is already taken
                units.includes(el2);    //if this turns true findindex returns index
            });

            let objIng;
            if(unitIndex > -1){
                //theree is a unit
                const arrCount = arrIng.slice(0,unitIndex);  //until it found unit index so upto unit numbeers are counted  //eg: 4 1/2 cups, arrCount is [4,1/2]  //ex2 4 cups, arrCount = [4]
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-','+'));
                }
                else{
                    count =eval(arrIng.slice(0,unitIndex).join('+'));  //eg: 4 1/2 cups, arrCount is [4,1/2]  --> now eval will make it 4.5
                }
                objIng = {
                    count:count,
                    // count,
                    unit:arrIng[unitIndex],
                    ingrident:arrIng.slice(unitIndex+1).join(' ') //join back to string aftr unit

                }

            }
            else if(parseInt(arrIng[0],10)){  //if return NAN, coehercd to false
                //there is no unit but first eleement is a number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit:'',
                    ingrident:arrIng.slice(1).join(' ')  
                }
            } 
            else if(unitIndex == -1){
                //there is no unit and no num in first position
                objIng={
                    count:1,
                    unit:'',
                    // ingrident:ingrident is same as:
                    ingrident
                }
            }


            return objIng;           //will be saved in new array
        });
        this.ingredients = newIngridents;
    }

    updateServings(type){   //- for decreased or + for increaesed
        //servings
        const newServings = type === 'dec' ? this.servings-1: this.servings +1;

        //Ingridents
        this.ingredients.forEach(ing=>{     //updateds the servings and ingredients in data model
            // ing.count = ing.count *(newServings / this.servings);  //same below
            ing.count *= (newServings / this.servings);

        });

        this.servings = newServings;
    }
}