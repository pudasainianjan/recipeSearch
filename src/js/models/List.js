import uniqid from 'uniqid';        //this creates unique identifier

export default class List{
    constructor(){
        this.items = [];    //new el is pushed here
    }

    addItem(count,unit,ingredient){
        const item = {
            id:uniqid(),        //this creates unique identifier
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){   //id of item we want to delete
        console.log(`id here ${id}`)
        const index = this.items.findIndex(el => {
            return el.id === id;
        });
        //eg: [2,4,8] splice(1,2) -->returns [4,8], original array is [2]         //!here (1,2)--> start index,how many els   //splice mutates Original array
        //eg: [2,4,8] slice(1,2) -->returns 4, original array is [2,4,8]       //!here (1,2)-->index start ,index end //if (1,1) it would return nothing   //splice mutates Original array
                                                                                //!because start at 1 and end at 1
        this.items.splice(index,1);  //if id(match) delete item         //splice deletes from original array
        
    }

    updateCount(id,newCount){
        this.items.find(el=>el.id === id).count = newCount;  //loop all el in item and set count       //return the arr el itself not index
    }
}