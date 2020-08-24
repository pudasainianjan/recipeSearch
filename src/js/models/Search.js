//importing package axios --> axios is like fetch but also support old browsers
import axios from 'axios';      //just speecify name of package


export default class Search{    //data is query and seearch results
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try{
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const key = '59a7d41efc19e0fd6ebfd9c38e6fb99c';
            const appId = 'a538e228';
            const res = await axios(`${proxy}https://api.edamam.com/search?q=${this.query}&app_id=${appId}&app_key=${key}`)
            this.result = res.data.hits;
            // console.log(this.result);
        }
        catch(err){
            alert('error in fetching',err);
            console.error(err);
        }
    }
}





