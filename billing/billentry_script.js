const products = [
    { id: "1", name: "Apples", price: 10 },
    { id: "2", name: "Bananas", price: 20 },
    { id: "3", name: "Milk", price: 30 },
    { id: "4", name: "Bread", price: 40 },
    { id: "5", name: "Eggs", price: 50 },
    { id: "6", name: "Toothpaste", price: 10 },
    { id: "7", name: "Brush", price: 15 },
    { id: "8", name: "Soap", price: 20 },
    { id: "9", name: "Comb", price: 5 },
    { id: "10", name: "Hair gel", price: 50 },
    { id: "11", name: "Lipstick", price: 100 },
    { id: "12", name: "Masala", price: 25 },
    { id: "13", name: "Wheat Flour", price: 200 },
    { id: "14", name: "Rice", price: 40 },
    { id: "15", name: "Sugar", price: 30 },
    { id: "16", name: "Salt", price: 12 },
    { id: "17", name: "Lemon", price: 5 },
    { id: "18", name: "Onion", price: 20 },
    { id: "19", name: "Tomato", price: 50 },
    { id: "20", name: "Carrot", price: 10 },
    { id: "21", name: "Pasta", price: 30 },
    { id: "22", name: "Maggi", price: 10 },
    { id: "23", name: "Notebook", price: 10},
    { id: "24", name: "Stationary Set", price: 25 },
    { id: "25", name: "Oil", price: 50 },
    { id: "26", name: "Butter", price: 15 },
    { id: "27", name: "Jam", price: 25 },
    { id: "28", name: "Chocolate", price: 5},
    { id: "29", name: "IceCream", price: 10 },
    { id: "30", name: "Chips", price: 10 },
    
];

const cart = []; // Array to hold the selected items
let rowCount = 2; // Initial row count

function findCartItem(productId) {
    return cart.find(item => item.id === productId);
}

function autofillProduct(row) {
    const productIdInput = document.getElementById(`product-id-${row}`);
    const productNameInput = document.getElementById(`product-name-${row}`);
    const productPriceInput = document.getElementById(`product-price-${row}`);

    const productId = productIdInput.value;
    const product = products.find(item => item.id === productId);

    if (product) {
        productNameInput.value = product.name;
        productPriceInput.value = product.price.toFixed(2);
        clearNewEntry(row); // Clear the new entry for the same product
        calculateTotal(row);
    } else {
        productNameInput.value = "";
        productPriceInput.value = "";
        document.getElementById(`quantity-${row}`).value = "";
        document.getElementById(`amount-${row}`).value = "";
        calculateTotalAmount();
    }
}

function calculateTotal(row) {
    const quantityInput = document.getElementById(`quantity-${row}`);
    const priceInput = document.getElementById(`product-price-${row}`);
    const amountInput = document.getElementById(`amount-${row}`);

    const quantity = parseInt(quantityInput.value, 10);
    const price = parseFloat(priceInput.value);

    const amount = isNaN(quantity) || isNaN(price) ? 0 : quantity * price;
    amountInput.value = amount.toFixed(2);

    updateCartItem(row, quantity, amount);
}

function updateCartItem(row, quantity, amount) {
    const productIdInput = document.getElementById(`product-id-${row}`);
    const productId = productIdInput.value;

    if (productId && !isNaN(quantity) && quantity > 0) {
        const existingItem = findCartItem(productId);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.amount = (existingItem.quantity * existingItem.price).toFixed(2);

            // Update the corresponding row with the new quantity and amount
            const quantityInput = document.getElementById(`quantity-${existingItem.row}`);
            const amountInput = document.getElementById(`amount-${existingItem.row}`);
            quantityInput.value = existingItem.quantity;
            amountInput.value = existingItem.amount;
        } else {
            const product = products.find(item => item.id === productId);
            if (product) {
                cart.push({ id: productId, name: product.name, price: product.price, quantity, amount: amount.toFixed(2), row });
            }
        }
    }

    calculateTotalAmount();
}

function calculateTotalAmount() {
    let total = 0;
    for (const item of cart) {
        total += parseFloat(item.amount);
    }

    const totalInput = document.getElementById("total");
    totalInput.value = total.toFixed(2);
}

