
const apiUrl = 'https://crudcrud.com/api/20dc13685f8048b0aba29bacc4f55528/products'; 

const productInput = document.querySelector('#product-input');
const productPrice = document.querySelector('#product-price');
const productCategory = document.querySelector('#product-category');
const submitButton = document.querySelector('#submit-button');
const tableBody = document.querySelector('#table-body');

async function fetchItems() {
    try {
        const response = await axios.get(apiUrl);
        const items = response.data;
        buildTable(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

function buildTable(items) {
    tableBody.innerHTML = ''; 
    items.forEach(item => {
        const row = `<tr>
                        <td>${item.productName}</td>
                        <td>${item.productPrice}</td>
                        <td>${item.productCategory}</td>
                        <td><button type="button" data-id="${item._id}" class="delete-button">Delete</button></td>
                    </tr>`;
        tableBody.innerHTML += row;
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

async function handleSubmit() {
    const productName = productInput.value;
    const productPriceValue = productPrice.value;
    const productCategoryValue = productCategory.value;

    if (productName && productPriceValue && productCategoryValue) {
        try {
            // Send a POST request with JSON payload
            const response = await axios.post(apiUrl, {
                productName,
                productPrice: productPriceValue,
                productCategory: productCategoryValue
            }, {
                headers: {
                    'Content-Type': 'application/json' 
                }
            });

            fetchItems();
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

async function handleDelete(event) {
    const button = event.target;
    const itemId = button.dataset.id;

    try {
        await axios.delete(`${apiUrl}/${itemId}`);
        button.closest('tr').remove();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleSubmit();
});

fetchItems();
