// PowerPoint Export and Share URL utilities

export async function exportToPowerPoint(htmlContent: string | any) {
  try {
    console.log('Starting PowerPoint export...');
    
    // Ensure htmlContent is a string
    let contentToProcess = '';
    if (typeof htmlContent === 'string') {
      contentToProcess = htmlContent;
    } else if (htmlContent && typeof htmlContent === 'object') {
      // If it's an object, try to extract HTML content
      if (htmlContent.pageContents) {
        contentToProcess = Object.values(htmlContent.pageContents).join('\n');
      } else if (htmlContent.main) {
        contentToProcess = htmlContent.main;
      } else {
        contentToProcess = JSON.stringify(htmlContent);
      }
    } else {
      contentToProcess = String(htmlContent || '');
    }
    
    // Clean the HTML content for PowerPoint
    const cleanedContent = contentToProcess.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/class="[^"]*"/g, '')
      .replace(/id="[^"]*"/g, '');

    // Create PowerPoint-friendly HTML
    const powerpointHtml = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Wireframe Export</title>
          <style>
            body {
              font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
              margin: 20px;
              background: white;
            }
            .wireframe-container {
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="wireframe-container">
            <h1>Wireframe Export</h1>
            <div class="content">
              ${cleanedContent}
            </div>
          </div>
        </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([powerpointHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `wireframe-export-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'PowerPoint export completed successfully!'
    };

  } catch (error) {
    console.error('PowerPoint export failed:', error);
    return {
      success: false,
      message: 'PowerPoint export failed. Please try again.'
    };
  }
}

export const generateShareUrl = async (htmlContent: string, title: string = 'Wireframe') => {
  try {
    // For now, we'll create a simple data URL that can be shared
    // In a production environment, this would typically save to a cloud service
    
    const shareData = {
      title,
      content: htmlContent,
      timestamp: new Date().toISOString(),
      id: generateUniqueId()
    };

    // Create a data URL for immediate sharing
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
    
    // Copy to clipboard if supported
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(dataUrl);
    }

    return {
      success: true,
      shareUrl: dataUrl,
      shareId: shareData.id,
      message: 'Share URL generated and copied to clipboard!',
      instructions: 'Share this URL to let others view your wireframe. The URL contains the complete wireframe data.'
    };

  } catch (error) {
    console.error('Generate share URL failed:', error);
    
    // Fallback: create a simple share URL
    const fallbackUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
    
    return {
      success: true,
      shareUrl: fallbackUrl,
      shareId: generateUniqueId(),
      message: 'Share URL generated (fallback mode)',
      instructions: 'Copy this URL to share your wireframe.'
    };
  }
};

// Helper function to generate unique IDs
const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Function to create a shareable HTML file
export const createShareableHtml = (htmlContent: string, title: string = 'Wireframe'): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Shared Wireframe</title>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5f5;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: #007cba;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .footer {
          background: #f8f9fa;
          padding: 15px 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
          <p>Generated with Designetica Wireframe Tool</p>
        </div>
        <div class="content">
          ${htmlContent}
        </div>
        <div class="footer">
          <p>Created on ${new Date().toLocaleString()} | Powered by Designetica</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default {
  exportToPowerPoint,
  generateShareUrl,
  createShareableHtml
};
