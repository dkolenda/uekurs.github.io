const quiz = document.querySelector("[data-quiz]");

if (quiz) {
  const questions = [...quiz.querySelectorAll(".quiz-question")];
  const scoreElement = quiz.querySelector("[data-quiz-score]");
  const totalElement = quiz.querySelector("[data-quiz-total]");

  totalElement.textContent = questions.length;

  questions.forEach((question) => {
    const options = [...question.querySelectorAll(".quiz-option")];

    options.forEach((option) => {
      option.addEventListener("click", () => {
        if (question.dataset.answered === "true") {
          return;
        }

        question.dataset.answered = "true";

        options.forEach((item) => {
          item.disabled = true;

          if (item.dataset.correct === "true") {
            item.classList.add("is-correct");
          }
        });

        if (option.dataset.correct !== "true") {
          option.classList.add("is-wrong");
        }

        question.dataset.correctlyAnswered = option.dataset.correct === "true" ? "true" : "false";

        const correctAnswers = quiz.querySelectorAll(".quiz-question[data-correctly-answered='true']");
        scoreElement.textContent = correctAnswers.length;
      });
    });
  });
}

const pinTypeStyles = {
  exec: { label: "Exec", color: "#f4f4f4", shape: "arrow" },
  bool: { label: "Boolean", color: "#cf1b1b", shape: "circle" },
  float: { label: "Float", color: "#8fcf62", shape: "circle" },
  real: { label: "Float", color: "#8fcf62", shape: "circle" },
  int: { label: "Integer", color: "#24b7b7", shape: "circle" },
  byte: { label: "Byte", color: "#24b7b7", shape: "circle" },
  actor: { label: "Actor", color: "#22a7e8", shape: "circle" },
  object: { label: "Actor", color: "#22a7e8", shape: "circle" },
  class: { label: "Class", color: "#22a7e8", shape: "circle" },
  delegate: { label: "Delegate", color: "#f36f32", shape: "square" },
  struct: { label: "Vector", color: "#f2c230", shape: "circle" },
  vector: { label: "Vector", color: "#f2c230", shape: "circle" },
  string: { label: "String", color: "#d05db8", shape: "circle" },
  text: { label: "Text", color: "#d05db8", shape: "circle" },
  name: { label: "Name", color: "#d05db8", shape: "circle" }
};

const normalizePinType = (category, subCategoryObject = "") => {
  const lowerCategory = (category || "").toLowerCase();
  const lowerObject = (subCategoryObject || "").toLowerCase();

  if (lowerCategory === "struct" && lowerObject.includes("vector")) return "vector";
  if (pinTypeStyles[lowerCategory]) return lowerCategory;
  return lowerCategory || "object";
};

const getPinStyle = (type) => pinTypeStyles[type] || pinTypeStyles.object;

const getVariableTypeMeta = (type) => getPinStyle(normalizePinType(type));

