document.addEventListener('DOMContentLoaded',function() {
    console.log('running paginated.js');

    // LISTEN FOR USER INPUT
    document.querySelector('#query').addEventListener('change',function () {
        console.log('USER ENTERED SEARCH: ', this.value);
        searchForThisRepository(this.value);
    });
});

function searchForThisRepository (searchTerm) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/search/repositories?q=' + searchTerm); // todo: add ability to search code, users ect...
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            createPageLinks(xhr);
            var objJSON = JSON.parse(xhr.responseText);
            showSearchResults(objJSON);
        }
    });
    console.log('SENDING XHR REQUEST');
    xhr.send();
}

function createPageLinks (xhr) {
    // todo: change to accept PREVIOUS AND FIRST
    var link = extractLinkObject(xhr.getAllResponseHeaders());  // GET BACK AN OBJECT WITH LINKS TO NEXT AND LAST PAGE
    var div = document.querySelector('.navigation');

   div.innerHTML = ' ';
    for (var prop in link) {
        console.log('LINK[PROP=',prop,']: ', link[prop]);
        var anchor = document.createElement('a');
        anchor.href = link[prop];                            // http://api.github......
        anchor.innerHTML = prop;                             // next, last, previous, first
        var anchorId = prop + 'anchor';
        div.appendChild(anchor);
    }
}

function showSearchResults (obj) {
    // CREATE OBJECT FOR obj.items TO DISPLAY THE items.full_name
    var results = document.querySelector('#results')

    for (var i = 0, len = obj.items.length; i < len; i++) {
        var fullName = obj.items[i].full_name;
        console.log(fullName);

        var div = document.createElement('div');
        div.innerHTML = fullName;

        results.appendChild(div);
    }


}

function extractLinkObject (str) {
    // todo: change to cut out previous and first
    var linkObject = {};
    var allHeaders = str.trim().split('\n');        // MAKE ONE LINE STRING
    var linkHeader = allHeaders[allHeaders.length - 1];   // TAKE ONLY LAST STRING WITH Link:
    linkHeader = linkHeader.slice(5);              // TAKE EVERYTHING AFTER 'Link:' at index 5
    var links = linkHeader.split(',');

    for (var i = 0, len = links.length; i < len; i++) {
        console.log('LINKS[',i,']',links[i]);
        var data = links[i].split('"');              // split each link pair by bunny ears
        console.log('DATA[',i,']',data);

        var key = data[1];
        var linkValue = data[0].trim().slice(1, -7);
        console.log('KEY: ',key,', LINKVALUE: ',linkValue);

        linkObject[key] = linkValue;
    }
    return linkObject;
}