import Booking from "../models/Booking.js";
import nodemailer from "nodemailer"; 

// Create new booking
export const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    res.status(200).json({
      success: true,
      message: "Your tour is booked",
      data: savedBooking,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get single booking
export const getBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Booking.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Successful",
      data: book,
    });
  } catch (err) {
    console.error("getBooking error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all bookings
export const getAllBooking = async (req, res) => {
  console.log("getAllBooking called by user:", req.user);
  try {
    const books = await Booking.find();
    console.log("Bookings fetched:", books.length);
    res.status(200).json({
      success: true,
      message: "Successful",
      data: books,
    });
  } catch (err) {
    console.error("getAllBooking error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// // Confirm booking
// export const confirmBooking = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updated = await Booking.findByIdAndUpdate(
//       id,
//       { status: "confirmed" },
//       { new: true }
//     );
//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Booking confirmed",
//       data: updated,
//     });
//   } catch (err) {
//     console.error("confirmBooking error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Unable to confirm booking",
//     });
//   }
// };

// // Delete booking
// export const deleteBooking = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deleted = await Booking.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Booking deleted",
//     });
//   } catch (err) {
//     console.error("deleteBooking error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Unable to delete booking",
//     });
//   }
// };

export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the booking first to get user info
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Delete the booking
    await Booking.findByIdAndDelete(id);

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    // Prepare email content
    const mailOptions = {
      from: `"Tour Booking" <${process.env.ADMIN_EMAIL}>`,
      to: booking.userEmail,
      subject: "Your Tour Booking was Cancelled",
      html: `
        <h3>Hello ${booking.fullName},</h3>
        <p>We regret to inform you that your booking for the tour "<strong>${booking.tourName}</strong>" has been cancelled.</p>
        <p><strong>Original Booking Date:</strong> ${new Date(booking.bookAt).toLocaleDateString()}</p>
        <p>If you have any questions or wish to make a new booking, please contact us.</p>
        <br/>
        <p>Thank you for using our service.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Booking deleted and cancellation email sent",
    });
  } catch (err) {
    console.error("deleteBooking error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to delete booking",
    });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "confirmed" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Send email to user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

const paymentUrl = `${process.env.FRONTEND_BASE_URL}/payment/${updatedBooking._id}`;

    const mailOptions = {
  from: `"Tour Booking" <${process.env.ADMIN_EMAIL}>`,
  to: updatedBooking.userEmail,
  subject: "Your Tour Booking is Confirmed!",
  html: `
    <h3>Hello ${updatedBooking.fullName},</h3>
    <p>Your booking for the tour "<strong>${updatedBooking.tourName}</strong>" has been confirmed.</p>
    <p><strong>Booking Date:</strong> ${new Date(updatedBooking.bookAt).toLocaleDateString()}</p>
    <p><strong>Guest Size:</strong> ${updatedBooking.guestSize}</p>

    <p>Please complete your payment by clicking the button below:</p>
    <a href="${paymentUrl}" style="
      background-color: #2B7A78;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 6px;
      display: inline-block;
    ">Pay Now</a>

    <br/><br/>
    <p>If you prefer, you can pay via:</p>
    <ul>
      <li><strong>Bank Transfer:</strong> Account No: 1234567890, Bank: ABC Bank</li>
      <li><strong>PayPal:</strong> paypal@example.com</li>
      <li><strong>UPI:</strong> tourbook@upi</li>
    </ul>
    <p>Please complete the payment before the tour date to avoid cancellation.</p>

    <br />
    <p>Thank you for choosing our service!</p>
  `,
};

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Booking confirmed and email sent", data: updatedBooking });
  } catch (err) {
    console.error("Error confirming booking:", err);
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};