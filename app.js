// ==========================================
// AUNG BUSINESS OS
// APP.JS V2
// POS + PRODUCTS + STOCK
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // DATA
  // ==========================================

  let products = JSON.parse(
    localStorage.getItem("aung_products") || "[]"
  );

  let sales = JSON.parse(
    localStorage.getItem("aung_sales") || "[]"
  );

  let cart = [];


  // ==========================================
  // SAVE DATA
  // ==========================================

  function saveData() {

    localStorage.setItem(
      "aung_products",
      JSON.stringify(products)
    );

    localStorage.setItem(
      "aung_sales",
      JSON.stringify(sales)
    );

  }


  // ==========================================
  // FORMAT MONEY
  // ==========================================

  function money(number) {

    return Number(number || 0).toLocaleString("en-US") + " Ks";

  }


  // ==========================================
  // DASHBOARD
  // ==========================================

  function updateDashboard() {

    const today = new Date().toISOString().split("T")[0];

    const todaySales = sales.filter(
      sale => sale.date === today
    );

    const totalSales = todaySales.reduce(
      (sum, sale) => sum + sale.total,
      0
    );

    const totalProfit = todaySales.reduce(
      (sum, sale) => sum + sale.profit,
      0
    );

    const lowStock = products.filter(
      product => product.stock <= 5
    ).length;


    const statCards =
      document.querySelectorAll(".stat-card h2");


    if (statCards[0]) {
      statCards[0].textContent = money(totalSales);
    }

    if (statCards[1]) {
      statCards[1].textContent = money(totalProfit);
    }

    if (statCards[2]) {
      statCards[2].textContent = products.length;
    }

    if (statCards[3]) {
      statCards[3].textContent = lowStock;
    }

  }


  // ==========================================
  // ADD PRODUCT
  // ==========================================

  function addProduct() {

    const name = prompt("Product Name:");

    if (!name) return;


    const cost = Number(
      prompt("Cost Price:")
    );

    const price = Number(
      prompt("Selling Price:")
    );

    const stock = Number(
      prompt("Opening Stock:")
    );


    if (
      !Number.isFinite(cost) ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      cost < 0 ||
      price < 0 ||
      stock < 0
    ) {

      alert("Please enter valid numbers.");

      return;

    }


    const product = {

      id: Date.now(),

      name: name.trim(),

      cost: cost,

      price: price,

      stock: stock

    };


    products.push(product);

    saveData();

    updateDashboard();

    alert(
      `${product.name} added successfully.`
    );

  }


  // ==========================================
  // FIND PRODUCT
  // ==========================================

  function findProduct(id) {

    return products.find(
      product => product.id === id
    );

  }


  // ==========================================
  // ADD TO CART
  // ==========================================

  function addToCart() {

    if (products.length === 0) {

      alert(
        "No products available.\n\nPlease add a product first."
      );

      return;

    }


    const list = products
      .map(
        (product, index) =>
          `${index + 1}. ${product.name} | Stock: ${product.stock} | ${money(product.price)}`
      )
      .join("\n");


    const choice = Number(
      prompt(
        "Select Product:\n\n" +
        list +
        "\n\nEnter product number:"
      )
    );


    const product = products[choice - 1];


    if (!product) {

      alert("Invalid product.");

      return;

    }


    if (product.stock <= 0) {

      alert("This product is out of stock.");

      return;

    }


    const quantity = Number(
      prompt(
        `Quantity for ${product.name}:`
      )
    );


    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {

      alert("Invalid quantity.");

      return;

    }


    if (quantity > product.stock) {

      alert(
        `Only ${product.stock} units available.`
      );

      return;

    }


    const existing = cart.find(
      item => item.productId === product.id
    );


    if (existing) {

      if (
        existing.quantity + quantity >
        product.stock
      ) {

        alert("Not enough stock.");

        return;

      }

      existing.quantity += quantity;

    } else {

      cart.push({

        productId: product.id,

        name: product.name,

        price: product.price,

        cost: product.cost,

        quantity: quantity

      });

    }


    showCart();

  }


  // ==========================================
  // SHOW CART
  // ==========================================

  function showCart() {

    if (cart.length === 0) {

      alert("Cart is empty.");

      return;

    }


    const items = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x ${item.quantity} = ${money(
            item.price * item.quantity
          )}`
      )
      .join("\n");


    const total = cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );


    const action = prompt(
      "CURRENT CART\n\n" +
      items +
      "\n\nTOTAL: " +
      money(total) +
      "\n\nType:\n" +
      "1 = Complete Sale\n" +
      "2 = Cancel"
    );


    if (action === "1") {

      completeSale();

    }

  }


  // ==========================================
  // COMPLETE SALE
  // ==========================================

  function completeSale() {

    if (cart.length === 0) return;


    let total = 0;

    let profit = 0;


    cart.forEach(item => {

      const product = findProduct(
        item.productId
      );


      if (!product) return;


      product.stock -= item.quantity;


      total +=
        item.price * item.quantity;


      profit +=
        (item.price - item.cost) *
        item.quantity;

    });


    const payment = prompt(
      "Payment Type:\n\n1 = Cash\n2 = Credit"
    );


    const paymentType =
      payment === "2"
        ? "Credit"
        : "Cash";


    const sale = {

      id: Date.now(),

      date: new Date()
        .toISOString()
        .split("T")[0],

      items: [...cart],

      total: total,

      profit: profit,

      payment: paymentType

    };


    sales.push(sale);

    cart = [];


    saveData();

    updateDashboard();


    alert(
      "SALE COMPLETED!\n\n" +
      "Total: " +
      money(total) +
      "\nProfit: " +
      money(profit) +
      "\nPayment: " +
      paymentType
    );

  }


  // ==========================================
  // SHOW PRODUCTS
  // ==========================================

  function showProducts() {

    if (products.length === 0) {

      alert(
        "No products yet.\n\nUse Add Product to create your first product."
      );

      return;

    }


    const list = products
      .map(
        (product, index) =>
          `${index + 1}. ${product.name}\n` +
          `   Cost: ${money(product.cost)}\n` +
          `   Price: ${money(product.price)}\n` +
          `   Stock: ${product.stock}`
      )
      .join("\n\n");


    alert(
      "PRODUCTS & STOCK\n\n" +
      list
    );

  }


  // ==========================================
  // SALES HISTORY
  // ==========================================

  function showSales() {

    if (sales.length === 0) {

      alert("No sales history yet.");

      return;

    }


    const list = sales
      .slice()
      .reverse()
      .slice(0, 20)
      .map(
        (sale, index) =>
          `${index + 1}. ${sale.date}\n` +
          `   Total: ${money(sale.total)}\n` +
          `   Profit: ${money(sale.profit)}\n` +
          `   Payment: ${sale.payment}`
      )
      .join("\n\n");


    alert(
      "SALES HISTORY\n\n" +
      list
    );

  }


  // ==========================================
  // MENU
  // ==========================================

  const menuItems =
    document.querySelectorAll(".menu-item");


  menuItems.forEach(item => {

    item.addEventListener(
      "click",
      () => {

        menuItems.forEach(menu => {
          menu.classList.remove("active");
        });

        item.classList.add("active");


        const name =
          item.querySelector("span")
            ?.textContent || "";


        if (
          name.includes("POS")
        ) {

          addToCart();

        }

        else if (
          name.includes("Products")
        ) {

          showProducts();

        }

        else if (
          name.includes("Reports")
        ) {

          showSales();

        }

        else if (
          name.includes("AI")
        ) {

          alert(
            "AI Business Manager will be connected with Gemini in the next version."
          );

        }

      }
    );

  });


  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  const quickActions =
    document.querySelectorAll(
      ".quick-actions button"
    );


  quickActions.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const title =
          button.querySelector("strong")
            ?.textContent || "";


        if (
          title.includes("New Sale")
        ) {

          addToCart();

        }

        else if (
          title.includes("Add Product")
        ) {

          addProduct();

        }

        else if (
          title.includes("View Reports")
        ) {

          showSales();

        }

        else if (
          title.includes("Customer")
        ) {

          alert(
            "Customer module will be added next."
          );

        }

      }
    );

  });


  // ==========================================
  // CREATE SALE BUTTON
  // ==========================================

  const saleButton =
    document.querySelector(".primary-button");


  if (saleButton) {

    saleButton.addEventListener(
      "click",
      () => {

        addToCart();

      }
    );

  }


  // ==========================================
  // AI BUTTON
  // ==========================================

  const aiButton =
    document.querySelector(".ai-button");


  if (aiButton) {

    aiButton.addEventListener(
      "click",
      () => {

        alert(
          "AI Business Manager will be connected with Gemini in the next version."
        );

      }
    );

  }


  // ==========================================
  // INITIALIZE
  // ==========================================

  updateDashboard();

  console.log(
    "Aung Business OS V2 loaded successfully."
  );

});
