import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح الـ API الخاص بك
const API_KEY = "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"; 

app.post("/generate", async (req, res) => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: req.body.prompt }),
            }
        );

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg);
        }

        const buffer = await response.arrayBuffer();
        res.set("Content-Type", "image/png");
        res.send(Buffer.from(buffer));

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "فشل في توليد الصورة" });
    }
});

// تحديد المنفذ تلقائياً لمنصة Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});