import React from 'react';

export interface FormTemplate {
    id: string;
    name: string;
    description: string;
    fields: FormField[];
    submitText?: string;
}

export interface FormField {
    type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
    label: string;
    name: string;
    id?: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
    description?: string;
    rows?: number;
    minLength?: number;
}

export const FormTemplates: FormTemplate[] = [
    {
        id: 'contact',
        name: 'Contact Form',
        description: 'Basic contact form with name, email, and message',
        fields: [
            { type: 'text', label: 'Name', name: 'name', required: true, placeholder: 'Your Name' },
            { type: 'email', label: 'Email', name: 'email', required: true, placeholder: 'your@email.com' },
            { type: 'textarea', label: 'Message', name: 'message', required: true, placeholder: 'Your message...' }
        ]
    },
    {
        id: 'login',
        name: 'Login Form',
        description: 'User authentication form',
        fields: [
            { type: 'email', label: 'Email', name: 'email', required: true, placeholder: 'your@email.com' },
            { type: 'password', label: 'Password', name: 'password', required: true },
            { type: 'checkbox', label: 'Remember me', name: 'remember' }
        ]
    },
    {
        id: 'registration',
        name: 'Registration Form',
        description: 'User registration form',
        fields: [
            { type: 'text', label: 'First Name', name: 'firstName', required: true },
            { type: 'text', label: 'Last Name', name: 'lastName', required: true },
            { type: 'email', label: 'Email', name: 'email', required: true },
            { type: 'password', label: 'Password', name: 'password', required: true },
            { type: 'password', label: 'Confirm Password', name: 'confirmPassword', required: true }
        ]
    }
];

export const generateFormHTML = (template: FormTemplate): string => {
    const fieldsHTML = template.fields.map(field => {
        switch (field.type) {
            case 'textarea':
                return `
          <div class="form-field">
            <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
            <textarea 
              id="${field.name}" 
              name="${field.name}" 
              ${field.required ? 'required' : ''}
              placeholder="${field.placeholder || ''}"
            ></textarea>
          </div>
        `;
            case 'select':
                const options = field.options?.map(option => `<option value="${option}">${option}</option>`).join('') || '';
                return `
          <div class="form-field">
            <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
            <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
              ${options}
            </select>
          </div>
        `;
            case 'checkbox':
                return `
          <div class="form-field checkbox-field">
            <input 
              type="checkbox" 
              id="${field.name}" 
              name="${field.name}"
            />
            <label for="${field.name}">${field.label}</label>
          </div>
        `;
            case 'radio':
                const radioOptions = field.options?.map(option => `
          <div class="radio-option">
            <input type="radio" id="${field.name}_${option}" name="${field.name}" value="${option}"/>
            <label for="${field.name}_${option}">${option}</label>
          </div>
        `).join('') || '';
                return `
          <div class="form-field">
            <label>${field.label}${field.required ? ' *' : ''}</label>
            ${radioOptions}
          </div>
        `;
            default:
                return `
          <div class="form-field">
            <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
            <input 
              type="${field.type}" 
              id="${field.name}" 
              name="${field.name}" 
              ${field.required ? 'required' : ''}
              placeholder="${field.placeholder || ''}"
            />
          </div>
        `;
        }
    }).join('');

    return `
    <div class="form-container">
      <form class="generated-form">
        <h2>${template.name}</h2>
        <p class="form-description">${template.description}</p>
        ${fieldsHTML}
        <div class="form-actions">
          <button type="submit" class="submit-btn">Submit</button>
          <button type="reset" class="reset-btn">Reset</button>
        </div>
      </form>
    </div>
    <style>
      .form-container {
        max-width: 500px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #fff;
      }
      .generated-form h2 {
        margin-bottom: 10px;
        color: #333;
      }
      .form-description {
        margin-bottom: 20px;
        color: #666;
        font-style: italic;
      }
      .form-field {
        margin-bottom: 15px;
      }
      .form-field label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
      }
      .form-field input,
      .form-field textarea,
      .form-field select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      .checkbox-field {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .checkbox-field input {
        width: auto;
      }
      .radio-option {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 5px;
      }
      .radio-option input {
        width: auto;
      }
      .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      .submit-btn,
      .reset-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .submit-btn {
        background-color: #007cba;
        color: white;
      }
      .reset-btn {
        background-color: #6c757d;
        color: white;
      }
      .submit-btn:hover {
        background-color: #005a85;
      }
      .reset-btn:hover {
        background-color: #545b62;
      }
    </style>
  `;
};

export default FormTemplates;
