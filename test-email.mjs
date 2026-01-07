// Quick test script to send premium ticket email
const testEmail = async () => {
    const response = await fetch("http://localhost:3000/api/tickets/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            subject: "Test - Premium Email Template",
            message: "This is a test message to verify the new premium ticket confirmation email template.\n\nThe email should include:\n- Beautiful header with logo\n- Department-specific routing\n- Response time estimate\n- CTA button to view tickets\n- Social proof section\n- Mobile-optimized design",
            name: "Alessio Test",
            email: "tortolialessio1997@gmail.com",
            category: "BILLING" // Test with Billing to see department-specific content
        })
    });

    const data = await response.json();
    console.log("Test result:", data);
};

testEmail();
