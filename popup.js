// let linkArray = [];
// const saveTabs = () => {
//   chrome.tabs.query({ currentWindow: true }, function (tabs) {
//     console.log(tabs);
//     let url = tabs.map((tab) => tab.url);
//     linkArray = [...url];
//     const save = document.createElement('div');
//     const p = document.createElement('ol');
//     url.forEach((urls) => {
//       let li = document.createElement('li');
//       let text = document.createTextNode(urls);
//       li.innerText = text.wholeText;
//       p.appendChild(li);
//     });
//     save.setAttribute('class', 'saved_tabs');
//     save.appendChild(p);

//     const restore = document.createElement('button');
//     restore.appendChild(document.createTextNode('restore'));
//     restore.setAttribute('class', 'restore');

//     const tab1 = document.createElement('div');
//     tab1.appendChild(restore);
//     tab1.appendChild(save);
//     document.querySelector('#tabs').appendChild(tab1);
//     // document.querySelector('#tabs').appendChild(save);
//   });
// };

// document.querySelector('#save').addEventListener('click', saveTabs);

// document.body.onclick = function (e) {
//   e = window.event ? event.srcElement : e.target;
//   if (e.className && e.className.indexOf('restore') != -1) {
//     for (var i = 0; i < linkArray.length; i++) {
//       // will open each link in the current window
//       chrome.tabs.create({
//         url: linkArray[i],
//       });
//     }
//   }
// };

//////////////////////////////////////////////////////////////////////////

/////////////////
const saveTabs = () => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    let urls = tabs.map((tab) => tab.url);
    const id = new Date().getTime().toString();
    saveToLocalStorage(urls, id);
    createNode(urls, id);
  });
};
////////////
const createNode = (urls, id) => {
  const tabsCollection = document.createElement('div');
  tabsCollection.setAttribute('class', 'saved_tabs');

  const restore = document.createElement('i');
  // restore.appendChild(document.createTextNode('restore'));
  restore.setAttribute('id', id);
  restore.setAttribute('class', 'restore_btn far fa-window-restore');

  const del = document.createElement('i');
  // del.appendChild(document.createTextNode('delete'));
  del.setAttribute('id', id);
  del.setAttribute('class', 'delete_btn far fa-trash-alt');

  const actionBtn = document.createElement('div');
  actionBtn.setAttribute('class', 'action_btns_saved');
  actionBtn.appendChild(restore);
  actionBtn.appendChild(del);

  const savedUrl = document.createElement('div');
  savedUrl.setAttribute('class', 'saved_urls');

  urls.forEach((url) => {
    // let li = document.createElement('li');
    // let text = document.createTextNode(url);
    // li.innerText = text.wholeText;
    let img = document.createElement('img');
    img.setAttribute('src', `chrome://favicon/${url}`);
    // li.appendChild(img);
    // ol.appendChild(li);
    savedUrl.appendChild(img);
  });

  tabsCollection.appendChild(actionBtn);
  tabsCollection.appendChild(savedUrl);
  document.querySelector('#tabs').appendChild(tabsCollection);
};
/////////////////
const saveToLocalStorage = (urls, id) => {
  let tabs = JSON.parse(localStorage.getItem('tabs'));
  if (tabs === null) {
    tabs = [{ id, urls }];
  } else {
    tabs = [...tabs, { id, urls }];
  }
  localStorage.setItem('tabs', JSON.stringify(tabs));
};
///////////////
const findFromLocalStorage = (id) => {
  const tabs = JSON.parse(localStorage.getItem('tabs'));
  return tabs.find((tab) => tab.id === id).urls;
};
////////////
const restoreTabForUser = (event) => {
  const urls = findFromLocalStorage(event.target.id);
  urls.forEach((url) => {
    chrome.tabs.create({
      url,
    });
  });
};
////////
const restoreSavedTabsFromStorage = () => {
  const tabs = JSON.parse(localStorage.getItem('tabs'));
  tabs && tabs.forEach((tab) => createNode(tab.urls, tab.id));
};

//////////
const deleteAllSavedTabs = () => {
  localStorage.removeItem('tabs');
  document.querySelector('#tabs').innerHTML = '';
};
//////////////

const deleteSavedTabById = (event) => {
  let tabs = JSON.parse(localStorage.getItem('tabs'));
  tabs = tabs && tabs.filter((tab) => tab.id !== event.target.id);
  localStorage.setItem('tabs', JSON.stringify(tabs));
  document.querySelector('#tabs').innerHTML = '';
  restoreSavedTabsFromStorage();
  renderDom();
};

//////
const renderDom = () => {
  const savedTabsRestore = document.querySelectorAll('.restore_btn');
  savedTabsRestore &&
    savedTabsRestore.forEach((tab) => {
      tab.addEventListener('click', restoreTabForUser);
    });

  const savedTabsDelete = document.querySelectorAll('.delete_btn');
  savedTabsDelete &&
    savedTabsDelete.forEach((tab) => {
      tab.addEventListener('click', deleteSavedTabById);
    });
};
///////////
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelector('#save').addEventListener('click', saveTabs);
  document
    .querySelector('#delete')
    .addEventListener('click', deleteAllSavedTabs);
  restoreSavedTabsFromStorage();
  renderDom();
});

document.addEventListener('DOMNodeInserted', renderDom);

//////////////////////////////////////////////////////////////////////////////////////////
