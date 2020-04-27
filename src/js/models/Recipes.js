
export default class Recipe {
    constructor(id){
        this.id = id;
    }
    async getRecipe(){
        // const proxy = "this does not use proxy";
        // const key = "this API does not requeire Key"

        try {
            const res = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
                                    
            const fullRecipe = await res.json().then(result => {
                
                this.title       = result.recipe.title;
                this.author      = result.recipe.publisher;
                this.img         = result.recipe.image_url;
                this.url         = result.recipe.source_url;
                this.ingredients = result.recipe.ingredients;

                return result
            });

            return fullRecipe
        } catch (error) {
            console.log("Error", error);
        }
    }
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;  
    }
    
    parseIngredients(){
        const unitsLong = ["tablespoons", "tablespoon", "once", "ounces", "teaspoon", "teaspoons", "cup", "cups", "pounds"];
        const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "cup", "pound"];
        const units = [...unitsShort, "kg", "g"];

        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);  
            });
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            const arrIngredients = ingredient.split(" ");
            const unitIndex = arrIngredients.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1){
                // there is a unit
                // Ex. 4 1/2 cups , arrCount is [4 1/2] --> eval ("4 + 1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]

                const arrCount = arrIngredients.slice(0, unitIndex);

                let count;
                if(arrCount.lenght === 1){
                    count = eval(arrIngredients[0].replace('-', '+'));
                } else {
                    count = eval(arrIngredients.slice(0, unitIndex).join("+"))
                }

                objIng = {
                    count,
                    unit: arrIngredients[unitIndex],
                    ingredient: arrIngredients.slice(unitIndex + 1).join(' ')
                };

            }else if(parseInt(arrIngredients[0], 10)){
                // there is no Unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIngredients[0], 10),
                    unit: '',
                    ingredient: arrIngredients.slice(1).join(' ')
                }

            }else if(unitIndex === -1){
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: arrIngredients.slice(1).join(' ')
                }
            }

            return objIng
        });
        this.ingredients = newIngredients;   
    }
    updateServings (type){
        // Servings:
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        // Ingredients:
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        })
        this.servings = newServings;
    }
}

export const getHash = () => {
    const test = Math.floor(window.location.hash.replace('#', ''));
    return test
}