/**
 * Seed Email Templates for Admin Quick Replies
 * Run: node backend/seedEmailTemplates.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const emailTemplates = [
    {
        name: 'Project Inquiry Response',
        subject: 'Re: Your Project Inquiry - {{projectTitle}}',
        type: 'custom',
        body: `Hi {{name}},

Thank you for reaching out to us about {{projectTitle}}! We're excited to learn more about your vision.

I've reviewed your project request and I'd love to discuss the details further. Our team specializes in delivering high-quality, production-ready solutions tailored to your needs.

Next Steps:
• I'll prepare a detailed proposal based on your requirements
• We can schedule a call to discuss the scope and timeline
• I'll share some relevant case studies from similar projects

When would be a good time for a quick 15-minute call this week?

Looking forward to working together!

Best regards,
OURS Team`
    },
    {
        name: 'Quote Ready',
        subject: 'Your Custom Quote for {{projectTitle}}',
        type: 'custom',
        body: `Hi {{name}},

Great news! I've prepared a custom quote for {{projectTitle}}.

Based on your requirements, here's what we can deliver:

**Deliverables:**
✓ Fully functional web application
✓ Responsive design (mobile + desktop)
✓ Source code ownership
✓ 30 days post-launch support

**Timeline:** 14-21 days
**Investment:** $XX,XXX (Custom quote attached)

This includes everything you mentioned in your request. I've also added some recommendations that will enhance the user experience.

Ready to get started? Simply reply to this email and we'll send over the contract.

Best,
OURS Team`
    },
    {
        name: 'Project Accepted - Next Steps',
        subject: 'Welcome to OURS - Let\'s Build {{projectTitle}}!',
        type: 'custom',
        body: `Hi {{name}},

Fantastic news! We're officially onboarding {{projectTitle}} 🚀

Here's what happens next:

**Week 1: Discovery & Planning**
• Kickoff call scheduled for [DATE/TIME]
• Finalize wireframes and design direction
• Set up project tracking system

**Week 2-3: Development**
• Daily progress updates via [preferred channel]
• Weekly demo sessions
• Continuous feedback loop

**Week 4: Launch Prep**
• Final testing and bug fixes
• Deployment to production
• Knowledge transfer & documentation

I'll send over the onboarding documents shortly. In the meantime, please confirm the kickoff call works for you.

Excited to build something amazing together!

Best,
OURS Team`
    },
    {
        name: 'Rush Request Confirmation',
        subject: '[RUSH] Confirmed: {{projectTitle}} - 7 Day Delivery',
        type: 'custom',
        body: `Hi {{name}},

Your rush request for {{projectTitle}} has been confirmed! ⚡

**Priority Build Details:**
• Start Date: [TODAY'S DATE]
• Delivery Date: [7 DAYS FROM NOW]
• Dedicated developer assigned
• Daily stand-ups

**What You Can Expect:**
✓ Rapid prototyping (Day 1-2)
✓ Core features (Day 3-5)
✓ Testing & polish (Day 6-7)
✓ On-time delivery guarantee

Our team is already prepping the environment. You'll receive:
• Daily video updates
• Access to staging environment (Day 2)
• Direct Slack channel with your developer

The countdown starts now. Let's make this happen!

Best,
OURS Team`
    },
    {
        name: 'Need More Information',
        subject: 'Quick Question About {{projectTitle}}',
        type: 'custom',
        body: `Hi {{name}},

Thanks for your interest in building {{projectTitle}} with us!

To prepare the most accurate proposal, I need a bit more information:

1. **Target Audience:** Who will be using this application?
2. **Must-Have Features:** What are the top 3 features that absolutely need to be in v1?
3. **Integrations:** Do you need any third-party integrations (payment, auth, analytics)?
4. **Design Preferences:** Any websites/apps whose design you love?

No worries if you don't have all the answers yet - we can figure it out together on a call.

Would you prefer to:
a) Reply to this email with the details
b) Schedule a 20-min call to discuss

Looking forward to hearing from you!

Best,
OURS Team`
    },
    {
        name: 'Follow-Up (No Response)',
        subject: 'Still Interested in {{projectTitle}}?',
        type: 'custom',
        body: `Hi {{name}},

I wanted to follow up on the project inquiry you submitted for {{projectTitle}}.

I know things get busy, so I wanted to check in - are you still interested in moving forward?

If now isn't the right time, no problem at all! Just let me know and I'll keep your details on file for when you're ready.

If you'd like to proceed, I'm here to answer any questions and get the ball rolling.

Best,
OURS Team`
    }
];

async function seedTemplates() {
    console.log('🌱 Seeding email templates...');

    try {
        for (const template of emailTemplates) {
            await db.collection('email_templates').add({
                ...template,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Created: ${template.name}`);
        }

        console.log('\n✨ All email templates seeded successfully!');
        console.log('\nYou can now use these templates in:');
        console.log('Admin > Requests > Reply with Template');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding templates:', error);
        process.exit(1);
    }
}

seedTemplates();
