import { collection, addDoc, serverTimestamp, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from './firebase';

// This is a placeholder for the SendGrid integration.
// In a real application, you should call a backend endpoint (e.g. Firebase Cloud Function)
// to send the email securely using the SendGrid API Key (server-side only).

export const sendEmail = async (to: string, templateType: string, checkData: any) => {
    console.log(`[EmailService] Attempting to send '${templateType}' email to ${to}`);

    try {
        // 1. Fetch Template from Firestore
        const q = query(collection(db, 'email_templates'), where('type', '==', templateType), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.warn(`[EmailService] No template found for type '${templateType}'`);
            return;
        }

        const template = snapshot.docs[0].data();
        let subject = template.subject;
        let body = template.body;

        // 2. Simple Variable Replacement
        // This is a basic implementation. Ideally use a library like Handlebars/Mustache on the backend.
        const replacements: Record<string, string> = {
            '{{name}}': checkData.name || 'User',
            '{{orderId}}': checkData.orderId || 'N/A',
            '{{amount}}': checkData.amount || '0.00',
            '{{projectTitle}}': checkData.projectTitle || 'Product'
        };

        for (const [key, value] of Object.entries(replacements)) {
            subject = subject.replace(new RegExp(key, 'g'), value);
            body = body.replace(new RegExp(key, 'g'), value);
        }

        // 3. Log the email (Simulation)
        // In production, you would make a POST request to your backend here.
        // const response = await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to, subject, html: body }) });

        console.group("📧 SENT EMAIL (SIMULATION)");
        console.log("To:", to);
        console.log("Subject:", subject);
        console.log("Body Preview:", body.substring(0, 100) + "...");
        console.groupEnd();

        // 4. (Optional) Log to an 'email_logs' collection in Firestore for audit
        await addDoc(collection(db, 'email_logs'), {
            to,
            templateType,
            subject,
            sentAt: serverTimestamp(),
            status: 'simulated'
        });

        return true;

    } catch (error) {
        console.error("[EmailService] Failed to send email:", error);
        return false;
    }
};
