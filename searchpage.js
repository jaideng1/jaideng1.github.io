
var searchbar = document.getElementById("searchbar");
var searchbarResults = document.getElementById("searchresults");

searchbar.addEventListener('input', searchBarUpdate);
//searchbar.addEventListener('keyup', goToSearchTab);
searchbar.addEventListener('click', onSearchbarClick);
searchbar.addEventListener('mouseenter', onMouseOverSearchbar);
searchbar.addEventListener('mouseleave', onMouseLeaveSearchbar);
//document.body.addEventListener('click', onBodyClick);

var hasBeenBigger = false;

function searchBarUpdate(e) {
  checkElements(searchbar.value.toLowerCase())
}


var searchTerms = [];

function setUpSearchTerms() {
  for (let i = 0; i < projects.length; i++) {
    searchTerms.push(projects[i]);
  }
}

setUpSearchTerms();

function checkElements(search) {
  if (search.length > 0) {
    var type = document.getElementById("search-type").value.toLowerCase();
    let results = [];
    for (let i = 0; i < searchTerms.length; i++) {
      let keywords = search.toLowerCase().split(" ");
      for (let j = 0; j < keywords.length; j++) {
        if (keywords[j].length < 1) {
          continue;
        }
        if (type == "keywords") {
            if (searchTerms[i].title.toLowerCase().includes(keywords[j])) {
              results.push(searchTerms[i]);
              break;
            }
        } else if (type == "tags") {
            if (searchTerms[i].tags.join(" ").toLowerCase().includes(keywords[j])) {
              results.push(searchTerms[i]);
              break;
            }
        } else if (type == "description") {
            if (searchTerms[i].description.toLowerCase().includes(keywords[j])) {
              results.push(searchTerms[i]);
              break;
            }
        }
        
      }

    }
    let htmlResults = "";
    for (let k = 0; k < results.length; k += 2) {
      //results[k]
      htmlResults += '<div class="row align-items-center d-flex project-row">';
      //if (k > results.length) {
        htmlResults +=     '<div class="col-sm-6 inverse-project hidden-project">';
        try {
          htmlResults +=       '<h3><a href="' + results[k].link + '" target="_blank">' + results[k].title + '</a></h3>';
          htmlResults +=       '<p>' + results[k].description + '</p>';
          htmlResults +=       '<p>Tags: ' + results[k].tags.join(", ") + '</p>';
        } catch(e) {}
        htmlResults +=     '</div>';
      //}
      //console.log((k + 1) + " - " + results.length)
      //if (k + 1 > results.length) {
        htmlResults +=     '<div class="col-sm-6 inverse-project hidden-project">';
        try {
          htmlResults +=       '<h3><a href="' + results[k + 1].link + '" target="_blank">' + results[k + 1].title + '</a></h3>';
          htmlResults +=       '<p>' + results[k + 1].description + '</p>';
          htmlResults +=       '<p>Tags: ' + results[k + 1].tags.join(", ") + '</p>';
        } catch(e) {}
      
        htmlResults +=     '</div>';
      //}
      htmlResults +=   '</div>';
    }
    if (results.length == 0) {
      htmlResults += "<div><span><i>No Results Found...</i></span></div>"
    }
    searchbarResults.innerHTML = htmlResults;
    let hidden = document.getElementsByClassName("hidden-project");
    for (let n = 0; n < hidden.length; n++) {
      let m = hidden[n];
      setTimeout(function() {
        m.classList.remove("hidden-project");
        m.classList.add("shown-project");
      }, 75 * n)
      
    }
  } else {
    let results = projects;
    let htmlResults = "";
    for (let k = 0; k < results.length; k += 2) {
      //results[k]
      htmlResults += '<div class="row align-items-center d-flex project-row">';
      //if (k > results.length) {
        htmlResults +=     '<div class="col-sm-6 inverse-project hidden-project">';
        try {
          htmlResults +=       '<h3><a href="' + results[k].link + '" target="_blank">' + results[k].title + '</a></h3>';
          htmlResults +=       '<p>' + results[k].description + '</p>';
          htmlResults +=       '<p>Tags: ' + results[k].tags.join(", ") + '</p>';
        } catch(e) {}
        htmlResults +=     '</div>';
      //}
      //console.log((k + 1) + " - " + results.length)
      //if (k + 1 > results.length) {
        htmlResults +=     '<div class="col-sm-6 inverse-project hidden-project">';
        try {
          htmlResults +=       '<h3><a href="' + results[k + 1].link + '" target="_blank">' + results[k + 1].title + '</a></h3>';
          htmlResults +=       '<p>' + results[k + 1].description + '</p>';
          htmlResults +=       '<p>Tags: ' + results[k + 1].tags.join(", ") + '</p>';
        } catch(e) {}
      
        htmlResults +=     '</div>';
      //}
      htmlResults +=   '</div>';
    }
    searchbarResults.innerHTML = htmlResults;
    
    let hidden = document.getElementsByClassName("hidden-project");
    for (let n = 0; n < hidden.length; n++) {
      let m = hidden[n];
      setTimeout(function() {
        m.classList.remove("hidden-project");
        m.classList.add("shown-project");
      }, 75 * n)
      
    }
  }
}

// function goToSearchTab(e) {
//   if (e.keyCode === 13) {
//     document.location.href = "/search.html";
//   }
// }

let overSearchbar = false;
let searchbarActive = false;

function onMouseOverSearchbar(e) {
  overSearchbar = true;
}

function onMouseLeaveSearchbar(e) {
  overSearchbar = false;
}

function onSearchbarClick(e) {
  let search = searchbar.value;
  checkElements(search);
}

// function oncchTermClick(searchTerm) {
//   for (let prjct of projects) {
//     if (prjct.title == searchTerm) {
//       document.location.href = prjct.link
//     }
//   }
// }

// function onBodyClick(e) {
//   try {
//     if (!overSearchbar) {
//       searchbarResults.innerHTML = "";
//     }
//   } catch (ignored) {}
  
// }

checkElements("");
