const storage = browser.storage.sync;

const btnClearStorage = document.getElementById('btn-clear-storage');

btnClearStorage.onclick = e => {
    storage.clear();
}
