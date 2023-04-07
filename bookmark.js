javascript:(function() {
  try {
    const a = document.createElement('a');
    const dom = document.querySelector('main > .flex-1 > .h-full .flex');
    const template = document.createElement('template');
    const user_image = dom.querySelector('.items-end img.rounded-sm');
    const avatar_url = base64_image(user_image);
    const title = document.title;
    const non_letters_re = /[^\p{L}\p{N}]+/gu;
    const trailing_dash_re = /(^-)|(-$)/g;
    const slug = title.toLowerCase()
      .replace(non_letters_re, "-")
      .replace(trailing_dash_re, '');
    template.innerHTML = dom.innerHTML;
    ['button', "img[aria-hidden='true']"].forEach(selector => {
      template.content.querySelectorAll(selector).forEach(node => {
        if (!node.closest('.math') && !is_avatar(node)) {
          node.remove();
        }
      });
    });
    template.content.querySelectorAll('img').forEach(node => {
      node.setAttribute('alt', 'user avatar');
      node.setAttribute('src', avatar_url);
      ['srcset', 'style'].forEach(attr => {
        node.removeAttribute(attr);
      });
    });
    a.href = URL.createObjectURL(new Blob([`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Chat GPT: ${title}</title>
  <meta name="generator" content="chatGPT Saving Bookmark"/>
<style>
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" />
<link rel="stylesheet" href="https://rawcdn.githack.com/gvmossato/export-chat-gpt/feature/default-styles/styles/styles.css" type="text/css" />
</head>
<body>${template.innerHTML}</body></html>`], {type: 'text/html'}));
    a.download = `chat-gpt-${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch(e) {
    alert(e.message);
  }
  function is_avatar(node) {
    return (node.matches('.items-end') && node.querySelector('svg.h-6.w-6, img')) ||
      node.closest('svg') ||
      node.matches('svg.h-6.w-6') ||
      node.matches('img[alt*="@"]')
  }
  function base64_image(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/png');
  }
})();
