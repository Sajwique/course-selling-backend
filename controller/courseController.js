const { AdminModel } = require("../models/adminModel");
const { CourseModel } = require("../models/courseModel");

const { z } = require("zod");

const reqSchema = z.object({
  course_title: z.string().min(5),
  course_description: z.string().min(5),
  course_banner_image: z.string().optional(),
  creater_name: z.string().min(3),
  course_tags: z.array(z.string()).min(3),
  price: z.object({
    total_price: z.number(),
    discount_price: z.number(),
  }),
});

const getAllCourse = async (req, res) => {
  try {
    const email = req.body.custome_data;
    const adminId = req.body.admin_id;

    // const findAdminId = await AdminModel.findOne({ email: email });

    // if (!findAdminId) {
    //   res.status(403).json({
    //     message: "unexpected error",
    //   });
    //   return;
    // }

    // const adminId = findAdminId._id;

    const checkCourse = await CourseModel.find({ admin_id: adminId });

    console.log("checkCourse", checkCourse);
    if (checkCourse.length < 0) {
      res.status(200).json({
        message: "no course created yet",
      });
      return;
    }
    res.status(200).json({
      mesage: "success",
      data: checkCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.mesage,
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const reqData = reqSchema.safeParse(req.body);
    const adminEmail = req.body.custome_data;
    const adminId = req.body?.admin_id;

    console.log("adminId :", adminEmail, adminId);

    if (!reqData.success) {
      res.status(201).json({
        message: "please provide the valid data",
        error: reqData.error,
      });
      return;
    }

    const {
      course_title,
      course_description,
      course_banner_image,
      creater_name,
      course_tags,
      price,
    } = reqData.data;

    await CourseModel.insertOne({
      course_title,
      course_description,
      course_banner_image,
      creater_name,
      course_tags,
      price,
      admin_id: adminId,
    });

    res.status(200).json({
      message: "course created successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.mesage });
  }
};

module.exports = {
  getAllCourse: getAllCourse,
  createCourse: createCourse,
};
