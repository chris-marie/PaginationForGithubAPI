document.addEventListener('DOMContentLoaded',function() {
    console.log('running paginated.js');

    // LISTEN FOR USER INPUT
    document.querySelector('#query').addEventListener('change',function () {
        console.log('USER ENTERED SEARCH: ', this.value);
        searchForThisRepository(this.value);
    });

    //addClickToNavi();

});


function addClickToNavi() {
    var navis = document.getElementsByClassName('naviAnchors');   // navis is a live HTMLCollection ---> NODELIST, not ARRAY!
    if (navis !== null) {
        for (var i = 0, len = navis.length; i < len; i++) {
            var anchor = navis[i];
            console.log(anchor);
            var page = anchor.innerHTML;
            var newQueryURL = anchor.href;
            console.log('ADDING EVENT LISTENER FOR: ',page);
            anchor.addEventListener('click', turnThePage(page,newQueryURL));
        }
    } else {
        console.log('navis are null! ',navis);
    }
}

function turnThePage (page, queryUrl){
    console.log('USER CLICKED: ', page);
    console.log('making a new query for: ', queryUrl);
    var xhr = new XMLHttpRequest();
    xhr.open('GET',queryUrl);
    xhr.addEventListener('readystatechange', function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
            console.log('XHR: ', xhr);
            createPageLinks(xhr);
            var objJSON = parse(xhr.responseText);
            // todo: DO I NEED TO ERASE the previous search results
            console.log('showing search resuls for new page');
            showSearchResults(objJSON);
        }
    });

}



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
        anchor.className = 'naviAnchors';
        anchor.innerHTML = prop;                             // next, last, previous, first
        var anchorId = prop + 'anchor';
        div.appendChild(anchor);
    }

   // addClickToNavi();

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



function showSearchResults (obj) {
    // CREATE OBJECT FOR obj.items TO DISPLAY THE items.full_name
    var results = document.querySelector('#results')

    for (var i = 0, len = obj.items.length; i < len; i++) {
        var item = obj.items[i];
        var owner = {};
        var li = document.createElement('li');

        var divFullName = document.createElement('div');
        divFullName.className = 'divFullName';
        var divDescription = document.createElement('div');
        divDescription.className = 'divDescription';
        var divCloneURL = document.createElement('div');
        divCloneURL.className = 'divCloneURL';
        var divHtmlURL = document.createElement('div');
        divHtmlURL.className = 'divHtmlURL';
        var divOwnerLogin = document.createElement('div');
        divOwnerLogin.className = 'divOwnerLogin';

        var fullName = item.full_name;                 //        console.log(fullName);
        var description = item.description;
        var cloneURL = item.clone_url;
        var htmlURL = item.html_url;
        owner = item.owner;
        var ownerLogin = owner['login'];


        console.log('FULLNAME: ',fullName,', OWNERLOGIN: ',ownerLogin,', DESCRIPTION: ',description,', CLONEURL: ',cloneURL);

        divFullName.innerHTML = fullName;
        divDescription.innerHTML = description;
        divCloneURL.innerHTML = cloneURL;
        divHtmlURL.innerHTML = htmlURL;
        divOwnerLogin.innerHTML = ownerLogin;

        divDescription.style.display = 'none';
        divCloneURL.style.display = 'none';
        divHtmlURL.style.display = 'none';
        divOwnerLogin.style.display = 'none';

        li.appendChild(divFullName);
        li.appendChild(divDescription);   // these are initially invisibly
        li.appendChild(divCloneURL);
        li.appendChild(divHtmlURL);
        li.appendChild(divOwnerLogin);  // todo: add check boxes to be able to display these things

        results.appendChild(li);
    }
}