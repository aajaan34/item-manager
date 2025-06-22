/* script.js */
let items = JSON.parse(localStorage.getItem("items") || "[]");

if (location.pathname.includes("add.html")) {
  document.getElementById("addItemForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    const reader = new FileReader();
    reader.onload = function (e) {
      const item = {
        name: form.name.value,
        type: form.type.value,
        description: form.description.value,
        cover: e.target.result,
        additional: []
      };
      const files = form.additional.files;
      let loaded = 0;
      if (files.length === 0) finish();
      for (let i = 0; i < files.length; i++) {
        const r = new FileReader();
        r.onload = function (e) {
          item.additional.push(e.target.result);
          loaded++;
          if (loaded === files.length) finish();
        }
        r.readAsDataURL(files[i]);
      }
      function finish() {
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
        document.getElementById("successMsg").classList.remove("d-none");
        form.reset();
      }
    }
    reader.readAsDataURL(form.cover.files[0]);
  });
} else if (location.pathname.includes("index.html")) {
  const container = document.getElementById("items-container");
  items.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="item-card" data-index="${index}" data-bs-toggle="modal" data-bs-target="#itemModal">
        <img src="${item.cover}" alt="${item.name}" class="w-100 mb-2">
        <h5>${item.name}</h5>
      </div>
    `;
    container.appendChild(col);
  });

  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const carouselInner = document.getElementById("carousel-inner");

  container.addEventListener("click", function (e) {
    const card = e.target.closest(".item-card");
    if (!card) return;
    const item = items[card.dataset.index];
    modalTitle.innerText = item.name;
    modalDescription.innerText = item.description;
    carouselInner.innerHTML = item.additional.map((img, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <img src="${img}" class="d-block w-100">
      </div>
    `).join("");

    // Store selected index for deletion
    document.getElementById("deleteItemBtn").dataset.index = card.dataset.index;
  });

  

  document.getElementById("deleteItemBtn").onclick = () => {
    const indexToRemove = parseInt(document.getElementById("deleteItemBtn").dataset.index);
    if (confirm("Are you sure you want to delete this item?")) {
      items.splice(indexToRemove, 1);
      localStorage.setItem("items", JSON.stringify(items));
      const modal = bootstrap.Modal.getInstance(document.getElementById("itemModal"));
      modal.hide();
      setTimeout(() => location.reload(), 300);
    }
  };
}
