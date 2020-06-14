//Storage Controller
const StorageCtrl = (function () {
  return {
    setItemInSQLDatabase: function (item) {
      $.ajax({
        url: "./embed.php",
        method: "post",
        data: {
          content: JSON.stringify(item),
          task: "addItem",
        },
      });
    },

    getItemsFromSQLDatabase: async function () {
      const resp = await $.ajax({
        url: "./embed.php",
        method: "post",
        data: {
          task: "getItems",
        },
      });

      return resp;
    },

    convertAllItems: async function () {
      const resp = await this.getItemsFromSQLDatabase();
      let finalItems;

      function convertGotItems(gotItems) {
        let items = [];
        gotItems.forEach(function (item) {
          newItem = {
            id: parseInt(item.ID),
            name: item.itemName,
            calorie: parseInt(item.Calorie),
          };
          items.push(newItem);
        });
        return items;
      }
      finalItems = convertGotItems(JSON.parse(resp));
      return finalItems;
    },

    updateItemInSQLDatabase: function (updatedItem) {
      $.ajax({
        url: "./embed.php",
        method: "post",
        data: {
          content: JSON.stringify(updatedItem),
          task: "updateItem",
        },
      });
    },

    deleteItemFromSQLDatabase: function (id) {
      $.ajax({
        url: "./embed.php",
        method: "post",
        data: {
          ID: id,
          task: "deleteItem",
        },
      });
    },

    clearSQLDatabase: function () {
      $.ajax({
        url: "./embed.php",
        method: "post",
        data: {
          task: "deleteAll",
        },
        success: function (res) {
          console.log(res);
        },
      });
    },
  };
})();

//Item Controller
const ItemCtrl = (function () {
  const Item = function (id, name, calorie) {
    this.id = id;
    this.name = name;
    this.calorie = calorie;
  };

  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0,
  };

  return {
    setItems: function (allItems) {
      data.items = allItems;
    },

    getItems: function () {
      return data.items;
    },

    addItems: function (name, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);

      const newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },

    getTotalCalories: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.calorie;
      });

      data.totalCalories = total;

      return total;
    },

    getItemByID: function (id) {
      let found = null;

      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    updateItem: function (name, calorie) {
      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calorie = parseInt(calorie);
          found = item;
        }
      });

      return found;
    },

    deleteItem: function (id) {
      data.items.forEach(function (item, index) {
        if (item.id === id) {
          data.items.splice(index, 1);
        }
      });
    },

    deleteAllItems: function () {
      data.items = [];
    },

    logdata: function () {
      return data;
    },
  };
})();

