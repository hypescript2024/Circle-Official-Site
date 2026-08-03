(function showVideoModal() {
  const videoUrl = new URL("https://www.youtube.com/embed/kO2d31TBRpg?si=PhWxa5q_n9QFHMbc");

  window.addEventListener("load", () => {
    const modal = document.createElement("div");
    modal.className = "video-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "動画");

    const panel = document.createElement("div");
    panel.className = "video-modal__panel";

    const closeButton = document.createElement("button");
    closeButton.className = "video-modal__close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "動画を閉じる");
    closeButton.textContent = "×";

    const frame = document.createElement("iframe");
    frame.className = "video-modal__frame";
    if (location.protocol === "http:" || location.protocol === "https:") {
      videoUrl.searchParams.set("origin", location.origin);
    }
    frame.src = videoUrl.toString();
    frame.title = "HypeScriptの動画";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;

    const handleKeydown = (event) => {
      if (event.key === "Escape" && document.body.contains(modal)) closeModal();
    };
    const closeModal = () => {
      document.removeEventListener("keydown", handleKeydown);
      modal.remove();
    };

    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", handleKeydown);

    panel.append(closeButton, frame);
    modal.appendChild(panel);
    document.body.appendChild(modal);
  });
})();
