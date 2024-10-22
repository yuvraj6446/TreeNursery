const Product = require("../models/Product")
const Category = require("../models/Category")
// const Section = require("../models/Section")
// const SubSection = require("../models/SubSection")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
// const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
// Function to create a new course
exports.createProduct = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {


      
      ProductName,
      ProductDescription,
      Description,
      price,
      tag: _tag,
      category,
      // status,
      // instructions: _instructions,
    } = req.body
    // Get thumbnail image from request files
    console.log("sdfghjkl;");
    
    const thumbnail = req.files.thumbnailImage
    // console.log("sdfghjkl..................;");

    console.log("tag", _tag);

    // Convert the tag and instructions from stringified Array to Array
    // const tag = JSON.parse(_tag)
    const tag = _tag ? JSON.parse(_tag) : ["f"];
    console.log("sdfghjkl..................;");

    // const instructions = JSON.parse(_instructions)
    console.log("sdfghjkl..................3;");
    console.log("tag", tag)
    // console.log("instructions", instructions)

    // Check if any of the required fields are missing
    if (
      !ProductName ||
      !ProductDescription ||
      // !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category 
      
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    // if (!status || status === undefined) {
    //   status = "Draft"
    // }
    // Check if the user is an instructor
    // const instructorDetails = await User.findById(userId, {
    //   accountType: "Instructor",
    // })

    // if (!instructorDetails) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Instructor Details Not Found",
    //   })
    // }

    // Check if the tag given is valid
    console.log("sdfghjkl..................2;");
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    console.log("cloudinary hai next")
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )
    
    console.log(thumbnailImage)
    // Create a new course with the given details
    const newProduct = await Product.create({
      ProductName,
      ProductDescription,
      // instructor: instructorDetails._id,
      // whatYouWillLearn: whatYouWillLearn,/
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      // status: status,
      // instructions,
    })

    // Add the new course to the User Schema of the Instructor
    // await User.findByIdAndUpdate(
    //   // {
    //   //   _id: instructorDetails._id,
    //   // },
    //   {
    //     $push: {
    //       courses: newCourse._id,
    //     },
    //   },
    //   { new: true }
    // )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          products: newProduct._id,
        },
      },
      { new: true }
    )
    console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newProduct,
      message: "Product Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create Product",
      error: error.message,
    })
  }
}
// Edit Course Details
exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.body
    const updates = req.body
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      product.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          product[key] = JSON.parse(updates[key])
        } else {
          product[key] = updates[key]
        }
      }
    }

    await product.save()

    const updatedProduct = await Product.findOne({
      _id: productId,
    })
      .populate(
        // {
        // path: "instructor",
      //   populate: {
      //     path: "additionalDetails",
      //   },
      // }
      )
      .populate("category")
      .populate("ratingAndReviews")
      // .populate({
      //   path: "productContent",
        
      // })
      .exec()

    res.json({
      success: true,
      message: "product updated successfully",
      data: updatedProduct,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
// Get Course List
exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find(
      {},
      {
        productName: true,
        price: true,
        thumbnail: true,
        // instructor: true,
        ratingAndReviews: true,
        // studentsEnrolled: true,
      }
    )
      // .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allProducts,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Product Data`,
      error: error.message,
    })
  }
}
// Get One Single Course Details
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()
//     // console.log(
//     //   "###################################### course details : ",
//     //   courseDetails,
//     //   courseId
//     // );
//     if (!courseDetails || !courseDetails.length) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with id: ${courseId}`,
//       })
//     }

//     if (courseDetails.status === "Draft") {
//       return res.status(403).json({
//         success: false,
//         message: `Accessing a draft course is forbidden`,
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: courseDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
exports.getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body
    const productDetails = await Product.findOne({
      _id: productId,
    })
      // .populate({
      //   path: "instructor",
      //   populate: {
      //     path: "additionalDetails",
      //   },
      // })
      .populate("category")
      .populate("ratingAndReviews")
      // .populate({
      //   path: "courseContent",
      //   populate: {
      //     path: "subSection",
      //     select: "-videoUrl",
      //   },
      // })
      .exec()

    if (!productDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${productId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    // let totalDurationInSeconds = 0
    // courseDetails.courseContent.forEach((content) => {
    //   content.subSection.forEach((subSection) => {
    //     const timeDurationInSeconds = parseInt(subSection.timeDuration)
    //     totalDurationInSeconds += timeDurationInSeconds
    //   })
    // })

    // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        productDetails,
        // totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.getFullProductDetails = async (req, res) => {
  try {
    const { productId } = req.body
    const userId = req.user.id
    const productDetails = await Product.findOne({
      _id: productId,
    })
      // .populate({
      //   path: "instructor",
      //   populate: {
      //     path: "additionalDetails",
      //   },
      // })
      .populate("category")
      .populate("ratingAndReviews")
      // .populate({
      //   path: "courseContent",
      //   populate: {
      //     path: "subSection",
      //   },
      // })
      .exec()

    // let courseProgressCount = await CourseProgress.findOne({
    //   courseID: courseId,
    //   userId: userId,
    // })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!productDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${productId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    // let totalDurationInSeconds = 0
    // courseDetails.courseContent.forEach((content) => {
    //   content.subSection.forEach((subSection) => {
    //     const timeDurationInSeconds = parseInt(subSection.timeDuration)
    //     totalDurationInSeconds += timeDurationInSeconds
    //   })
    // })

    // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        productDetails,
        // totalDuration,
        // completedVideos: courseProgressCount?.completedVideos
          // ? courseProgressCount?.completedVideos
          // : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
// exports.getInstructorCourses = async (req, res) => {
//   try {
//     // Get the instructor ID from the authenticated user or request body
//     const instructorId = req.user.id

//     // Find all courses belonging to the instructor
//     const instructorCourses = await Course.find({
//       instructor: instructorId,
//     }).sort({ createdAt: -1 })

//     // Return the instructor's courses
//     res.status(200).json({
//       success: true,
//       data: instructorCourses,
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to retrieve instructor courses",
//       error: error.message,
//     })
//   }
// }
// Delete the Course
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body

    // Find the course
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Unenroll students from the course
    // const studentsEnrolled = product.studentsEnroled
    // for (const studentId of studentsEnrolled) {
    //   await User.findByIdAndUpdate(studentId, {
    //     $pull: { courses: courseId },
    //   })
    // }

    // Delete sections and sub-sections
    const productSections = product.productContent
    // for (const sectionId of productSections) {
    //   // Delete sub-sections of the section
    //   const section = await Section.findById(sectionId)
    //   if (section) {
    //     const subSections = section.subSection
    //     for (const subSectionId of subSections) {
    //       await SubSection.findByIdAndDelete(subSectionId)
    //     }
    //   }

    //   // Delete the section
    //   await Section.findByIdAndDelete(sectionId)
    // }

    // Delete the course
    await Product.findByIdAndDelete(productId)

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
