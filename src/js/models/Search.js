

export default class Search {
    constructor(query){
        this.query = query;
    }
    async getResults(){
        // const proxy = "this does not use proxy";
        // const key = "this API does not requeire Key"

        try {
            const res = await fetch(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
                                    
            const result = res.json();
            // console.log(result);
            return result
            
        } catch (error) {
            console.log("Error", error);
        }
    }
}