class MovieListItem {
    constructor({id, name, age, imageUrl, schedule}) {
        this.id = id;               // string
        this.name = name;           // string
        this.age = age;             // string            
        this.imageUrl = imageUrl;   // string
        this.schedule = schedule;   // string[]
    }
}

module.exports = MovieListItem;