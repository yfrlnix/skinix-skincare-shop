"use strict";

/** Navbar toggle */
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

navTogglers.forEach((toggler) =>
  toggler.addEventListener("click", () => {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  })
);
navbarLinks.forEach((link) =>
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  })
);

/** Sticky header */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
window.addEventListener("scroll", () => {
  header.classList.toggle("active", window.scrollY > 150);
  backTopBtn.classList.toggle("active", window.scrollY > 150);
});

/** Scroll reveal effect */
const sections = document.querySelectorAll("[data-section]");
const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }
  }
};
window.addEventListener("scroll", scrollReveal);
scrollReveal();

/** Add to Cart System */
let cart = [];

const cartModal = document.getElementById("cartModal");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalDisplay = document.getElementById("cartTotal");
const cartNotification = document.getElementById("cartNotification");
const cartIconBtn = document.querySelectorAll(".header-action-btn")[2]; // cart icon
const cartCountBadge = cartIconBtn.querySelector(".btn-badge");
const cartTotalText = cartIconBtn.querySelector(".btn-text");

// Show "Added to cart" notification
function showCartNotification(productName) {
  cartNotification.innerText = `${productName} added to the cart!`;
  cartNotification.classList.remove("hidden");
  setTimeout(() => {
    cartNotification.classList.add("hidden");
  }, 2000);
}

function showFavNotification(productName) {
  const favNotification = document.getElementById("favNotification");
  favNotification.innerText = `${productName} added to favorites!`;
  favNotification.classList.remove("hidden");
  setTimeout(() => {
    favNotification.classList.add("hidden");
  }, 2000);
}

// Add product to cart
function addToCart(title, price, image) {
  const existingItem = cart.find((item) => item.title === title);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ title, price, image, quantity: 1 });
  }
  showCartNotification(title);
  updateCartDisplay();
}

// Remove item
function removeFromCart(title) {
  cart = cart.filter((item) => item.title !== title);
  updateCartDisplay();
}

// Update quantity
function changeQuantity(title, delta) {
  const item = cart.find((item) => item.title === title);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(title);
  }
  updateCartDisplay();
}

// Update cart UI
function updateCartDisplay() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let quantitySum = 0;

  cart.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;
    quantitySum += item.quantity;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
  <img src="${item.image}" width="50" />
  <span>${item.title} x${item.quantity} - ₱${itemTotal.toFixed(2)}</span>
      <div>
        <button onclick="changeQuantity('${item.title}', -1)">-</button>
        <button onclick="changeQuantity('${item.title}', 1)">+</button>
        <button onclick="removeFromCart('${item.title}')">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(li);
  });

  cartTotalDisplay.innerText = `₱${total.toFixed(2)}`;
  cartCountBadge.innerText = quantitySum;
  cartTotalText.innerText = `₱${total.toFixed(2)}`;
}

// Add to cart button listeners
const addToCartButtons = document.querySelectorAll(
  '[aria-label="add to cart"]'
);
addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".shop-card");
    const title =
      card.querySelector(".card-title")?.innerText ?? "Unnamed Product";
    const priceText = card.querySelector(".price .span")?.innerText ?? "₱0";
    const price = parseFloat(priceText.replace(/[^\d.]/g, "")); // FIXED
    const image = card.querySelector(".img-cover")?.src ?? "";

    addToCart(title, price, image);
  });
});

// Toggle cart modal
const modalOverlay = document.getElementById("modalOverlay");

cartIconBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  modalOverlay.classList.remove("hidden");
  modalOverlay.classList.add("active");
});

// Checkout system
const closeCartBtn = document.getElementById("closeCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutMsg = document.getElementById("checkoutMessage");

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  modalOverlay.classList.add("hidden");
  modalOverlay.classList.remove("active");
});

checkoutBtn.addEventListener("click", () => {
  const total = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);
  checkoutMsg.innerText = `Thank you for the purchase! Total: ₱${total}. Your order will be processed shortly.`;
  checkoutMsg.classList.remove("hidden");
  cartModal.classList.add("hidden");
  cart = [];
  updateCartDisplay();
  setTimeout(() => {
    checkoutMsg.classList.add("hidden");
  }, 5000);
});

/** Favorites System */
let favorites = [];
const favButtons = document.querySelectorAll('[aria-label="add to whishlist"]');

function updateFavoriteDisplay() {
  const favCountBadge = document.querySelectorAll(
    ".header-action-btn .btn-badge"
  )[0]; // first = favorite
  favCountBadge.innerText = favorites.length;
}

favButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".shop-card");
    const title = card.querySelector(".card-title")?.innerText;

    if (!favorites.includes(title)) {
      favorites.push(title);
      button.classList.add("active");
      showFavNotification(title); // 👉 Show notification when added
    } else {
      favorites = favorites.filter((item) => item !== title);
      button.classList.remove("active");
    }

    updateFavoriteDisplay();
  });
});
