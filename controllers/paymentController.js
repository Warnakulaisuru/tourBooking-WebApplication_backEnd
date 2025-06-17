import Booking from '../models/Booking.js';
import nodemailer from 'nodemailer';

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Missing booking ID" });
    }

    console.log("Verifying payment for booking:", bookingId);

    // Update booking status to "paid"
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: "paid",
        paymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Setup transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    // Mail to Admin
    const adminMailOptions = {
      from: `"Tour Booking System" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Payment received for Booking ID: ${bookingId}`,
      html: `
        <h3>Payment Received</h3>
        <p>The following booking has been marked as <strong>paid</strong>:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${updatedBooking._id}</li>
          <li><strong>Tour Name:</strong> ${updatedBooking.tourName}</li>
          <li><strong>User Email:</strong> ${updatedBooking.userEmail}</li>
          <li><strong>Payment ID:</strong> ${razorpay_payment_id}</li>
          <li><strong>Guest Size:</strong> ${updatedBooking.guestSize}</li>
          <li><strong>Booking Date:</strong> ${new Date(updatedBooking.bookAt).toLocaleDateString()}</li>
        </ul>
      `,
    };

    // Mail to User
    const userMailOptions = {
      from: `"Tour Booking System" <${process.env.ADMIN_EMAIL}>`,
      to: updatedBooking.userEmail,
      subject: `Your booking for "${updatedBooking.tourName}" is confirmed!`,
      html: `
        <h3>Hello ${updatedBooking.fullName || "Customer"},</h3>
        <p>Thank you for your payment. Your booking for the tour "<strong>${updatedBooking.tourName}</strong>" has been successfully marked as paid.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li><strong>Booking ID:</strong> ${updatedBooking._id}</li>
          <li><strong>Guest Size:</strong> ${updatedBooking.guestSize}</li>
          <li><strong>Booking Date:</strong> ${new Date(updatedBooking.bookAt).toLocaleDateString()}</li>
        </ul>
        <p>We look forward to hosting you on the tour. If you have any questions, please contact us.</p>
        <br />
        <p>Best regards,<br />Tour Booking Team</p>
      `,
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(200).json({
      message: "✅ Payment verified, booking marked as paid, and emails sent to admin and user.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