document.querySelectorAll("[data-blueprint-viewer]").forEach((blueprintViewer) => {
  const componentsRoot = blueprintViewer.querySelector("[data-bp-components]");
  const variablesRoot = blueprintViewer.querySelector("[data-bp-variables]");
  const content = blueprintViewer.querySelector("[data-bp-content]");
  const stage = blueprintViewer.querySelector("[data-bp-stage]");
  const title = blueprintViewer.querySelector("[data-bp-title]");
  const tabs = blueprintViewer.querySelector("[data-bp-tabs]");
  const zoomIn = blueprintViewer.querySelector("[data-bp-zoom-in]");
  const zoomOut = blueprintViewer.querySelector("[data-bp-zoom-out]");
  const zoomReset = blueprintViewer.querySelector("[data-bp-zoom-reset]");
  const openModalButton = blueprintViewer.querySelector("[data-bp-open-modal]");
  const viewButtons = [...blueprintViewer.querySelectorAll("[data-blueprint-view]")];
  const scriptTitle = blueprintViewer.dataset.blueprintTitle || blueprintViewer.closest("details")?.querySelector("summary")?.textContent.trim() || "Blueprint";
  const views = viewButtons.reduce((items, button) => {
    const key = button.dataset.blueprintView;

    if (!key) {
      return items;
    }

    items[key] = {
      label: button.dataset.bpLabel || button.textContent.trim(),
      image: button.dataset.bpImage || ""
    };
    return items;
  }, {});
  const viewportImage = blueprintViewer.dataset.bpViewportImage || componentsRoot?.dataset.bpViewportImage || "";

  if (viewportImage) {
    views.viewport = {
      label: "Viewport",
      image: viewportImage
    };
  }

  const blueprintViewerConfig = {
    views
  };
  const firstViewKey = viewButtons.find((button) => button.classList.contains("is-active"))?.dataset.blueprintView
    || Object.keys(blueprintViewerConfig.views)[0]
    || "eventGraph";
  const state = { activeView: firstViewKey, scale: 0.78, x: 24, y: 24, dragging: false, dragX: 0, dragY: 0 };

  if (Object.keys(blueprintViewerConfig.views).length === 0) {
    return;
  }

  const hydrateTreeItem = (item) => {
    const childItems = [...item.children].filter((child) => child.classList.contains("ue-tree-item"));
    const typeMeta = item.dataset.bpVariableType ? getVariableTypeMeta(item.dataset.bpVariableType) : null;
    const icon = item.dataset.icon || "•";
    const titleText = item.dataset.title || item.textContent.trim();
    const metaText = item.dataset.meta || item.dataset.bpVariableLabel || typeMeta?.label || "";
    const color = item.dataset.color || item.dataset.bpVariableColor || typeMeta?.color || "";
    const isPublic = item.dataset.bpPublic === "true";
    const iconElement = document.createElement("span");
    const titleElement = document.createElement("span");
    const trailingElement = document.createElement("span");

    iconElement.className = "ue-tree-icon";
    iconElement.textContent = icon;
    titleElement.textContent = titleText;

    if (color) {
      const dotElement = document.createElement("span");
      dotElement.className = "ue-color-dot";
      dotElement.style.setProperty("--dot-color", color);
      trailingElement.className = "ue-variable-type";
      trailingElement.append(dotElement);

      if (metaText) {
        const metaElement = document.createElement("span");
        metaElement.className = "ue-tree-meta";
        metaElement.textContent = metaText;
        trailingElement.append(metaElement);
      }

      if (isPublic) {
        const publicIcon = document.createElement("span");
        publicIcon.className = "ue-public-eye";
        publicIcon.setAttribute("aria-label", "Zmienna publiczna");
        publicIcon.setAttribute("title", "Zmienna publiczna");
        trailingElement.append(publicIcon);
      }
    } else {
      trailingElement.className = "ue-tree-meta";
      trailingElement.textContent = metaText;

      if (isPublic) {
        const publicIcon = document.createElement("span");
        publicIcon.className = "ue-public-eye";
        publicIcon.setAttribute("aria-label", "Zmienna publiczna");
        publicIcon.setAttribute("title", "Zmienna publiczna");
        trailingElement.append(publicIcon);
      }
    }

    if (item.tagName === "BUTTON") {
      item.replaceChildren(iconElement, titleElement, trailingElement);
    } else {
      const row = document.createElement("div");
      row.className = "ue-tree-item-row";
      row.append(iconElement, titleElement, trailingElement);
      item.replaceChildren(row, ...childItems);
    }
  };

  const hydrateTree = (root) => {
    root?.querySelectorAll(".ue-tree-item").forEach(hydrateTreeItem);
  };

  hydrateTree(componentsRoot);
  hydrateTree(variablesRoot);
  viewButtons.forEach(hydrateTreeItem);

  const componentItems = [...(componentsRoot?.querySelectorAll(".ue-tree-item") || [])];

  if (blueprintViewerConfig.views.viewport && componentsRoot) {
    componentItems.forEach((item) => {
      const row = [...item.children].find((child) => child.classList.contains("ue-tree-item-row"));

      if (row) {
        row.setAttribute("role", "button");
        row.tabIndex = 0;
        row.setAttribute("aria-label", `Pokaż ${item.dataset.title || "komponent"} w Viewport`);
      }
    });
  }

  Object.entries(blueprintViewerConfig.views).forEach(([key, view]) => {
    const tab = document.createElement("button");
    tab.className = "ue-tab";
    tab.type = "button";
    tab.dataset.blueprintView = key;
    tab.textContent = view.label;
    tabs.appendChild(tab);
    viewButtons.push(tab);
  });

  let lastGraphSize = { width: 0, height: 0 };

  const renderBlueprintImage = (view) => new Promise((resolve) => {
    content.replaceChildren();
    content.style.width = "0px";
    content.style.height = "0px";

    if (!view.image) {
      const fallback = document.createElement("div");
      fallback.className = "ue-blueprint-image-error";
      fallback.textContent = "Brakuje obrazu Blueprinta.";
      content.replaceChildren(fallback);
      content.style.width = "360px";
      content.style.height = "96px";
      lastGraphSize = { width: 360, height: 96 };
      resolve(lastGraphSize);
      return;
    }

    const image = document.createElement("img");
    image.className = "ue-blueprint-image";
    image.src = view.image;
    image.alt = `${view.label} blueprint screenshot`;
    image.draggable = false;

    const finish = () => {
      const width = image.naturalWidth || image.width || 1;
      const height = image.naturalHeight || image.height || 1;

      content.style.width = `${width}px`;
      content.style.height = `${height}px`;
      lastGraphSize = { width, height };
      resolve(lastGraphSize);
    };

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "ue-blueprint-image-error";
      fallback.textContent = "Nie udalo sie wczytac obrazu Blueprinta.";
      content.replaceChildren(fallback);
      content.style.width = "360px";
      content.style.height = "96px";
      lastGraphSize = { width: 360, height: 96 };
      resolve(lastGraphSize);
    }, { once: true });

    content.appendChild(image);

    if (image.complete && image.naturalWidth) {
      finish();
    }
  });

  const updateTransform = () => {
    content.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    zoomReset.textContent = `${Math.round(state.scale * 100)}%`;
  };

  const fitGraphToStage = (graphSize = lastGraphSize) => {
    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;

    if (!stageWidth || !stageHeight || !graphSize.width || !graphSize.height) {
      state.scale = state.activeView === "eventGraph" ? 0.78 : 1;
      state.x = 24;
      state.y = 24;
      updateTransform();
      return;
    }

    const scaleX = (stageWidth - 42) / graphSize.width;
    const scaleY = (stageHeight - 42) / graphSize.height;
    state.scale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.22), 1);
    state.x = Math.max(18, (stageWidth - graphSize.width * state.scale) / 2);
    state.y = Math.max(18, (stageHeight - graphSize.height * state.scale) / 2);
    updateTransform();
  };

  const setScale = (nextScale, originX = stage.clientWidth / 2, originY = stage.clientHeight / 2) => {
    const previous = state.scale;
    state.scale = Math.min(Math.max(nextScale, 0.18), 2.3);
    const factor = state.scale / previous;
    state.x = originX - (originX - state.x) * factor;
    state.y = originY - (originY - state.y) * factor;
    updateTransform();
  };

  const setActiveView = async (key) => {
    if (!blueprintViewerConfig.views[key]) {
      return;
    }

    state.activeView = key;
    viewButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.blueprintView === key));

    if (key !== "viewport") {
      componentItems.forEach((item) => item.classList.remove("is-active"));
    }

    const view = blueprintViewerConfig.views[key];
    title.textContent = view.label;
    const graphSize = await renderBlueprintImage(view);
    requestAnimationFrame(() => fitGraphToStage(graphSize));
  };

  const showComponentInViewport = (item) => {
    componentItems.forEach((componentItem) => componentItem.classList.toggle("is-active", componentItem === item));
    setActiveView("viewport");
  };

  if (blueprintViewerConfig.views.viewport && componentsRoot) {
    componentsRoot.addEventListener("click", (event) => {
      const item = event.target.closest(".ue-tree-item");

      if (item && componentsRoot.contains(item)) {
        showComponentInViewport(item);
      }
    });

    componentsRoot.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      const item = event.target.closest(".ue-tree-item");

      if (item && componentsRoot.contains(item)) {
        event.preventDefault();
        showComponentInViewport(item);
      }
    });
  }

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveView(button.dataset.blueprintView));
  });

  zoomIn.addEventListener("click", () => setScale(state.scale + 0.12));
  zoomOut.addEventListener("click", () => setScale(state.scale - 0.12));
  zoomReset.addEventListener("click", () => fitGraphToStage());

  const detailsParent = blueprintViewer.closest("details");
  if (detailsParent) {
    detailsParent.addEventListener("toggle", () => {
      if (detailsParent.open) {
        requestAnimationFrame(() => fitGraphToStage());
      }
    });
  }

  let blueprintModal = null;
  let modalSlot = null;
  let modalClose = null;
  const originalParent = blueprintViewer.parentNode;
  const originalNextSibling = blueprintViewer.nextSibling;

  const createBlueprintModal = () => {
    blueprintModal = document.createElement("div");
    blueprintModal.className = "ue-blueprint-modal";
    blueprintModal.setAttribute("role", "dialog");
    blueprintModal.setAttribute("aria-modal", "true");
    blueprintModal.setAttribute("aria-label", "Blueprint na cala szerokosc");
    blueprintModal.hidden = true;
    blueprintModal.innerHTML = `
      <div class="ue-blueprint-modal-panel">
        <div class="ue-blueprint-modal-toolbar">
          <strong class="ue-blueprint-modal-title"></strong>
          <button type="button" class="ue-blueprint-modal-close" data-bp-modal-close aria-label="Zamknij">x</button>
        </div>
        <div class="ue-blueprint-modal-slot"></div>
      </div>
    `;
    document.body.appendChild(blueprintModal);

    modalSlot = blueprintModal.querySelector(".ue-blueprint-modal-slot");
    modalClose = blueprintModal.querySelector("[data-bp-modal-close]");
    blueprintModal.querySelector(".ue-blueprint-modal-title").textContent = scriptTitle;
    modalClose.addEventListener("click", closeBlueprintModal);
    blueprintModal.addEventListener("click", (event) => {
      if (event.target === blueprintModal) {
        closeBlueprintModal();
      }
    });
  };

  const openBlueprintModal = () => {
    if (!blueprintModal) {
      createBlueprintModal();
    }

    modalSlot.appendChild(blueprintViewer);
    blueprintViewer.classList.add("is-modal-open");
    blueprintModal.hidden = false;
    document.body.classList.add("has-lightbox");
    modalClose.focus();
    requestAnimationFrame(() => fitGraphToStage());
  };

  function closeBlueprintModal() {
    if (!blueprintModal || blueprintModal.hidden) {
      return;
    }

    blueprintModal.hidden = true;
    blueprintViewer.classList.remove("is-modal-open");
    originalParent.insertBefore(blueprintViewer, originalNextSibling);
    document.body.classList.remove("has-lightbox");
    openModalButton?.focus();
    requestAnimationFrame(() => fitGraphToStage());
  }

  openModalButton?.addEventListener("click", openBlueprintModal);

  stage.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = stage.getBoundingClientRect();
    const direction = event.deltaY > 0 ? -0.1 : 0.1;
    setScale(state.scale + direction, event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });

  stage.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.dragX = event.clientX - state.x;
    state.dragY = event.clientY - state.y;
    stage.classList.add("is-dragging");
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    state.x = event.clientX - state.dragX;
    state.y = event.clientY - state.dragY;
    updateTransform();
  });

  const stopDragging = (event) => {
    state.dragging = false;
    stage.classList.remove("is-dragging");
    if (stage.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId);
    }
  };

  stage.addEventListener("pointerup", stopDragging);
  stage.addEventListener("pointercancel", stopDragging);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeBlueprintModal();
    }
  });

  window.addEventListener("resize", () => {
    if (!blueprintModal || blueprintModal.hidden) {
      return;
    }

    fitGraphToStage();
  });

  setActiveView(state.activeView);
});

