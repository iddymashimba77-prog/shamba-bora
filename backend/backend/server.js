require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Route ya AI Chat
app.post("/ask-ai", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Tafadhali andika swali lako." });
    }

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `Wewe ni mshauri wa kilimo wa kitaalamu anayeitwa "Eagle AI". 
Jibu MASWALI YA KILIMO TU kwa Kiswahili. 
Maswali yanayohusiana na kilimo ni pamoja na: mazao, mbolea, umwagiliaji, 
wadudu, magonjwa ya mmea, hali ya hewa kwa kilimo, soko la mazao, 
teknolojia ya kilimo, na mengine yanayohusiana.
Kama swali HALIHUSIANI na kilimo kabisa, jibu hivi tu: 
"Samahani, mimi ninahusika na masuala ya kilimo tu. Je, una swali lolote kuhusu kilimo?"`
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API Error:", errorData);
            return res.status(500).json({
                reply: "Kuna tatizo na API. Tafadhali jaribu tena baadaye."
            });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content ||
            "Samahani, sijapata jibu. Tafadhali jaribu tena.";

        res.json({ reply });

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({
            reply: "Kuna tatizo la seva. Hakikisha muunganiko wa intaneti."
        });
    }
});

// Route ya Plant Scanner — tumia Groq badala ya Google Vision
app.post("/scan-plant", async (req, res) => {
    const { imageData } = req.body;

    if (!imageData) {
        return res.status(400).json({ success: false, error: "Hakuna picha" });
    }

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:image/jpeg;base64,${imageData}`
                                    }
                                },
                                {
                                    type: "text",
                                    text: `Wewe ni mtaalamu wa kilimo. Chunguza picha hii kwa makini na ujibu kwa Kiswahili tu kwa muundo huu wa JSON:
{
  "isPlant": true/false,
  "detectedPlant": "jina la mmea",
  "confidence": "asilimia ya uhakika (0-100)",
  "health": "Afya nzuri / Mgonjwa / Inahitaji matibabu",
  "diseases": "magonjwa yaliyoonekana au Hakuna",
  "advice": "ushauri wa kilimo kwa mmea huu",
  "care": "jinsi ya kutunza mmea huu"
}
Kama si mmea, weka isPlant: false na eleza ulichoona.
Jibu kwa JSON tu — bila maelezo mengine.`
                                }
                            ]
                        }
                    ],
                    max_tokens: 1024
                })
            }
        );

        if (!response.ok) {
            const err = await response.json();
            console.error("Groq Vision Error:", err);
            return res.status(500).json({ success: false, error: "Groq API error" });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "{}";

        // Parse JSON jibu la Groq
        let plantData;
        try {
            const cleanJson = content.replace(/```json|```/g, "").trim();
            plantData = JSON.parse(cleanJson);
        } catch (e) {
            console.error("JSON parse error:", e);
            plantData = {
                isPlant: true,
                detectedPlant: "Mmea",
                confidence: "70",
                health: "Inahitaji uchunguzi zaidi",
                diseases: "Haijulikani",
                advice: content,
                care: "Mwagilia vizuri na tumia mbolea inayofaa"
            };
        }

        res.json({
            success: true,
            isPlant: plantData.isPlant,
            detectedPlant: plantData.detectedPlant || "Mmea",
            confidence: plantData.confidence || "75",
            health: plantData.health || "Afya nzuri",
            diseases: plantData.diseases || "Hakuna",
            advice: plantData.advice || "Tunza mmea wako vizuri",
            care: plantData.care || "Mwagilia kwa kawaida",
            labels: []
        });

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

function analyzePlantFromVision(visionResults) {
    const plantKeywords = [
        'plant', 'leaf', 'flower', 'tree', 'grass', 'vegetation',
        'crop', 'agriculture', 'mmea', 'jani', 'mboga', 'matunda'
    ];

    const labels = visionResults.labelAnnotations || [];
    const objects = visionResults.localizedObjectAnnotations || [];

    let plantScore = 0;
    let detectedPlant = null;
    let confidence = 0;

    [...labels, ...objects].forEach(item => {
        const name = (item.description || item.name || '').toLowerCase();
        const score = item.score || 0;

        if (plantKeywords.some(k => name.includes(k))) {
            plantScore += score;
            if (!detectedPlant || score > confidence) {
                detectedPlant = item.description || item.name;
                confidence = score;
            }
        }
    });

    return {
        isPlant: plantScore > 0.3,
        detectedPlant: detectedPlant || 'Mmea',
        confidence: (plantScore * 100).toFixed(1),
        labels: labels.slice(0, 3),
        advice: getPlantAdvice(detectedPlant || 'mmea')
    };
}

function getPlantAdvice(plantType) {
    const adviceMap = {
        'tomato': '🍅 Nyanya hupendelea joto 20-25°C na mbolea ya kikaboni.',
        'maize':  '🌽 Mahindi huhitaji jua kamili na mbolea ya nitrogen.',
        'vegetable': '🥬 Mboga huhitaji maji na udongo wenye pH 6.0-7.0.',
        'default': '🌱 Mwagilia vizuri, tumia mbolea inayofaa, angalia wadudu.'
    };

    const lower = plantType.toLowerCase();
    for (const [key, advice] of Object.entries(adviceMap)) {
        if (lower.includes(key)) return advice;
    }
    return adviceMap.default;
}

app.get("/", (req, res) => {
    res.json({ status: "✅ Server inafanya kazi" });
});

app.listen(5000, () => {
    console.log("✅ Server ina run: http://localhost:5000");
});