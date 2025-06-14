import Tour from "../models/Tour.js";

// create new tour
export const createTour = async (req, res) => {
  const newTour = new Tour(req.body);
  try {
    const savedTour = await newTour.save();

    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedTour,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again" });
  }
};

//update tour
export const updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    const updateTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateTour,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to update",
    });
  }
};

//delete tour
export const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to deletion",
    });
  }
};

//getSingale tour
export const getSingaleTour = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id).populate('reviews');
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

//getAll tour
// Get all tours (returns all tours if no page query param)
export const getAllTour = async (req, res) => {
  const page = parseInt(req.query.page);

  try {
    let tours;
    if (isNaN(page)) {
      // No page provided, return all tours
      tours = await Tour.find({}).populate("reviews");
    } else {
      // Paginate: 8 per page
      tours = await Tour.find({})
        .populate("reviews")
        .skip(page * 8)
        .limit(8);
    }

    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Successfully fetched tours",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Tours not found",
    });
  }
};

//get tour by search
export const getTourBySearch = async (req, res) => {
  // here 'i' means case sensitive
  const city = new RegExp(req.query.city, "i");
  const distance = parseInt(req.query.distance);
  const maxGroupSize = parseInt(req.query.maxGroupSize);

  try {
    //gte means greater than equal
    const tour = await Tour.find({
      city,
      distance: { $gte: distance },
      maxGroupSize: { $gte: maxGroupSize },
    }).populate('reviews');
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

//get featured tour
export const getFeaturedTour = async (req, res) => {

  try {
    const tour = await Tour.find({featured:true}).populate('reviews').limit(4);
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

//get tour counts
export const getTourCount = async(req,res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    res.status(200).json({success:true, data: tourCount});
  } catch (err) {
    res.status(500).json({success:False, message: "faild to ferch"});
  }
}
