let storage;

function storageAvailable(type) {
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

let index;

function storageInit() {
  if (JSON.parse(fromStorage('index'))) {
    console.log('Storage already initiated');
  } else {
    index = [0];
    toStorage('index', JSON.stringify(index));
    console.log('Storage initiated');
  }
  return index;
}


function toStorage(item, value) {
  storageAvailable("localStorage") ? storage.setItem(item, value) : console.log("Storage availability error");
}

function fromStorage(item) {
  let result
  storageAvailable("localStorage") ? result = storage.getItem(item) : console.log("Storage availability error");
  return result;
}

export function updateIndex(value) {
  storageInit();
  if (value) {
    let indexUpdate = JSON.stringify(value);
    toStorage('index', indexUpdate);
    return value;
  } else {

    return JSON.parse(fromStorage('index'));
  }

}








