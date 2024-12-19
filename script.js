import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSetting = {
  databaseURL:
    "https://endorsement-app-5aa3a-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const endorsementInDB = ref(database, "endorsements");

// Selecting the Elements
const buttonEl = document.getElementById("button-el");
const endorsementEl = document.getElementById("endorsement-el");
const endorsementsListEl = document.getElementById("endorsements-list");

buttonEl.addEventListener("click", () => {
  let textContent = endorsementEl.value.trim();
  if (textContent === "") {
    alert("Text content is Empty !");
    return;
  }
  push(endorsementInDB, textContent);
  clearTextArea();
});

onValue(endorsementInDB, function (snapshot) {
  let snapshotExits = snapshot.exists();
  if (snapshotExits) {
    let endorsementArray = Object.entries(snapshot.val());
    clearEndorseListEl();
    for (let i = 0; i < endorsementArray.length; i++) {
      const endorsement = endorsementArray[i];

      appendToendorsementsListEl(endorsement);
    }
  } else {
    endorsementsListEl.innerHTML = `
<lord-icon
    src="https://cdn.lordicon.com/skkahier.json"
    trigger="loop"
    colors="primary:#545454"
    style="width:70px;height:70px;cursor: pointer;margin-top:80px">
</lord-icon>`;
  }
});

function clearTextArea() {
  endorsementEl.value = " ";
}

function clearEndorseListEl() {
  endorsementsListEl.innerHTML = "";
}

function appendToendorsementsListEl(item) {
  let endorsementId = item[0];
  let endorsementValue = item[1];
  let newList = document.createElement("li");
  newList.textContent = endorsementValue;
  endorsementsListEl.append(newList);

  newList.addEventListener("dblclick", () => {
    let endorsementIdRef = ref(database, `endorsements/${endorsementId}`);
    remove(endorsementIdRef);
  });
}
