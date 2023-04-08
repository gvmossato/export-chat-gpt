javascript: (function () {
  function updateChatHeader(model, name) {
    return `🧠 ${model.replace("Model: ", "")} | 💬 ${name}`;
  }
  function isAvatar(node) {
    return (
      (node.matches(".items-end") && node.querySelector("svg.h-6.w-6, img"))
      || node.closest("svg")
      || node.matches("svg.h-6.w-6")
      || node.matches('img[alt*="@"]')
    );
  }
  function b64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }
  try {
    const a = document.createElement("a");
    const dom = document.querySelector("main > .flex-1 > .h-full .flex");
    const template = document.createElement("template");
    const userImage = dom.querySelector(".items-end img.rounded-sm");
    const avatarUrl = b64Image(userImage);
    const title = document.title;
    const nonLettersRegex = /[^\p{L}\p{N}]+/gu;
    const trailingDashRegex = /(^-)|(-$)/g;
    const slug = title
      .toLowerCase()
      .replace(nonLettersRegex, "-")
      .replace(trailingDashRegex, "");
    template.innerHTML = dom.innerHTML;
    const modelVersionDiv = template.content.querySelector(".w-full");
    modelVersionDiv.innerHTML = updateChatHeader(
      modelVersionDiv.innerHTML,
      title
    );
    ["button", "img[aria-hidden='true']"].forEach((selector) => {
      template.content.querySelectorAll(selector).forEach((node) => {
        if (!node.closest(".math") && !isAvatar(node)) node.remove();
      });
    });
    template.content.querySelectorAll("img").forEach((node) => {
      node.setAttribute("alt", "user avatar");
      node.setAttribute("src", avatarUrl);
      ["srcset", "style"].forEach((attr) => node.removeAttribute(attr));
    });
    a.href = URL.createObjectURL(
      new Blob(
        [
          `<!DOCTYPE html>
          <html class="dark" style="color-scheme: dark;">
          <head>
            <title>Chat GPT | ${title}</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" />
            <link rel="stylesheet" href="https://rawcdn.githack.com/gvmossato/export-chat-gpt/feature/default-styles/styles/styles.css" type="text/css" />
          </head>
          <body>
            ${template.innerHTML}
          </body>
          </html>`,
        ],
        { type: "text/html" }
      )
    );
    a.download = `chat-gpt-${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (e) {
    alert(e.message);
  }
})();
