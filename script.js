// ملاحظة: استبدل هذا الرابط برابط Render بعد رفعه
const SERVER_URL = "https://your-service-name.onrender.com/generate";

const promptInput = document.getElementById('promptInput');
const genBtn = document.getElementById('genBtn');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

async function generateImage() {
    const text = promptInput.value.trim();
    if (!text) return;

    genBtn.disabled = true;
    genBtn.innerText = "جاري الرسم...";
    loader.style.display = "block";

    try {
        const response = await fetch(SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: text }),
        });

        if (!response.ok) throw new Error("السيرفر مشغول حالياً، حاول مجدداً");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = url;
        div.appendChild(img);
        gallery.prepend(div);

    } catch (error) {
        alert(error.message);
    } finally {
        genBtn.disabled = false;
        genBtn.innerText = "توليد";
        loader.style.display = "none";
        promptInput.value = "";
    }
}

genBtn.onclick = generateImage;
promptInput.onkeypress = (e) => { if(e.key === 'Enter') generateImage(); };

// تفعيل Service Worker للـ PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Error', err));
    });
}