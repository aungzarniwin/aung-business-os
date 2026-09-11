// ==========================================
// AUNG BUSINESS OS
// APP.JS V1
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // SIDEBAR MENU
  // ==========================================

  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item) => {

    item.addEventListener("click", () => {

      menuItems.forEach((menu) => {
        menu.classList.remove("active");
      });

      item.classList.add("active");

      const sectionName = item.querySelector("span")?.textContent || "";

      console.log("Selected:", sectionName);

    });

  });


  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  const quickActions = document.querySelectorAll(".quick-actions button");

  quickActions.forEach((button) => {

    button.addEventListener("click", () => {

      const title = button.querySelector("strong")?.textContent || "";

      alert(`${title} feature will be available soon.`);

    });

  });


  // ==========================================
  // CREATE FIRST SALE
  // ==========================================

  const createSaleButton =
    document.querySelector(".primary-button");

  if (createSaleButton) {

    createSaleButton.addEventListener("click", () => {

      alert("POS / New Sale module is coming in the next version.");

    });

  }


  // ==========================================
  // AI BUSINESS MANAGER
  // ==========================================

  const aiButton =
    document.querySelector(".ai-button");

  if (aiButton) {

    aiButton.addEventListener("click", () => {

      alert("AI Business Manager will be connected with Gemini in a later version.");

    });

  }


  // ==========================================
  // VIEW ALL
  // ==========================================

  const viewAllButton =
    document.querySelector(".view-all");

  if (viewAllButton) {

    viewAllButton.addEventListener("click", () => {

      alert("Sales History will be available soon.");

    });

  }


  // ==========================================
  // DASHBOARD READY
  // ==========================================

  console.log("Aung Business OS V1 loaded successfully.");

});
