import axios from 'axios';
import {crossOrigin,APIKey,APIKey1} from '../config'
export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
       
        try {
            const res = await axios(`${crossOrigin}https://www.food2fork.com/api/search?key=${APIKey1}&q=${this.query}`)
            this.result = res.data.recipes;
            if(this.result===null){
                alert("no recipe found")
            }
           // console.log('the result', this.result);

        }
        catch (error) {
            console.log('Error');

        }


    }


} 
