import Contact from "../models/contact.js";

// POST /api/contact — public
export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        const contact = await Contact.create({ name, email, subject, message });

        res.status(201).json({
            message: "Message sent successfully! We'll get back to you soon.",
            id: contact._id,
        });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ message: "Failed to send message. Please try again." });
    }
};
