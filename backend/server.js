const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// The main wireframe endpoint that your frontend expects
app.post("/api/generate-wireframe", (req, res) => {
  console.log("Wireframe request received:", req.body);

  const prompt = req.body?.prompt || req.body?.description || "landing page";

  // Simple but beautiful wireframe template
  const wireframe = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Wireframe</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f8f9fa;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header { 
            background: linear-gradient(135deg, #0078d4, #106ebe); 
            color: white; 
            padding: 60px 0; 
            text-align: center; 
        }
        .header h1 { font-size: 3rem; margin-bottom: 1rem; font-weight: 600; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .main { padding: 80px 0; }
        .features { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 30px; 
            margin: 40px 0; 
        }
        .card { 
            background: white; 
            padding: 40px 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
            text-align: center; 
            transition: transform 0.3s ease;
        }
        .card:hover { transform: translateY(-5px); }
        .card h3 { color: #0078d4; margin-bottom: 1rem; font-size: 1.5rem; }
        .card p { color: #666; }
        .cta { 
            background: #0078d4; 
            color: white; 
            padding: 15px 30px; 
            border: none; 
            border-radius: 6px; 
            font-size: 1.1rem; 
            font-weight: 600; 
            cursor: pointer; 
            transition: background 0.3s ease;
            margin: 30px 0;
        }
        .cta:hover { background: #106ebe; }
        .footer { 
            background: #333; 
            color: white; 
            text-align: center; 
            padding: 40px 0; 
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            .features { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>Wireframe Generated</h1>
            <p>Based on: "${prompt}"</p>
        </div>
    </header>
    
    <main class="main">
        <div class="container">
            <section class="features">
                <div class="card">
                    <h3>🎨 Modern Design</h3>
                    <p>Clean, professional layout with modern styling and responsive design principles.</p>
                </div>
                <div class="card">
                    <h3>⚡ Fast Loading</h3>
                    <p>Optimized for performance with efficient CSS and lightweight structure.</p>
                </div>
                <div class="card">
                    <h3>📱 Mobile Ready</h3>
                    <p>Fully responsive design that works perfectly on all devices and screen sizes.</p>
                </div>
            </section>
            
            <div style="text-align: center;">
                <button class="cta">Get Started</button>
                <p style="margin-top: 20px; color: #666;">Generated with Designetica wireframe tool</p>
            </div>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Generated Wireframe. Built with Microsoft Learn standards.</p>
        </div>
    </footer>
</body>
</html>`;

  res.json({
    success: true,
    wireframe: wireframe,
    aiGenerated: false,
    source: "designetica-server",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Designetica server running on port ${PORT}`);
  console.log(
    `📍 Wireframe endpoint: http://localhost:${PORT}/api/generate-wireframe`
  );
});
