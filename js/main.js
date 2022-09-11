var selectinformation = movies.slice(0, 100);
var elList = document.querySelector("#bootstrap__movies-list");
var elTemplate = document.querySelector("#bootstrap__movies-template").content;
var elForm = document.querySelector("#bootstrap__movies-search-form");
var elInputsearch = document.querySelector("#bootstrap__movies-search-form");
var elInputsearchrating = document.querySelector("#bootstrap__movies-search-input-rating");
var elWrapper = document.querySelector(".bootstrap__movies-item");
var elTitle = document.querySelector("#bootstrap__movies-results-amout");
var elCategorySelect = document.querySelector("#bootstrap__movies-search-select");
var elSort = document.querySelector("#bootstrap__movies-search-select2")


var normalizedMovieList = selectinformation.map(function (a, b) {
    return {
        id: b + 1,
        title: a.Title.toString(),
        year: a.movie_year,
        youtubeLink: `https://www.youtube.com/watch?v=${a.ytid}`,
        rating: a.imdb_rating,
        imageLink: `https://i.ytimg.com/vi/${a.ytid}/mqdefault.jpg`,
        categories: a.Categories.toString(),
    }
})

console.log(elWrapper);
console.log(normalizedMovieList);

function generateCategories(movieArray) {
    let categoryList = []
    
    movieArray.forEach(function(item) {
        let l = item.categories;
        var splittedItem = l.split("|");
        splittedItem.forEach(function(item) {
            if (!categoryList.includes(item)) {
                categoryList.push(item)
            }
        })
    })
    categoryList.sort()
    
    let categoryFragment = document.createDocumentFragment()
    
    categoryList.forEach(function (item) {
        let categoryOption = document.createElement("option");
        categoryOption.value = item
        categoryOption.textContent = item
        categoryFragment.appendChild(categoryOption)
    })
    
    elCategorySelect.appendChild(categoryFragment)
    
    console.log(elCategorySelect);
    console.log(categoryList);
}
generateCategories(normalizedMovieList);

elForm.addEventListener("click", function(evt) {
    evt.preventDefault()
    var selectOption = elCategorySelect.value
    var categorisedMovies = []
    if (selectOption === "All") {
        categorisedMovies = normalizedMovieList
    }else {
        categorisedMovies = normalizedMovieList.filter(function (item) {
            return item.categories.split("|").includes(selectOption) 
        })
    }
    
    renderMovies(categorisedMovies, elWrapper);
    
})

function renderMovies(moviesArray, place) {
    place.innerHTML = null;
    let elFragment = document.createDocumentFragment();

    moviesArray.forEach(movie => {
        let templateDiv = elTemplate.cloneNode(true);
        
        templateDiv.querySelector(".bootstrap__movies-film-img").src = movie.imageLink;
        templateDiv.querySelector(".bootstrap__movies-film-name").textContent = movie.title;
        templateDiv.querySelector(".bootstrap__movies-rating-number").textContent = movie.rating;
        templateDiv.querySelector(".bootstrap__movies-data-time").textContent = movie.year;
        templateDiv.querySelector(".bootstrap__movies-watch").href = movie.youtubeLink;

        elFragment.appendChild(templateDiv)
    })
    place.appendChild(elFragment);
    elTitle.textContent = moviesArray.length;
}
renderMovies(normalizedMovieList, elWrapper);

function Moviesname(evt) {

    var searchInput = evt.trim().toLowerCase()

    let searchedMovies = normalizedMovieList.filter(function(item) {
        return item.title.toLowerCase().includes(searchInput)
    })

    console.log(searchedMovies);


    renderMovies(searchedMovies , elWrapper);
}

var findMovies = function (movie_title, minRating, genre) {
    
    return normalizedMovieList.filter(function (movie) {
        var doesMatchCategory =
        genre === 'All' || movie.categories.split("|").includes(genre);
        
        return movie.title.match(movie_title) && movie.rating >= minRating && doesMatchCategory;
    });
};

elForm.addEventListener("input", function(evt) {
    evt.preventDefault()

    let searchInput = elInputsearch.value;
    let ratingInput = elInputsearchrating.value.trim()
    let selectOption = elCategorySelect.value
    let sortingType = elSort.value
    
    let pattern = new RegExp(searchInput, "gi")
    let resultArray = findMovies(pattern, ratingInput, selectOption)

    if (sortingType === "high") {
        resultArray.sort((b, a) => a.rating - b.rating)
    }

    if (sortingType === "low") {
        resultArray.sort((a, b) => a.rating - b.rating)
    }

    renderMovies(resultArray , elWrapper);
})
