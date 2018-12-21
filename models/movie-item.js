class MovieItem {
    constructor(
        {
            id, 
            name, 
            imageUrl, 
            description, 
            todaDate, 
            halls, 
            age, 
            director, 
            releaseDate, 
            lang, 
            movieType, 
            duration, 
            country, 
            roles
        }
    ) {
        this.id = id;                     // string
        this.name = name;                 // string                          
        this.imageUrl = imageUrl;         // string  
        this.description = description;   // string  
        this.todaDate = todaDate;         // string
        this.halls = halls;               // {name: string, sessions: string[]}[]
        this.age = age;                   // string                  
        this.director = director;         // string
        this.releaseDate = releaseDate;   // string
        this.lang = lang;                 // string
        this.movieType = movieType;       // string
        this.duration = duration;         // string
        this.country = country;           // string
        this.roles = roles;               // string
    }
}

module.exports = MovieItem;