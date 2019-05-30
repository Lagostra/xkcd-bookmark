const storage = browser.storage.local;
const COUNT_LIMIT = 5;

var comicNav = document.getElementsByClassName("comicNav")[0];
var previousLink = comicNav.children[1].children[0];
var linkList = previousLink.href.split("/");
var previousComic = parseInt(linkList[linkList.length - 2]);

var currentComic = (window.location.pathname.endsWith("/1/")) ? 1 : previousComic + 1;
var onPermalink = window.location.pathname != "/";

function findBookmarkIndex(readStrips) {
    let count = 1;
    let last = -1;
    let chainStart = -1;

    for (let i = readStrips.length - 1; i >= 0; i--) {
        let current = readStrips[i];
        if (current == last - 1) {
            count++;
        } else {
            chainStart = current;
            count = 1;
        }
        
        if (count == COUNT_LIMIT || current == 1) {
            return chainStart;
        }
        last = current;

    }

    return 1;
}

storage.get("read_strips").then((result) => {
    if (result.hasOwnProperty("read_strips")) {
        readStrips = result["read_strips"];
    } else {
        readStrips = [];
        storage.set({
            "read_strips": readStrips
        });
    }

    if ((onPermalink || readStrips.includes(previousComic)) && !readStrips.includes(currentComic)) {
        // Set the current strip as read if we are on a permalink or have read the previous comic
        readStrips.push(currentComic);
        readStrips.sort((a, b) => a - b);

        storage.set({
            "read_strips": readStrips
        });
    }


    var bookmarkIndex = findBookmarkIndex(readStrips);    

    var bookmarkListItem = document.createElement("li");
    var bookmarkLink = document.createElement("a");
    var linkText = document.createTextNode("Go to bookmark");
    bookmarkLink.appendChild(linkText);
    bookmarkLink.href = "/" + bookmarkIndex;
    bookmarkListItem.appendChild(bookmarkLink);

    comicNav.insertBefore(bookmarkListItem, comicNav.children[3]);


});