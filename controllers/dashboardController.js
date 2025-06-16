import User from '../models/User.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [userCount, tourCount, bookingCount, reviewCount] = await Promise.all([
      User.estimatedDocumentCount(),
      Tour.estimatedDocumentCount(),
      Booking.estimatedDocumentCount(),
      Review.estimatedDocumentCount(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount,
        totalTours: tourCount,
        totalBookings: bookingCount,
        totalReviews: reviewCount,
      }
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

export const getMonthlyBookings = async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 }
      }
    ]);

    const months = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formatted = bookings.map((b) => ({
      month: months[b.month],
      bookings: b.count,
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error("Error fetching monthly bookings:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMostPopularTour = async (req, res) => {
  try {
    const popular = await Booking.aggregate([
      {
        $group: {
          _id: "$tourName",
          bookings: { $sum: 1 },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 1 }, // get top 1 tour
    ]);

    res.status(200).json({
      success: true,
      data: popular[0] || { _id: "No bookings yet", bookings: 0 },
    });
  } catch (err) {
    console.error("Error fetching popular tour:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/v1/dashboard/tour-bookings
export const getTourBookings = async (req, res) => {
  const result = await Booking.aggregate([
    {
      $group: {
        _id: "$tourName",
        bookings: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        tourName: "$_id",
        bookings: 1,
      },
    },
    { $sort: { bookings: -1 } },
  ]);

  res.status(200).json({ data: result });
};