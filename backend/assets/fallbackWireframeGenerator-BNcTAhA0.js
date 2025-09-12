const o={microsoft:{main:"#8E9AAF",secondary:"#68769C",bg:"#ffffff",surface:"#f8f9fa",text:"#3C4858",textSecondary:"#68769C",border:"#e1e5e9",accent:"#8E9AAF",headerBg:"#ffffff",headerText:"#000000"},secondary:{main:"#8b5dae",secondary:"#6b46c1",bg:"#ffffff",surface:"#f8f9fa",text:"#171717",textSecondary:"#68769C",border:"#e1dfdd",accent:"#8b5dae",headerBg:"#ffffff",headerText:"#000000"},success:{main:"#107c10",secondary:"#0e6b0e",bg:"#ffffff",surface:"#f8f9fa",text:"#171717",textSecondary:"#68769C",border:"#e1dfdd",accent:"#107c10",headerBg:"#ffffff",headerText:"#000000"}},n=t=>`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
    background: ${t.bg}; 
    color: ${t.text}; 
    line-height: 1.6; 
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .header { 
    background: ${t.headerBg||"#ffffff"}; 
    padding: 16px 0; 
    border-bottom: 1px solid ${t.border}; 
    position: relative; 
    z-index: 1; 
  }
  .header-content { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
  }
  .logo { 
    font-size: 24px; 
    font-weight: 600; 
    color: ${t.headerText||"#000000"}; 
  }
  .nav { display: flex; gap: 24px; }
  .nav a { 
    color: ${t.headerText||"#000000"}; 
    text-decoration: none; 
    font-weight: 500; 
    transition: color 0.2s; 
  }
  .nav a:hover { color: ${t.main}; }
  .btn-primary { 
    background: ${t.main}; 
    color: white; 
    padding: 12px 24px; 
    border: none; 
    border-radius: 4px; 
    font-weight: 500; 
    text-decoration: none; 
    display: inline-block; 
    transition: background 0.2s; 
    cursor: pointer; 
  }
  .btn-primary:hover { background: ${t.secondary}; }
  .btn-secondary { 
    background: transparent; 
    color: ${t.main}; 
    padding: 12px 24px; 
    border: 1px solid ${t.main}; 
    border-radius: 4px; 
    font-weight: 500; 
    text-decoration: none; 
    display: inline-block; 
    transition: all 0.2s; 
    cursor: pointer; 
  }
  .btn-secondary:hover { 
    background: ${t.main}; 
    color: white; 
  }
  .card { 
    background: white; 
    padding: 24px; 
    border-radius: 8px; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
    border: 1px solid ${t.border}; 
  }
  .grid { 
    display: grid; 
    gap: 24px; 
  }
  .grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
  .grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
  .fallback-notice { 
    background: #fff4ce; 
    border: 1px solid #ffb900; 
    padding: 16px; 
    border-radius: 4px; 
    margin-bottom: 24px; 
    text-align: center; 
  }
  .fallback-notice strong { color: #8a6914; }
`,s=t=>`
  <header style="background: ${t.headerBg||"#ffffff"}; color: ${t.headerText||"#000000"}; padding: 12px 24px; border-bottom: 1px solid #e5e5e5; font-family: 'Segoe UI', system-ui, sans-serif;">
    <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
      <div style="display: flex; align-items: center;">
        <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; margin-right: 16px;">
          <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
          <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
          <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
          <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
        </svg>
        <div style="width: 1px; height: 24px; background: #e1e5e9; margin-right: 16px;"></div>
        <span style="font-weight: 600; font-size: 16px; color: ${t.headerText||"#000000"};">Platform</span>
      </div>
      <nav style="display: flex; gap: 24px;">
        <a href="#" style="color: ${t.headerText||"#000000"}; text-decoration: none; font-size: 14px;">Documentation</a>
        <a href="#" style="color: ${t.headerText||"#000000"}; text-decoration: none; font-size: 14px;">Training</a>
        <a href="#" style="color: ${t.headerText||"#000000"}; text-decoration: none; font-size: 14px;">Certifications</a>
      </nav>
    </div>
  </header>
`,l=(t,i,a)=>{const e=o[a]||o.microsoft;return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platform - ${t}</title>
    <style>
        ${n(e)}
        .hero { 
            background: ${e.headerBg||"#ffffff"}; 
            padding: 80px 0; 
            text-align: center; 
        }
        .hero h1 { 
            font-size: 48px; 
            font-weight: 700; 
            color: ${e.headerText||"#000000"}; 
            color: ${e.text}; 
            margin-bottom: 24px; 
        }
        .hero p { 
            font-size: 20px; 
            color: ${e.textSecondary}; 
            margin-bottom: 32px; 
            max-width: 600px; 
            margin-left: auto; 
            margin-right: auto; 
        }
        .hero-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .features { padding: 80px 0; background: white; }
        .features h2 { 
            text-align: center; 
            font-size: 36px; 
            margin-bottom: 48px; 
            color: ${e.text}; 
        }
        .feature-card { text-align: center; }
        .feature-icon { 
            width: 64px; 
            height: 64px; 
            background: ${e.main}; 
            color: white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 24px; 
            margin: 0 auto 16px; 
        }
        .feature-card h3 { 
            font-size: 20px; 
            color: ${e.text}; 
            margin-bottom: 12px; 
        }
        .feature-card p { 
            color: ${e.textSecondary}; 
            line-height: 1.6; 
        }
    </style>
</head>
<body>
<<<<<<< HEAD
    ${s(e)}
=======
    <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
        <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
            <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 24px; height: 24px; background: ${e.main}; border-radius: 4px;"></div>
                <span style="font-size: 16px; font-weight: 600; color: #24292f;">Platform</span>
            </div>
            <nav class="docs-header-nav" style="display: flex; align-items: center; gap: 24px;">
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Documentation</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Learning Paths</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Certifications</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Q&A</a>
                <button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Sign in</button>
            </nav>
        </div>
    </header>

    <div class="fallback-notice">
        <strong>⚡ Smart Template:</strong> This wireframe was generated using intelligent templates while the AI service is temporarily unavailable.
    </div>
>>>>>>> c45591cd7c4527069b42e97fad093bcdd3b64ed7

    <section class="hero">
        <div class="container">
            <h1>${t}</h1>
            <p>Discover the power of Microsoft technologies through hands-on learning experiences and comprehensive documentation.</p>
            <div class="hero-buttons">
                <a href="#" class="btn-primary">Get Started</a>
                <a href="#" class="btn-secondary">Learn More</a>
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2>Why Choose Our Platform?</h2>
            <div class="grid grid-3">
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Structured Learning</h3>
                    <p>Follow curated learning paths designed by Microsoft experts to master specific technologies.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏆</div>
                    <h3>Certifications</h3>
                    <p>Validate your skills with industry-recognized Microsoft certifications and badges.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <h3>Hands-on Labs</h3>
                    <p>Apply your knowledge with interactive labs and real-world scenarios in the cloud.</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`},c=(t,i,a)=>{const e=o[a]||o.microsoft;return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - ${t}</title>
    <style>
        ${n(e)}
        .main { padding: 24px 0; }
        .dashboard-header { 
            background: white; 
            padding: 32px; 
            border-radius: 8px; 
            margin-bottom: 24px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        .dashboard-header h1 { 
            font-size: 32px; 
            color: ${e.text}; 
            margin-bottom: 8px; 
        }
        .dashboard-header p { 
            color: ${e.textSecondary}; 
            font-size: 16px; 
        }
        .metrics { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 16px; 
            margin-bottom: 32px; 
        }
        .metric-card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            border-left: 4px solid ${e.main}; 
        }
        .metric-value { 
            font-size: 28px; 
            font-weight: 700; 
            color: ${e.main}; 
            margin-bottom: 4px; 
        }
        .metric-label { 
            color: ${e.textSecondary}; 
            font-size: 14px; 
        }
        .chart-placeholder { 
            height: 200px; 
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe); 
            border: 2px dashed ${e.main}; 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: ${e.main}; 
            font-weight: 500; 
            margin-bottom: 24px; 
        }
        .table { 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            overflow: hidden; 
        }
        .table-header { 
            padding: 20px 24px; 
            background: ${e.surface}; 
            font-weight: 600; 
            border-bottom: 1px solid ${e.border}; 
        }
        .table table { 
            width: 100%; 
            border-collapse: collapse; 
        }
        .table th, .table td { 
            padding: 12px 24px; 
            text-align: left; 
            border-bottom: 1px solid ${e.border}; 
        }
        .table th { 
            background: ${e.surface}; 
            font-weight: 600; 
            font-size: 14px; 
        }
        .status.active { 
            background: #e6ffed; 
            color: #107c10; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
        }
        .status.pending { 
            background: #fff4ce; 
            color: #8a6914; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
        }
    </style>
</head>
<body>
    <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
        <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
            <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 24px; height: 24px; background: ${e.main}; border-radius: 4px;"></div>
                <span style="font-size: 16px; font-weight: 600; color: #24292f;">Dashboard</span>
            </div>
            <nav class="docs-header-nav" style="display: flex; align-items: center; gap: 24px;">
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Overview</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Reports</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Analytics</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Settings</a>
                <button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Dashboard</button>
            </nav>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <div class="dashboard-header">
                <h1>${t}</h1>
                <p>Monitor your progress and key metrics in real-time</p>
            </div>

            <div class="metrics">
                <div class="metric-card">
                    <div class="metric-value">2,847</div>
                    <div class="metric-label">Total Users</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">94.2%</div>
                    <div class="metric-label">Success Rate</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">156</div>
                    <div class="metric-label">Active Sessions</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">$47.2K</div>
                    <div class="metric-label">Revenue</div>
                </div>
            </div>

            <div class="chart-placeholder">
                📈 Interactive Chart Would Appear Here
            </div>

            <div class="table">
                <div class="table-header">Recent Activity</div>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>Completed Module 1</td>
                            <td><span class="status active">Active</span></td>
                            <td>2 minutes ago</td>
                        </tr>
                        <tr>
                            <td>Jane Smith</td>
                            <td>Started Assessment</td>
                            <td><span class="status pending">Pending</span></td>
                            <td>5 minutes ago</td>
                        </tr>
                        <tr>
                            <td>Mike Johnson</td>
                            <td>Downloaded Certificate</td>
                            <td><span class="status active">Active</span></td>
                            <td>10 minutes ago</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</body>
</html>`},p=(t,i,a)=>{const e=o[a]||o.microsoft;return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form - ${t}</title>
    <style>
        ${n(e)}
        .main { padding: 40px 0; background: ${e.surface}; min-height: 100vh; }
        .form-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 4px 16px rgba(0,0,0,0.1); 
        }
        .form-header { 
            text-align: center; 
            margin-bottom: 32px; 
        }
        .form-header h1 { 
            font-size: 32px; 
            color: ${e.text}; 
            margin-bottom: 8px; 
        }
        .form-header p { 
            color: ${e.textSecondary}; 
            font-size: 16px; 
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        .form-label { 
            display: block; 
            font-weight: 500; 
            color: ${e.text}; 
            margin-bottom: 6px; 
        }
        .form-input { 
            width: 100%; 
            padding: 12px 16px; 
            border: 1px solid ${e.border}; 
            border-radius: 4px; 
            font-size: 14px; 
            transition: border-color 0.2s; 
        }
        .form-input:focus { 
            outline: none; 
            border-color: ${e.main}; 
            box-shadow: 0 0 0 2px ${e.main}33; 
        }
        .form-textarea { 
            height: 100px; 
            resize: vertical; 
        }
        .form-select { 
            width: 100%; 
            padding: 12px 16px; 
            border: 1px solid ${e.border}; 
            border-radius: 4px; 
            font-size: 14px; 
            background: white; 
        }
        .checkbox-group { 
            display: flex; 
            align-items: center; 
            gap: 8px; 
        }
        .form-submit { 
            width: 100%; 
            background: ${e.main}; 
            color: white; 
            padding: 16px; 
            border: none; 
            border-radius: 4px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            transition: background 0.2s; 
        }
        .form-submit:hover { 
            background: ${e.secondary}; 
        }
    </style>
</head>
<body>
    <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
        <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
            <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
<<<<<<< HEAD
               <img src="/windowsLogo.png" alt="Microsoft Logo" width="24" height="24">
=======
               <img src="dist/windowsLogo.png">
>>>>>>> c45591cd7c4527069b42e97fad093bcdd3b64ed7
                <span style="font-size: 16px; font-weight: 600; color: #24292f;">Microsoft Learn</span>
            </div>
            <nav class="docs-header-nav" style="display: flex; align-items: center; gap: 24px;">
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Forms</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Templates</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Examples</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Support</a>
                <button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Create Form</button>
            </nav>
        </div>
    </header>

    <div class="fallback-notice">
        <strong>⚡ Smart Template:</strong> Form template generated using intelligent patterns.
    </div>

    <main class="main">
        <div class="form-container">
            <div class="form-header">
                <h1>${t}</h1>
                <p>Please fill out the form below with your information</p>
            </div>

            <form>
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" class="form-input" placeholder="Enter your full name" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input type="email" class="form-input" placeholder="your.email@example.com" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-input" placeholder="+1 (555) 123-4567">
                </div>

                <div class="form-group">
                    <label class="form-label">Department</label>
                    <select class="form-select">
                        <option value="">Select Department</option>
                        <option value="engineering">Engineering</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                        <option value="support">Support</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Message</label>
                    <textarea class="form-input form-textarea" placeholder="Enter your message here..."></textarea>
                </div>

                <div class="form-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="newsletter">
                        <label for="newsletter">Subscribe to newsletter</label>
                    </div>
                </div>

                <button type="submit" class="form-submit">Submit Form</button>
            </form>
        </div>
    </main>
</body>
</html>`},f=(t,i,a)=>{const e=o[a]||o.microsoft;return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article - ${t}</title>
    <style>
        ${n(e)}
        .main { padding: 40px 0; }
        .article-container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        .article-header { 
            margin-bottom: 32px; 
            text-align: center; 
        }
        .article-title { 
            font-size: 36px; 
            font-weight: 700; 
            color: ${e.text}; 
            margin-bottom: 16px; 
            line-height: 1.2; 
        }
        .article-meta { 
            color: ${e.textSecondary}; 
            font-size: 14px; 
        }
        .article-content { 
            font-size: 16px; 
            line-height: 1.8; 
        }
        .article-content h2 { 
            font-size: 24px; 
            color: ${e.text}; 
            margin: 32px 0 16px 0; 
            font-weight: 600; 
        }
        .article-content p { 
            margin-bottom: 16px; 
            color: ${e.text}; 
        }
        .article-content ul { 
            margin: 16px 0; 
            padding-left: 24px; 
        }
        .article-content li { 
            margin-bottom: 8px; 
            color: ${e.text}; 
        }
        .highlight { 
            background: #f0f9ff; 
            border-left: 4px solid ${e.main}; 
            padding: 16px 20px; 
            margin: 24px 0; 
            border-radius: 0 4px 4px 0; 
        }
        .code-block { 
            background: #f8fafc; 
            border: 1px solid ${e.border}; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 20px 0; 
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; 
            font-size: 14px; 
            overflow-x: auto; 
        }
        .tags { 
            margin-top: 40px; 
            padding-top: 24px; 
            border-top: 1px solid ${e.border}; 
        }
        .tag { 
            display: inline-block; 
            background: ${e.surface}; 
            color: ${e.text}; 
            padding: 6px 12px; 
            border-radius: 16px; 
            font-size: 12px; 
            margin-right: 8px; 
            margin-bottom: 8px; 
        }
    </style>
</head>
<body>
    <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
        <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
            <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                <img src="/windowsLogo.png" alt="Microsoft Logo" width="24" height="24">
                <span style="font-size: 16px; font-weight: 600; color: #24292f;">Microsoft Learn</span>
            </div>
            <nav class="docs-header-nav" style="display: flex; align-items: center; gap: 24px;">
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Documentation</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Learning Paths</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Certifications</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Q&A</a>
                <button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Browse</button>
            </nav>
        </div>
    </header>
                <nav class="nav">
                    <a href="#">Home</a>
                    <a href="#">Documentation</a>
                    <a href="#">Tutorials</a>
                    <a href="#">API Reference</a>
                </nav>
            </div>
        </div>
    </header>

    <div class="fallback-notice">
        <strong>⚡ Smart Template:</strong> Content template generated using intelligent patterns.
    </div>

    <main class="main">
        <div class="container">
            <article class="article-container">
                <header class="article-header">
                    <h1 class="article-title">${t}</h1>
                    <div class="article-meta">
                        Published on ${new Date().toLocaleDateString()} • 5 min read
                    </div>
                </header>

                <div class="article-content">
                    <p>Welcome to this comprehensive guide about ${t.toLowerCase()}. In this article, you'll learn the essential concepts, best practices, and implementation details.</p>

                    <h2>Overview</h2>
                    <p>This topic covers important aspects that will help you understand and implement the concepts effectively. We'll walk through practical examples and provide detailed explanations.</p>

                    <div class="highlight">
                        <strong>💡 Key Point:</strong> Understanding the fundamentals is crucial before moving to advanced topics.
                    </div>

                    <h2>Getting Started</h2>
                    <p>Let's begin with the basics. Here are the essential steps to get you started:</p>

                    <ul>
                        <li>Understand the core concepts and terminology</li>
                        <li>Set up your development environment</li>
                        <li>Follow the step-by-step implementation guide</li>
                        <li>Test your implementation thoroughly</li>
                    </ul>

                    <h2>Implementation Example</h2>
                    <p>Here's a practical example to demonstrate the concepts:</p>

                    <div class="code-block">
// Example implementation
function example() {
    console.log("This is a sample code block");
    return "Success!";
}

// Call the function
const result = example();
                    </div>

                    <h2>Best Practices</h2>
                    <p>When working with these concepts, consider the following best practices:</p>

                    <ul>
                        <li>Always follow established patterns and conventions</li>
                        <li>Keep your code clean and well-documented</li>
                        <li>Test thoroughly before deploying to production</li>
                        <li>Monitor performance and optimize as needed</li>
                    </ul>

                    <h2>Next Steps</h2>
                    <p>Now that you understand the basics, you can explore more advanced topics and integrate these concepts into your projects.</p>

                    <div class="tags">
                        <span class="tag">Tutorial</span>
                        <span class="tag">Best Practices</span>
                        <span class="tag">Development</span>
                        <span class="tag">Microsoft Learn</span>
                    </div>
                </div>
            </article>
        </div>
    </main>
</body>
</html>`},h=(t,i,a)=>{const e=o[a]||o.microsoft;return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wireframe - ${t}</title>
    <style>
        ${n(e)}
        .main { padding: 40px 0; }
        .hero { 
            background: linear-gradient(135deg, ${e.surface}, #e8f5ff); 
            padding: 60px 0; 
            text-align: center; 
            margin-bottom: 40px; 
        }
        .hero h1 { 
            font-size: 36px; 
            color: ${e.text}; 
            margin-bottom: 16px; 
            font-weight: 600; 
        }
        .hero p { 
            font-size: 18px; 
            color: ${e.textSecondary}; 
            max-width: 600px; 
            margin: 0 auto; 
        }
        .content-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 24px; 
        }
        .content-card h3 { 
            color: ${e.main}; 
            margin-bottom: 12px; 
            font-size: 20px; 
        }
        .content-card p { 
            color: ${e.textSecondary}; 
            margin-bottom: 16px; 
            line-height: 1.6; 
        }
    </style>
</head>
<body>
    <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
        <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
            <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                <img src="/windowsLogo.png" alt="Microsoft Logo" width="24" height="24">
                <span style="font-size: 16px; font-weight: 600; color: #24292f;">Microsoft Learn</span>
            </div>
            <nav class="docs-header-nav" style="display: flex; align-items: center; gap: 24px;">
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Home</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Documentation</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Community</a>
                <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Support</a>
                <button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Get Started</button>
            </nav>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <section class="hero">
                <h1>${t}</h1>
                <p>Custom wireframe generated based on your description. This layout provides a solid foundation for your project.</p>
            </section>

            <div class="content-grid">
                <div class="card content-card">
                    <h3>Getting Started</h3>
                    <p>Learn the fundamentals and build your first application with our guided tutorials.</p>
                    <a href="#" class="btn-primary">Start Learning</a>
                </div>
                <div class="card content-card">
                    <h3>Documentation</h3>
                    <p>Comprehensive guides and API references to help you build amazing applications.</p>
                    <a href="#" class="btn-primary">View Docs</a>
                </div>
                <div class="card content-card">
                    <h3>Community</h3>
                    <p>Connect with other developers and get help from our vibrant community.</p>
                    <a href="#" class="btn-primary">Join Now</a>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`},g=[{condition:t=>/\b(landing|home|welcome|marketing|hero|main\s*page)\b/i.test(t),generator:l,category:"landing"},{condition:t=>/\b(dashboard|analytics|metrics|stats|overview|admin|control\s*panel)\b/i.test(t),generator:c,category:"dashboard"},{condition:t=>/\b(form|input|register|signup|contact|submit|survey)\b/i.test(t),generator:p,category:"form"},{condition:t=>/\b(article|blog|content|documentation|tutorial|guide|post)\b/i.test(t),generator:f,category:"content"}];function m(t){const{description:i,theme:a="microsoft",colorScheme:e="primary"}=t;console.log("🔄 Generating client-side fallback wireframe:",{description:i.substring(0,50)+"...",theme:a,colorScheme:e});const r=g.find(d=>d.condition(i));return r?(console.log(`✅ Using ${r.category} template for fallback`),r.generator(i,a,e)):(console.log("📄 Using generic template for fallback"),h(i,a,e))}export{m as generateFallbackWireframe};
