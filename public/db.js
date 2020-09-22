const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

let DB;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    DB = target.result;
    DB.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({
    target
}) => {
    DB = target.result;
    console.log(target.result);
};

request.onerror = ({ target }) => console.log("Woops" + target.errorCode);

function saveRecord(record) {
    const transaction = DB.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record)
};

function checkDataBase() {
    const transaction = DB.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll()

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.results),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                return response.json()
            }).then(() => {
                const transaction = DB.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            });
        }
    };
}

window.addEventListener("online", checkDataBase)