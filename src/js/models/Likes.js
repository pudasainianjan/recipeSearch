

export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id,title,author,img){
        const like = {id,title,author,img};
        this.likes.push(like);

        //persist the data in local storage
        this.persistData();

        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el=>el.id === id);
        this.likes.splice(index,1);

        //persist the data in local storage

    }

    isLiked(id){
        return this.likes.findIndex(el=> el.id === id) !== -1;  //if cant find id left side will be also -1  //so if not liked returns false
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes',JSON.stringify(this.likes))  //local storage needs string to store
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));  
        
        //restoring from the local storage
        if(storage) this.likes= storage;
    }
}