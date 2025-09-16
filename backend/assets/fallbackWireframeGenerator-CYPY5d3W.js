var b=Object.defineProperty,y=Object.defineProperties;var v=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var w=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var m=(e,a,i)=>a in e?b(e,a,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[a]=i,x=(e,a)=>{for(var i in a||(a={}))w.call(a,i)&&m(e,i,a[i]);if(h)for(var i of h(a))$.call(a,i)&&m(e,i,a[i]);return e},f=(e,a)=>y(e,v(a));const s={primary:{main:"#8E9AAF",secondary:"#68769C",bg:"#F8F9FA",surface:"#FFFFFF",text:"#3C4858",textSecondary:"#8E9AAF",border:"#DEE2E6",accent:"#68769C",headerBg:"#FFFFFF",headerText:"#3C4858"},secondary:{main:"#CBC2C2",secondary:"#8E9AAF",bg:"#F8F9FA",surface:"#FFFFFF",text:"#3C4858",textSecondary:"#68769C",border:"#E9ECEF",accent:"#68769C",headerBg:"#FFFFFF",headerText:"#3C4858"},dark:{main:"#3C4858",secondary:"#68769C",bg:"#8E9AAF",surface:"#CBC2C2",text:"#FFFFFF",textSecondary:"#F8F9FA",border:"#68769C",accent:"#CBC2C2",headerBg:"#3C4858",headerText:"#FFFFFF"},light:{main:"#E9ECEF",secondary:"#CBC2C2",bg:"#FFFFFF",surface:"#F8F9FA",text:"#3C4858",textSecondary:"#8E9AAF",border:"#E9ECEF",accent:"#68769C",headerBg:"#F8F9FA",headerText:"#3C4858"}};function F(e){const a=e.replace("#","").trim();if(a.length===3){const i=parseInt(a[0]+a[0],16),o=parseInt(a[1]+a[1],16),t=parseInt(a[2]+a[2],16);return{r:i,g:o,b:t}}if(a.length===6){const i=parseInt(a.slice(0,2),16),o=parseInt(a.slice(2,4),16),t=parseInt(a.slice(4,6),16);return{r:i,g:o,b:t}}return null}function u(e){const a=F(e);if(!a)return 0;const i=r=>{const g=r/255;return g<=.03928?g/12.92:Math.pow((g+.055)/1.055,2.4)},o=i(a.r),t=i(a.g),n=i(a.b);return .2126*o+.7152*t+.0722*n}function c(e,a){const i=u(e),o=u(a),t=Math.max(i,o),n=Math.min(i,o);return(t+.05)/(n+.05)}function d(e,a=4.5){const i="#111111",o="#FFFFFF",t=c(i,e),n=c(o,e);return t>=a&&n>=a?t>=n?i:o:t>=a?i:n>=a?o:t>=n?i:o}function l(e){var i,o,t;const a=f(x({},e),{accessibleOnMain:d(e.main),accessibleOnSecondary:d(e.secondary),accessibleOnHeaderBg:d(e.headerBg||e.surface||e.bg),accessibleOnAccent:d(e.accent||e.main),_accessibilityAdjustments:[]});if(e.headerText&&e.headerBg){const n=c(e.headerText,e.headerBg);if(n<4.5){const r=d(e.headerBg);r!==e.headerText&&((i=a._accessibilityAdjustments)==null||i.push(`headerText modified (${e.headerText} -> ${r}) contrast=${n.toFixed(2)}`),a.headerText=r)}}if(e.text&&e.bg){const n=c(e.text,e.bg);if(n<4.5){const r=d(e.bg);r!==e.text&&((o=a._accessibilityAdjustments)==null||o.push(`text modified (${e.text} -> ${r}) contrast=${n.toFixed(2)}`),a.text=r)}}if(e.textSecondary&&e.bg){const n=c(e.textSecondary,e.bg);if(n<3){const r=d(e.bg,3);r!==e.textSecondary&&((t=a._accessibilityAdjustments)==null||t.push(`textSecondary modified (${e.textSecondary} -> ${r}) contrast=${n.toFixed(2)}`),a.textSecondary=r)}}return a}const p=e=>`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
    background: ${e.bg}; 
    color: ${e.text}; 
    line-height: 1.6; 
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .header { 
    background: ${e.headerBg||"#ffffff"}; 
    padding: 16px 0; 
    border-bottom: 1px solid ${e.border}; 
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
    color: ${e.headerText||"#000000"}; 
  }
  .nav { display: flex; gap: 24px; }
  .nav a { 
    color: ${e.headerText||"#000000"}; 
    text-decoration: none; 
    font-weight: 500; 
    transition: color 0.2s; 
  }
  .nav a:hover { color: ${e.main}; }
    .btn-primary { 
        background: ${e.main}; 
        color: ${e.accessibleOnMain}; 
    padding: 12px 24px; 
    border: none; 
    border-radius: 4px; 
    font-weight: 500; 
    text-decoration: none; 
    display: inline-block; 
    transition: background 0.2s; 
    cursor: pointer; 
  }
    .btn-primary:hover { background: ${e.secondary}; color: ${e.accessibleOnSecondary}; }
  .btn-secondary { 
    background: transparent; 
    color: ${e.main}; 
    padding: 12px 24px; 
    border: 1px solid ${e.main}; 
    border-radius: 4px; 
    font-weight: 500; 
    text-decoration: none; 
    display: inline-block; 
    transition: all 0.2s; 
    cursor: pointer; 
  }
    .btn-secondary:hover { 
        background: ${e.main}; 
        color: ${e.accessibleOnMain}; 
    }
  .card { 
    background: white; 
    padding: 24px; 
    border-radius: 8px; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
    border: 1px solid ${e.border}; 
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
`,k=e=>`
  <header style="background: ${e.headerBg||"#ffffff"}; color: ${e.headerText||"#000000"}; padding: 12px 24px; border-bottom: 1px solid #e5e5e5; font-family: 'Segoe UI', system-ui, sans-serif;">
    <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
      <div style="display: flex; align-items: center;">
        <div style="width: 32px; height: 32px; background: ${e.main}; border-radius: 6px; margin-right: 16px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 16px; height: 16px; background: ${e.accessibleOnMain}; border-radius: 2px;"></div>
        </div>
        <span style="font-weight: 600; font-size: 16px; color: ${e.headerText||"#000000"};">Platform</span>
      </div>
      <nav style="display: flex; gap: 24px;">
        <a href="#" style="color: ${e.headerText||"#000000"}; text-decoration: none; font-size: 14px;">Documentation</a>
        <a href="#" style="color: ${e.headerText||"#000000"}; text-decoration: none; font-size: 14px;">Training</a>
        <a href="#" style="color: ${e.headerText||"#000000"}; text-decoration: none; font-size: 14px;">Certifications</a>
      </nav>
    </div>
  </header>
`,A=(e,a,i)=>{const o=s[i]||s.primary,t=l(o);return t._accessibilityAdjustments&&t._accessibilityAdjustments.length&&console.log("♿ Accessibility adjustments applied (landing template):",t._accessibilityAdjustments),`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platform - ${e}</title>
    <style>
        ${p(t)}
        .hero { 
            background: ${t.headerBg||"#ffffff"}; 
            padding: 80px 0; 
            text-align: center; 
        }
        .hero h1 { 
            font-size: 48px; 
            font-weight: 700; 
            color: ${t.headerText||"#000000"}; 
            color: ${t.text}; 
            margin-bottom: 24px; 
        }
        .hero p { 
            font-size: 20px; 
            color: ${t.textSecondary}; 
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
            color: ${t.text}; 
        }
        .feature-card { text-align: center; }
        .feature-icon { 
            width: 64px; 
            height: 64px; 
            background: ${t.main}; 
            color: ${t.accessibleOnMain}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 24px; 
            margin: 0 auto 16px; 
        }
        .feature-card h3 { 
            font-size: 20px; 
            color: ${t.text}; 
            margin-bottom: 12px; 
        }
        .feature-card p { 
            color: ${t.textSecondary}; 
            line-height: 1.6; 
        }
    </style>
</head>
<body>
    ${k(t)}
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
</html>`},C=(e,a,i)=>{const o=s[i]||s.primary,t=l(o);return t._accessibilityAdjustments&&t._accessibilityAdjustments.length&&console.log("♿ Accessibility adjustments applied (dashboard template):",t._accessibilityAdjustments),`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - ${e}</title>
    <style>
        ${p(t)}
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
            color: ${t.text}; 
            margin-bottom: 8px; 
        }
        .dashboard-header p { 
            color: ${t.textSecondary}; 
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
            border-left: 4px solid ${t.main}; 
        }
        .metric-value { 
            font-size: 28px; 
            font-weight: 700; 
            color: ${t.main}; 
            margin-bottom: 4px; 
        }
        .metric-label { 
            color: ${t.textSecondary}; 
            font-size: 14px; 
        }
        .chart-placeholder { 
            height: 200px; 
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe); 
            border: 2px dashed ${t.main}; 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: ${t.main}; 
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
            background: ${t.surface}; 
            font-weight: 600; 
            border-bottom: 1px solid ${t.border}; 
        }
        .table table { 
            width: 100%; 
            border-collapse: collapse; 
        }
        .table th, .table td { 
            padding: 12px 24px; 
            text-align: left; 
            border-bottom: 1px solid ${t.border}; 
        }
        .table th { 
            background: ${t.surface}; 
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
    <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
        <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
            <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 24px; height: 24px; background: ${t.main}; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 12px; height: 12px; background: ${t.accessibleOnMain}; border-radius: 2px;"></div>
                </div>
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
                <h1>${e}</h1>
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
</html>`},z=(e,a,i)=>{const o=s[i]||s.primary,t=l(o);return t._accessibilityAdjustments&&t._accessibilityAdjustments.length&&console.log("♿ Accessibility adjustments applied (form template):",t._accessibilityAdjustments),`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form - ${e}</title>
    <style>
        ${p(t)}
        .main { padding: 40px 0; background: ${t.surface}; min-height: 100vh; }
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
            color: ${t.text}; 
            margin-bottom: 8px; 
        }
        .form-header p { 
            color: ${t.textSecondary}; 
            font-size: 16px; 
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        .form-label { 
            display: block; 
            font-weight: 500; 
            color: ${t.text}; 
            margin-bottom: 6px; 
        }
        .form-input { 
            width: 100%; 
            padding: 12px 16px; 
            border: 1px solid ${t.border}; 
            border-radius: 4px; 
            font-size: 14px; 
            transition: border-color 0.2s; 
        }
        .form-input:focus { 
            outline: none; 
            border-color: ${t.main}; 
            box-shadow: 0 0 0 2px ${t.main}33; 
        }
        .form-textarea { 
            height: 100px; 
            resize: vertical; 
        }
        .form-select { 
            width: 100%; 
            padding: 12px 16px; 
            border: 1px solid ${t.border}; 
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
            background: ${t.main}; 
            color: ${t.accessibleOnMain}; 
            padding: 16px; 
            border: none; 
            border-radius: 4px; 
            font-size: 16px; 
            font-weight: 600; 
            cursor: pointer; 
            transition: background 0.2s; 
        }
        .form-submit:hover { 
            background: ${t.secondary}; 
            color: ${t.accessibleOnSecondary};
        }
    </style>
</head>
<body>
    <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
        <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
            <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 24px; height: 24px; background: ${t.main}; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 12px; height: 12px; background: ${t.accessibleOnMain}; border-radius: 2px;"></div>
                </div>
                <span style="font-size: 16px; font-weight: 600; color: #24292f;">Platform</span>
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
                <h1>${e}</h1>
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
</html>`},S=(e,a,i)=>{const o=s[i]||s.primary,t=l(o);return t._accessibilityAdjustments&&t._accessibilityAdjustments.length&&console.log("♿ Accessibility adjustments applied (content template):",t._accessibilityAdjustments),`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article - ${e}</title>
    <style>
        ${p(t)}
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
            color: ${t.text}; 
            margin-bottom: 16px; 
            line-height: 1.2; 
        }
        .article-meta { 
            color: ${t.textSecondary}; 
            font-size: 14px; 
        }
        .article-content { 
            font-size: 16px; 
            line-height: 1.8; 
        }
        .article-content h2 { 
            font-size: 24px; 
            color: ${t.text}; 
            margin: 32px 0 16px 0; 
            font-weight: 600; 
        }
        .article-content p { 
            margin-bottom: 16px; 
            color: ${t.text}; 
        }
        .article-content ul { 
            margin: 16px 0; 
            padding-left: 24px; 
        }
        .article-content li { 
            margin-bottom: 8px; 
            color: ${t.text}; 
        }
        .highlight { 
            background: #f0f9ff; 
            border-left: 4px solid ${t.main}; 
            padding: 16px 20px; 
            margin: 24px 0; 
            border-radius: 0 4px 4px 0; 
        }
        .code-block { 
            background: #f8fafc; 
            border: 1px solid ${t.border}; 
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
            border-top: 1px solid ${t.border}; 
        }
        .tag { 
            display: inline-block; 
            background: ${t.surface}; 
            color: ${t.text}; 
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
                <div style="width: 24px; height: 24px; background: ${t.main}; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 12px; height: 12px; background: ${t.accessibleOnMain}; border-radius: 2px;"></div>
                </div>
                <span style="font-size: 16px; font-weight: 600; color: #24292f;">Articles</span>
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
                    <h1 class="article-title">${e}</h1>
                    <div class="article-meta">
                        Published on ${new Date().toLocaleDateString()} • 5 min read
                    </div>
                </header>

                <div class="article-content">
                    <p>Welcome to this comprehensive guide about ${e.toLowerCase()}. In this article, you'll learn the essential concepts, best practices, and implementation details.</p>

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
                        <span class="tag">Platform</span>
                    </div>
                </div>
            </article>
        </div>
    </main>
</body>
</html>`},T=(e,a,i)=>{const o=s[i]||s.primary,t=l(o);return t._accessibilityAdjustments&&t._accessibilityAdjustments.length&&console.log("♿ Accessibility adjustments applied (generic template):",t._accessibilityAdjustments),`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wireframe - ${e}</title>
    <style>
        ${p(t)}
        .main { padding: 40px 0; }
        .hero { 
            background: linear-gradient(135deg, ${t.surface}, #e8f5ff); 
            padding: 60px 0; 
            text-align: center; 
            margin-bottom: 40px; 
        }
        .hero h1 { 
            font-size: 36px; 
            color: ${t.text}; 
            margin-bottom: 16px; 
            font-weight: 600; 
        }
        .hero p { 
            font-size: 18px; 
            color: ${t.textSecondary}; 
            max-width: 600px; 
            margin: 0 auto; 
        }
        .content-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 24px; 
        }
        .content-card h3 { 
            color: ${t.main}; 
            margin-bottom: 12px; 
            font-size: 20px; 
        }
        .content-card p { 
            color: ${t.textSecondary}; 
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
                <h1>${e}</h1>
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
</html>`},j=[{condition:e=>/\b(landing|home|welcome|marketing|hero|main\s*page)\b/i.test(e),generator:A,category:"landing"},{condition:e=>/\b(dashboard|analytics|metrics|stats|overview|admin|control\s*panel)\b/i.test(e),generator:C,category:"dashboard"},{condition:e=>/\b(form|input|register|signup|contact|submit|survey)\b/i.test(e),generator:z,category:"form"},{condition:e=>/\b(article|blog|content|documentation|tutorial|guide|post)\b/i.test(e),generator:S,category:"content"}];function M(e){const{description:a,theme:i="microsoft",colorScheme:o="primary"}=e;console.log("🔄 Generating client-side fallback wireframe:",{description:a.substring(0,50)+"...",theme:i,colorScheme:o});const t=j.find(n=>n.condition(a));return t?(console.log(`✅ Using ${t.category} template for fallback`),t.generator(a,i,o)):(console.log("📄 Using generic template for fallback"),T(a,i,o))}export{M as generateFallbackWireframe};
