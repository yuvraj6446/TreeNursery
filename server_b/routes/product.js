// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createProduct,
  getAllProducts,
  getProductDetails,
  getFullProductDetails,
  editProduct,
//   getInstructorProducts,
  deleteProduct,
} = require("../controllers/Product")

// Tags Controllers Import

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
// const {
//   createSection,
//   updateSection,
//   deleteSection,
// } = require("../controllers/Section")

// Sub-Sections Controllers Import
// const {
//   createSubSection,
//   updateSubSection,
//   deleteSubSection,
// } = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingAndReview")
// const {
//   updateCourseProgress,
//   getProgressPercentage,
// } = require("../controllers/courseProgress")
// Importing Middlewares
const { auth, isCustomer, isAdmin } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
// router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/createProduct", auth,isAdmin, createProduct)

// Edit Course routes
router.post("/editProduct", auth, isAdmin, editProduct)
//Add a Section to a Course
// router.post("/addSection", auth, isAdmin, createSection)
// Update a Section
// router.post("/updateSection", auth, isAdmin, updateSection)
// Delete a Section
// router.post("/deleteSection", auth, isAdmin, deleteSection)
// Edit Sub Section
// router.post("/updateSubSection", auth, isAdmin, updateSubSection)
// Delete Sub Section
// router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
// router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Courses Under a Specific Instructor
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get all Registered Courses
router.get("/getAllProducts", getAllProducts)
// Get Details for a Specific Courses
router.post("/getProductDetails", getProductDetails)
// Get Details for a Specific Courses
router.post("/getFullProductDetails", auth, getFullProductDetails)
// To Update Course Progress
// router.post("/updateCourseProgress", auth, isCustomer, updateCourseProgress)
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteProduct", deleteProduct)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isCustomer, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

module.exports = router
