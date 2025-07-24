/**
 * EmailJS Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Go to https://dashboard.emailjs.com/ and create an account
 * 2. Create a new service (Gmail, Outlook, etc.)
 * 3. Create a new email template
 * 4. Get your credentials and add them to your .env.local file:
 * 
 * Create a .env.local file in your project root with:
 * 
 * NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
 * NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here  
 * NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
 * 
 * TEMPLATE SETUP:
 * In your EmailJS template, use these variable names:
 * - {{to_email}} - Will be mbanoub@lyrise.ai
 * - {{from_name}} - User's name
 * - {{user_email}} - User's email
 * - {{message}} - Complete formatted message with all ROI data
 * 
 * Template example:
 * Subject: New ROI Calculator Lead - {{from_name}}
 * 
 * Body:
 * {{message}}
 * 
 * Reply to: {{user_email}}
 */

export const emailjsConfig = {
    publicKey: 'NuOJOwC8R35zcg5x8' || '',
    serviceId: 'service_m7gd6z6',
    templateId: 'template_e6mipwz',
} 