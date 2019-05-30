var comicNav = document.getElementsByClassName("comicNav")[0];

var bookmarkListItem = document.createElement("li");
var bookmarkLink = document.createElement("a");
var linkText = document.createTextNode("Go to bookmark");
bookmarkLink.appendChild(linkText);
bookmarkLink.href = "";
bookmarkListItem.appendChild(bookmarkLink);

comicNav.insertBefore(bookmarkListItem, comicNav.children[3]);