//UI Controller
const UICtrl = (function () {
  const UISelector = {
    listItems: "#item-list",
    addBtn: ".add-btn",
    deleteBtn: ".delete-btn",
    updateBtn: ".update-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  return {
    insertDataInUI: function (items) {
      let output = ``;

      items.forEach(function (item) {
        output += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa fa-pencil edit-item"></i>
                    </a>
                </li>`;
      });

      document.querySelector(`${UISelector.listItems}`).innerHTML = output;
    },

    getUISelector: UISelector,

    getItemInput: function () {
      return {
        name: document.querySelector(UISelector.itemNameInput).value,
        calories: document.querySelector(UISelector.itemCaloriesInput).value,
      };
    },

    addListItem: function (item) {
      const li = document.createElement("li");

      li.className = "collection-item";
      li.id = `item-${item.id}`;

      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
      <a href="#" class="secondary-content">
          <i class="fa fa-pencil edit-item"></i>
      </a>`;

      document
        .querySelector(UISelector.listItems)
        .insertAdjacentElement("beforeend", li);
    },

    clearInputFields: function () {
      document.querySelector(UISelector.itemNameInput).value = "";
      document.querySelector(UISelector.itemCaloriesInput).value = "";
    },

    setTotalCalories: function (total) {
      document.querySelector(UISelector.totalCalories).textContent = total;
    },

    clearEditState: function () {
      UICtrl.clearInputFields();
      (document.querySelector(UISelector.addBtn).style.display = "inline"),
        (document.querySelector(UISelector.updateBtn).style.display = "none"),
        (document.querySelector(UISelector.deleteBtn).style.display = "none"),
        (document.querySelector(UISelector.backBtn).style.display = "none");
    },

    showEditState: function () {
      (document.querySelector(UISelector.addBtn).style.display = "none"),
        (document.querySelector(UISelector.updateBtn).style.display = "inline"),
        (document.querySelector(UISelector.deleteBtn).style.display = "inline"),
        (document.querySelector(UISelector.backBtn).style.display = "inline");
    },

    addItemToForm: function () {
      document.querySelector(
        UISelector.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelector.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calorie;
    },

    updateListItem: function (item) {
      const li = document.querySelector(
        `#item-${ItemCtrl.getCurrentItem().id}`
      );
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
      <a href="#" class="secondary-content">
          <i class="fa fa-pencil edit-item"></i>
      </a>`;
    },

    deleteListItem: function (id) {
      const li = document.querySelector(`#item-${id}`);
      li.remove();
    },

    clearListItems: function () {
      document.querySelector(UISelector.listItems).innerHTML = "";
    },
  };
})();

//App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  //Load Events
  const loadEventListeners = function () {
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) e.preventDefault();

      return false;
    });

    document
      .querySelector(UICtrl.getUISelector.addBtn)
      .addEventListener("click", addItemSubmit);

    document
      .querySelector(UICtrl.getUISelector.listItems)
      .addEventListener("click", editItemState);

    document
      .querySelector(UICtrl.getUISelector.updateBtn)
      .addEventListener("click", updateItemSubmit);

    document
      .querySelector(UICtrl.getUISelector.deleteBtn)
      .addEventListener("click", deleteItemSubmit);

    document
      .querySelector(UICtrl.getUISelector.backBtn)
      .addEventListener("click", backSubmit);

    document
      .querySelector(UICtrl.getUISelector.clearBtn)
      .addEventListener("click", clearSubmit);
  };

  function addItemSubmit(e) {
    const input = UICtrl.getItemInput();
    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemCtrl.addItems(input.name, input.calories);

      UICtrl.addListItem(newItem);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.setTotalCalories(totalCalories);

      StorageCtrl.setItemInSQLDatabase(newItem);
      UICtrl.clearInputFields();
    }

    e.preventDefault();
  }

  function editItemState(e) {
    if (e.target.classList.contains("edit-item")) {
      const ItemIdArr = e.target.parentNode.parentNode.id.split("-");

      const id = parseInt(ItemIdArr[1]);

      const itemToEdit = ItemCtrl.getItemByID(id);
      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.showEditState();
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  function updateItemSubmit(e) {
    const input = UICtrl.getItemInput();
    if (input.name !== "" && input.calories !== "") {
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

      UICtrl.updateListItem(updatedItem);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.setTotalCalories(totalCalories);

      StorageCtrl.updateItemInSQLDatabase(updatedItem);

      UICtrl.clearEditState();
    }

    e.preventDefault();
  }

  function deleteItemSubmit(e) {
    ItemCtrl.deleteItem(ItemCtrl.getCurrentItem().id);
    UICtrl.deleteListItem(ItemCtrl.getCurrentItem().id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.setTotalCalories(totalCalories);

    StorageCtrl.deleteItemFromSQLDatabase(ItemCtrl.getCurrentItem().id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  function backSubmit(e) {
    UICtrl.clearEditState();
    e.preventDefault();
  }

  function clearSubmit(e) {
    ItemCtrl.deleteAllItems();

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.setTotalCalories(totalCalories);

    UICtrl.clearListItems();

    StorageCtrl.clearSQLDatabase();
    e.preventDefault();
  }

  return {
    init: function () {
      UICtrl.clearEditState();
      const items = ItemCtrl.getItems();
      UICtrl.insertDataInUI(items);
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.setTotalCalories(totalCalories);

      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

function setDataItems() {
  StorageCtrl.convertAllItems().then((allItems) => {
    ItemCtrl.setItems(allItems);
    App.init();
  });
}

setDataItems();