function clearNewEntry(row) {
    const quantityInput = document.getElementById(`quantity-${row}`);
    const amountInput = document.getElementById(`amount-${row}`);

    quantityInput.value = "";
    amountInput.value = "";
}

function resetRow(row) {
    const rowElement = document.getElementById(`row-${row}`);
    rowElement.remove();

    // Remove the item from the cart array
    const productIdInput = document.getElementById(`product-id-${row}`);
    const productId = productIdInput.value;
    cart.splice(cart.findIndex(item => item.id === productId), 1);

    calculateTotalAmount();
}


function addRow() {
    rowCount++;
    const table = document.querySelector("table");
    const newRow = document.createElement("tr");
    newRow.id = `row-${rowCount}`;

    newRow.innerHTML = `
        <td><input type="text" id="product-id-${rowCount}" onblur="autofillProduct(${rowCount})"></td>
        <td><input type="text" id="product-name-${rowCount}" readonly></td>
        <td><input type="text" id="product-price-${rowCount}" readonly></td>
        <td><input type="number" id="quantity-${rowCount}" oninput="calculateTotal(${rowCount})"></td>
        <td><input type="text" id="amount-${rowCount}" readonly></td>
        <td><button onclick="resetRow(${rowCount})">Reset-Delete row</button></td>
    `;

    table.appendChild(newRow);
}
function amountToWords(amount) {
    const ones = [
        "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const tens = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const numToWords = (number) => {
        if (number < 20) return ones[number];
        const digit = number % 10;
        if (number < 100) return tens[Math.floor(number / 10)] + (digit ? " " + ones[digit] : "");
        if (number < 1000) return ones[Math.floor(number / 100)] + " Hundred" + (number % 100 === 0 ? "" : " " + numToWords(number % 100));
        if (number < 1000000) return numToWords(Math.floor(number / 1000)) + " Thousand" + (number % 1000 === 0 ? "" : " " + numToWords(number % 1000));
        
    };
    
    return numToWords(Math.floor(amount))  ;
}
function generateBill() {
    const bill = generateBillContent();
    const totalAmountInput = document.getElementById("total");
    const totalAmount = parseFloat(totalAmountInput.value); 

    
    const newWindow = window.open("", "","top=100,left=150,height=600,width=500");
    newWindow.document.write("<html><head><title>Generated Bill</title>");
    newWindow.document.write("<style>");
    newWindow.document.write("body {font-family: Verdana, Geneva, Tahoma, sans-serif ; background-color: aliceblue}");
    newWindow.document.write("h1 ,h5 { text-align: center; }");
    newWindow.document.write("table.generated-bill { width: 100%; border-collapse: collapse; border: 1px solid black; }");
    newWindow.document.write("table.generated-bill th { border: 1px solid black; padding: 8px;background-color: indianred; } table.generated-bill td {border: 1px solid black; padding: 8px; background-color:bisque;");
    newWindow.document.write("</style>");
    newWindow.document.write("</head><body>");
    newWindow.document.write("<h1>Acme Grocers</h1>");
    newWindow.document.write("<h5>Acme Grocers Chain,Hosakote,Bangalore -560049</h5>");
    newWindow.document.write("<h5>ph:1122334455 &copy; Madhura</h5>");
    newWindow.document.write("<h5><tt>BillId-100123-56-88</tt></h5>");
    newWindow.document.write(bill);

    
    newWindow.document.write("<p>Total Amount in Words: " + amountToWords(totalAmount) + "</p>");

    newWindow.document.write("</body></html>");
    newWindow.document.close();
    newWindow.onload = function() {
        newWindow.focus(); // Bring the new window to the front
    };
}
function generateBillContent() {
    let bill = "<h5>Generated Bill</h5>";
  

    bill += "<table class='generated-bill'>";
    bill += "<tr><th>Product ID</th><th>Product Name</th><th>Price</th><th>Quantity</th><th>Amount</th></tr>";

    // Loop through the cart to add the rows to the bill table
    for (const item of cart) {
        bill += `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.price.toFixed(2)}</td><td>${item.quantity}</td><td>${item.amount}</td></tr>`;
    }

    bill += "</table>";

 
    bill += `<h3>Total Amount: Rs ${document.getElementById("total").value}</h3>`;

    return bill;
}