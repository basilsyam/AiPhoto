import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// إعدادات الـ Middleware
app.use(cors()); // للسماح لمتصفحك بالاتصال بالسيرفر بدون مشاكل
app.use(express.json()); // لفهم البيانات القادمة بصيغة JSON

// قراءة مفتاح الـ API من إعدادات البيئة في Render (أكثر أماناً)
const API_KEY = process.env.HF_KEY; 

// مسار تجريبي للتأكد من أن السيرفر يعمل عند فتحه في المتصفح
app.get("/", (req, res) => {
    res.send("✅ AI Photo Generator Server is Live and Running! 🚀");
});

// المسار الرئيسي لتوليد الصور
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    // التأكد من وجود الوصف (Prompt)
    if (!prompt) {
        return res.status(400).json({ error: "الرجاء إدخال وصف للصورة" });
    }

    try {
        console.log(`🎨 Generating image for: ${prompt}`);

        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        // التعامل مع أخطاء Hugging Face (مثل الضغط العالي أو مفتاح خاطئ)
        if (!response.ok) {
            const errorData = await response.text();
            console.error("Hugging Face Error:", errorData);
            return res.status(response.status).json({ error: "فشل الاتصال بمحرك الذكاء الاصطناعي" });
        }

        // تحويل الاستجابة إلى بيانات باينري (Image Buffer) لإرسالها للمتصفح
        const buffer = await response.arrayBuffer();
        
        // إعداد الترويسة لتعريف المتصفح أنها صورة PNG
        res.set("Content-Type", "image/png");
        res.send(Buffer.from(buffer));

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "حدث خطأ داخلي في السيرفر" });
    }
});

// تحديد المنفذ تلقائياً (مهم جداً لـ Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🚀 ==========================================
    ✅ Server is running on port: ${PORT}
    🔗 URL: http://localhost:${PORT} (Local)
    🔗 Render URL: https://aiphoto-iokh.onrender.com (Live)
    =============================================
    `);
});