const zoomableImages = [...document.querySelectorAll("main img")]
  .filter((image) => !image.closest(".video-card") && !image.closest(".ue-blueprint-viewer"));

if (zoomableImages.length > 0) {
  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Powiększony obraz");
  lightbox.hidden = true;

  lightbox.innerHTML = `
    <div class="image-lightbox-panel">
      <div class="image-lightbox-toolbar">
        <button type="button" class="image-lightbox-button" data-zoom-out aria-label="Pomniejsz">-</button>
        <button type="button" class="image-lightbox-button" data-zoom-reset aria-label="Przywróć rozmiar">100%</button>
        <button type="button" class="image-lightbox-button" data-zoom-in aria-label="Powiększ">+</button>
        <button type="button" class="image-lightbox-button" data-lightbox-close aria-label="Zamknij">x</button>
      </div>
      <div class="image-lightbox-stage">
        <img src="" alt="">
      </div>
    </div>
  `;

  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const zoomInButton = lightbox.querySelector("[data-zoom-in]");
  const zoomOutButton = lightbox.querySelector("[data-zoom-out]");
  const zoomResetButton = lightbox.querySelector("[data-zoom-reset]");
  const lightboxStage = lightbox.querySelector(".image-lightbox-stage");
  let currentScale = 1;
  let baseImageWidth = 0;
  let baseImageHeight = 0;

  const updateBaseSize = () => {
    const stageRect = lightboxStage.getBoundingClientRect();
    const naturalWidth = lightboxImage.naturalWidth || stageRect.width;
    const naturalHeight = lightboxImage.naturalHeight || stageRect.height;
    const imageRatio = naturalWidth / naturalHeight;
    const stageRatio = stageRect.width / stageRect.height;

    if (imageRatio > stageRatio) {
      baseImageWidth = Math.min(naturalWidth, stageRect.width);
      baseImageHeight = baseImageWidth / imageRatio;
    } else {
      baseImageHeight = Math.min(naturalHeight, stageRect.height);
      baseImageWidth = baseImageHeight * imageRatio;
    }
  };

  const setScale = (scale) => {
    currentScale = Math.min(Math.max(scale, 0.5), 3);
    lightboxImage.style.width = `${baseImageWidth * currentScale}px`;
    lightboxImage.style.height = `${baseImageHeight * currentScale}px`;
    zoomResetButton.textContent = `${Math.round(currentScale * 100)}%`;
  };

  const openLightbox = (image) => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Powiększony obraz";
    lightbox.hidden = false;
    document.body.classList.add("has-lightbox");
    lightboxImage.onload = () => {
      updateBaseSize();
      setScale(1);
    };

    if (lightboxImage.complete) {
      updateBaseSize();
      setScale(1);
    }

    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("has-lightbox");
    lightboxImage.onload = null;
    lightboxImage.src = "";
  };

  zoomableImages.forEach((image) => {
    image.classList.add("is-zoomable");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `${image.alt || "Obraz"} - kliknij, aby powiększyć`);

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  zoomInButton.addEventListener("click", () => setScale(currentScale + 0.25));
  zoomOutButton.addEventListener("click", () => setScale(currentScale - 0.25));
  zoomResetButton.addEventListener("click", () => setScale(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "+" || event.key === "=") {
      setScale(currentScale + 0.25);
    }

    if (event.key === "-") {
      setScale(currentScale - 0.25);
    }
  });

  window.addEventListener("resize", () => {
    if (lightbox.hidden) {
      return;
    }

    updateBaseSize();
    setScale(currentScale);
  });
}
document.querySelectorAll("[data-bp-tree-category-toggle]").forEach((toggle) => {
  const category = toggle.closest("[data-bp-tree-category]");
  const icon = toggle.querySelector(".ue-tree-category-icon");

  if (!category) {
    return;
  }

  const setOpen = (isOpen) => {
    category.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (icon) {
      icon.textContent = isOpen ? "▾" : "▸";
    }
  };

  setOpen(category.classList.contains("is-open"));

  toggle.addEventListener("click", () => {
    setOpen(!category.classList.contains("is-open"));
  });
});
