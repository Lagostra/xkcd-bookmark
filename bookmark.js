const storage = browser.storage.sync;
const COUNT_LIMIT = 5;

var comicNav = document.getElementsByClassName("comicNav")[0];
var comicNav2 = document.getElementsByClassName("comicNav")[1];
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

function findFirstUnread(readStrips) {
    for (let i = 1; i < 10000; i++) {
        if (!readStrips.includes(i)) {
            return i;
        }
    }

    return '';
}

function createButton(link, text) {
    let buttonListItem = document.createElement("li");
    let buttonLink = document.createElement("a");
    let linkText = document.createTextNode(text);

    buttonLink.appendChild(linkText);
    buttonLink.href = link;
    buttonListItem.appendChild(buttonLink);

    return buttonListItem;
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
    var bookmarkButton = createButton('/' + bookmarkIndex, '< Bookmark');
    var bookmarkButton2 = createButton('/' + bookmarkIndex, '< Bookmark');

    var firstUnreadIndex = findFirstUnread(readStrips);
    var firstUnreadButton = createButton('/' + firstUnreadIndex, '< First unread');
    var firstUnreadButton2 = createButton('/' + firstUnreadIndex, '< First unread');

    comicNav.insertBefore(firstUnreadButton, comicNav.children[2]);
    comicNav2.insertBefore(firstUnreadButton2, comicNav2.children[2]);

    comicNav.insertBefore(bookmarkButton, comicNav.children[3]);
    comicNav2.insertBefore(bookmarkButton2, comicNav2.children[3]);
});