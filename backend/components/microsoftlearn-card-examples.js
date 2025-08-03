// Microsoft Learn Card Pattern for the wireframe generator
// This can be injected into the OpenAI prompt or used as a fallback example

const microsoftLearnCardExample = `
<div class="ms-learn-card">
  <div class="ms-learn-card-header">
    <div class="ms-learn-card-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
      </svg>
    </div>
    <div class="ms-learn-card-type">Learning path</div>
  </div>
  <div class="ms-learn-card-content">
    <h3 class="ms-learn-card-title">Introduction to Microsoft Azure</h3>
    <p class="ms-learn-card-description">Learn the fundamentals of cloud computing with Azure and get started with Azure development.</p>
    <div class="ms-learn-card-metadata">
      <div class="ms-learn-card-meta-item">
        <span class="ms-learn-card-meta-label">Modules:</span>
        <span class="ms-learn-card-meta-value">6</span>
      </div>
      <div class="ms-learn-card-meta-item">
        <span class="ms-learn-card-meta-label">Time:</span>
        <span class="ms-learn-card-meta-value">4 hours</span>
      </div>
      <div class="ms-learn-card-meta-item">
        <span class="ms-learn-card-meta-label">Level:</span>
        <span class="ms-learn-card-meta-value">Beginner</span>
      </div>
    </div>
  </div>
  <div class="ms-learn-card-footer">
    <button class="ms-learn-card-button">Get started</button>
  </div>
</div>

<!-- Card Grid Example -->
<div class="ms-learn-card-grid">
  <div class="ms-learn-card">
    <div class="ms-learn-card-header">
      <div class="ms-learn-card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
        </svg>
      </div>
      <div class="ms-learn-card-type">Learning path</div>
    </div>
    <div class="ms-learn-card-content">
      <h3 class="ms-learn-card-title">Azure Fundamentals</h3>
      <p class="ms-learn-card-description">Learn Azure fundamentals with hands-on exercises.</p>
      <div class="ms-learn-card-metadata">
        <div class="ms-learn-card-meta-item">
          <span class="ms-learn-card-meta-label">Modules:</span>
          <span class="ms-learn-card-meta-value">6</span>
        </div>
        <div class="ms-learn-card-meta-item">
          <span class="ms-learn-card-meta-label">Time:</span>
          <span class="ms-learn-card-meta-value">4h</span>
        </div>
      </div>
    </div>
    <div class="ms-learn-card-footer">
      <button class="ms-learn-card-button">Start</button>
    </div>
  </div>
  
  <div class="ms-learn-card module">
    <div class="ms-learn-card-header">
      <div class="ms-learn-card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-4v2H9V2H5v2H3a2 2 0 0 0-2 2zm2 0h14v14H5V6zm2 2v2h10V8H7zm0 4v2h10v-2H7zm0 4v2h7v-2H7z"/>
        </svg>
      </div>
      <div class="ms-learn-card-type">Module</div>
    </div>
    <div class="ms-learn-card-content">
      <h3 class="ms-learn-card-title">Cloud Computing Concepts</h3>
      <p class="ms-learn-card-description">Understanding cloud services and deployment models.</p>
      <div class="ms-learn-card-metadata">
        <div class="ms-learn-card-meta-item">
          <span class="ms-learn-card-meta-label">Units:</span>
          <span class="ms-learn-card-meta-value">5</span>
        </div>
        <div class="ms-learn-card-meta-item">
          <span class="ms-learn-card-meta-label">Time:</span>
          <span class="ms-learn-card-meta-value">45m</span>
        </div>
      </div>
    </div>
    <div class="ms-learn-card-footer">
      <button class="ms-learn-card-button">Start</button>
    </div>
  </div>

  <div class="ms-learn-card certification">
    <div class="ms-learn-card-header">
      <div class="ms-learn-card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"/>
        </svg>
      </div>
      <div class="ms-learn-card-type">Certification</div>
    </div>
    <div class="ms-learn-card-content">
      <h3 class="ms-learn-card-title">AZ-900: Azure Fundamentals</h3>
      <p class="ms-learn-card-description">Prove your knowledge of cloud concepts and Azure services.</p>
      <div class="ms-learn-card-metadata">
        <div class="ms-learn-card-meta-item">
          <span class="ms-learn-card-meta-label">Exam:</span>
          <span class="ms-learn-card-meta-value">AZ-900</span>
        </div>
        <div class="ms-learn-card-meta-item">
          <span class="ms-learn-card-meta-label">Prep:</span>
          <span class="ms-learn-card-meta-value">10h</span>
        </div>
      </div>
    </div>
    <div class="ms-learn-card-footer">
      <button class="ms-learn-card-button">Prepare</button>
    </div>
  </div>
</div>`;

module.exports = {
  microsoftLearnCardExample,
};
