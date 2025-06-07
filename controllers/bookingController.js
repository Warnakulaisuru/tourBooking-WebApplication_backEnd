import Booking from "../models/Booking.js";

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

// Confirm booking
export const confirmBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Booking.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Booking confirmed",
      data: updated,
    });
  } catch (err) {
    console.error("confirmBooking error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to confirm booking",
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Booking deleted",
    });
  } catch (err) {
    console.error("deleteBooking error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to delete booking",
    });
  }
};
