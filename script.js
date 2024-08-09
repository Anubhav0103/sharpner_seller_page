// No need to import axios here when using CDN
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy URL
const apiUrl = 'https://crudcrud.com/api/20dc13685f8048b0aba29bacc4f55528'; 

// Select DOM elements
const productInput = document.querySelector('#product-input');
const productPrice = document.querySelector('#product-price');
const productCategory = document.querySelector('#product-category');
const submitButton = document.querySelector('#submit-button');
const tableBody = document.querySelector('#table-body');

// Fetch items from backend and display in the table
async function fetchItems() {
    try {
        const response = await axios.get(apiUrl);
        const items = response.data;
        buildTable(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Build the table with the provided items
function buildTable(items) {
    tableBody.innerHTML = ''; // Clear existing table rows

    items.forEach(item => {
        const row = `<tr>
                        <td>${item.productName}</td>
                        <td>${item.productPrice}</td>
                        <td>${item.productCategory}</td>
                        <td><button type="button" data-id="${item._id}" class="delete-button">Delete</button></td>
                    </tr>`;
        tableBody.innerHTML += row;
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

// Handle form submission
async function handleSubmit() {
    const productName = productInput.value;
    const productPriceValue = productPrice.value;
    const productCategoryValue = productCategory.value;

    if (productName && productPriceValue && productCategoryValue) {
        try {
            const response = await axios.post(proxyUrl + apiUrl, {
                productName,
                productPrice: productPriceValue,
                productCategory: productCategoryValue
            });

            // Add the new item to the table
            buildTable([...tableBody.querySelectorAll('tr').map(row => ({
                productName: row.children[0].textContent,
                productPrice: row.children[1].textContent,
                productCategory: row.children[2].textContent,
                _id: row.querySelector('.delete-button').dataset.id
            })), response.data]);

            // Clear the input fields
            productInput.value = '';
            productPrice.value = '';
            productCategory.value = '';
        } catch (error) {
            console.error('Error posting item:', error);
        }
    } else {
        alert('Please fill in all fields.');
    }
}

// Handle item deletion
async function handleDelete(event) {
    const button = event.target;
    const itemId = button.dataset.id;

    try {
        await axios.delete(`${apiUrl}/${itemId}`);
        // Remove the item from the table
        button.closest('tr').remove();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Add event listener to the submit button
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleSubmit();
});

// Fetch items on page load
fetchItems();
