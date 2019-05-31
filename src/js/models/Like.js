export default class Likes {
    constructor() {
        this.likes = []
    }
    addLike(id, title, author, image) {
        const like = {
            id, title, author, image
        }
        this.likes.push(like)
        return like
    }
    deleteItem(id){
        const index=this.likes.findIndex(el=>el.id===id)
        this.items.splice(index,1)
    }
    isLiked(id){
        return this.likes.findIndex(el=>el.id===id) !==-1;

    }

    getNumLikes(){
        return this.likes.length
    }
}