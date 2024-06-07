var inputTitle = document.getElementById('inputTitle');
var inputPrice = document.getElementById('inputPrice');
var inputCategory = document.getElementById('inputCategory');
var inputImage = document.getElementById('inputImage');
var inputDescription = document.getElementById('inputDescription');
var addButton = document.getElementById('addButton');
var editButton = document.getElementById('editButton');
var searchItem = document.getElementById('searchItem');
var itemsList;
var items = "";


if (localStorage.getItem('items')) {
    itemsList = JSON.parse(localStorage.getItem('items'));
    displayItems(itemsList);
}
else
    itemsList = [];


function addItem() {
    if (!validateInput(inputTitle) || !validateInput(inputPrice) || !validateInput(inputCategory) || !validateInput(inputImage)) {
        alert(`Please enter valid data:
        Title: 3-20 characters, no special characters
        Price: 1-6 digits, no leading zeros
        Category: Mobile, TV, Computer, Car, Book
        Image: jpg, jpeg, png, gif, bmp, webp`);
        return;
    }
    var item = {
        title: inputTitle.value,
        price: inputPrice.value,
        category: inputCategory.value,
        image: inputImage.files[0]?.name || "",
        description: inputDescription.value,
        index: itemsList.length
    }
    itemsList.push(item);
    updatesStorage();
    clearForm();
    displayItems(itemsList);
}


function displayItems(list, searchFlag = false) {
    items = "";
    for (var i = 0; i < list.length; i++) {
        if(!searchFlag)
            list[i].matchedTitle = "";
        items +=
            `<div class="col-md-4 col-lg-3">
                <div class="card">
                    <img src="images/${list[i].image}" class="card-img-top img-fluid" alt="" />
                    <div class="card-body">
                        <h5 class="card-title">${list[i].matchedTitle ? list[i].matchedTitle : list[i].title}</h5>
                        <div class="d-flex justify-content-between">
                            <h6 class="card-title">${list[i].category}</h6>
                            <h6 class="card-title">${list[i].price}</h6>
                        </div>
                        <p class="card-text">
                            ${list[i].description}
                        </p>
                        <div>
                            <button class="btn btn-outline-success" onclick="editItem(${list[i].index})">Edit</button>
                            <button class="btn btn-outline-danger" onclick="deleteItem(${list[i].index})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>`
    }
    document.getElementById('items').innerHTML = items;
}


function clearForm(searchFlag = false) {
    inputTitle.value = "";
    if(inputTitle.classList.contains('is-valid'))
        inputTitle.classList.remove('is-valid');
    if(inputTitle.classList.contains('is-invalid'))
        inputTitle.classList.remove('is-invalid');
    
    inputPrice.value = "";
    if(inputPrice.classList.contains('is-valid'))
        inputPrice.classList.remove('is-valid');
    if(inputPrice.classList.contains('is-invalid'))
        inputPrice.classList.remove('is-invalid');
    
    inputCategory.value = "";
    if(inputCategory.classList.contains('is-valid'))
        inputCategory.classList.remove('is-valid');
    if(inputCategory.classList.contains('is-invalid'))
        inputCategory.classList.remove('is-invalid');
    
    inputImage.value = "";
    if(inputImage.classList.contains('is-valid'))
        inputImage.classList.remove('is-valid');
    if(inputImage.classList.contains('is-invalid'))
        inputImage.classList.remove('is-invalid');
    
    inputDescription.value = "";
    if (!searchFlag)
        searchItem.value = "";
}


function deleteItem(index) {
    itemsList.splice(index, 1);
    updateIndexes();
    if (searchItem.value === '')
        displayItems(itemsList);
    else
        searchItems();
    updatesStorage();
}


function updateIndexes() {
    for (var i = 0; i < itemsList.length; i++) {
        itemsList[i].index = i;
    }
}


function editItem(index) {
    inputTitle.value = itemsList[index].title;
    inputPrice.value = itemsList[index].price;
    inputCategory.value = itemsList[index].category;
    inputDescription.value = itemsList[index].description;
    editButton.attributes['data-index'] = index;
    editButton.setAttribute('data-index', index);
    addButton.classList.add('d-none');
    editButton.classList.remove('d-none');
}


function updateItem() {
    if (!validateInput(inputTitle) || !validateInput(inputPrice) || !validateInput(inputCategory) || (!validateInput(inputImage) && !inputImage.value === '')) {
        alert(`Please enter valid data:
        Title: 3-20 characters, no special characters
        Price: 1-6 digits, no leading zeros
        Category: Mobile, TV, Computer, Car, Book
        Image: jpg, jpeg, png, gif, bmp, webp`);
        return;
    }
    var index = editButton.getAttribute('data-index');
    itemsList[index].title = inputTitle.value;
    itemsList[index].price = inputPrice.value;
    itemsList[index].category = inputCategory.value;
    itemsList[index].description = inputDescription.value;
    itemsList[index].image = inputImage.files[0]?.name || itemsList[index].image;
    updatesStorage();
    if (searchItem.value === '')
        displayItems(itemsList);
    else
        searchItems();
    clearForm(1);
    addButton.classList.remove('d-none');
    editButton.classList.add('d-none');
}


function updatesStorage() {
    localStorage.setItem('items', JSON.stringify(itemsList));
}


function searchItems() {
    var matchedItems = [];
    var searchTitle = searchItem.value;
    for (var i = 0; i < itemsList.length; i++) {
        if (itemsList[i].title.toLowerCase().includes(searchTitle.toLowerCase())) {
            var repIndex = itemsList[i].title.toLowerCase().indexOf(searchTitle.toLowerCase());
            var firstPart = itemsList[i].title.slice(0, repIndex);
            var middlePart = itemsList[i].title.slice(repIndex, repIndex + searchTitle.length);
            var lastPart = itemsList[i].title.slice(repIndex + searchTitle.length);
            itemsList[i].matchedTitle = firstPart + `<span class="text-danger">${middlePart}</span>` + lastPart;
            matchedItems.push(itemsList[i]);
        }
    }
    displayItems(matchedItems, 1);
}


function isValidInputs(inputItem) {
    var regex = {
        inputTitle: /^[A-Za-z0-9 ]{3,20}$/,
        inputPrice: /^[1-9][0-9]{0,5}$/,
        inputCategory: /^(Mobile|TV|Computer|Car|Book)$/,
        inputImage: /\.(jpg|jpeg|png|gif|bmp|webp)$/i
    }
    return regex[inputItem.id].test(document.getElementById(inputItem.id).value);
}


function validateInput(inputItem) {
    if (isValidInputs(inputItem)) {
        if (inputItem.classList.contains('is-invalid'))
            inputItem.classList.remove('is-invalid');
        if (!inputItem.classList.contains('is-valid'))
            inputItem.classList.add('is-valid');
        return true;
    }
    else {
        if (inputItem.classList.contains('is-valid'))
            inputItem.classList.remove('is-valid');
        if (!inputItem.classList.contains('is-invalid'))
            inputItem.classList.add('is-invalid');
        return false;
    }
}