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

const middlewareSchema = z.object({
  custome_data: z.string(),
  admin_id: z.string(),
});

const validateIdAndData = async (req, res) => {
  try {
    const middlewareData = middlewareSchema.safeParse(req.body);
    const courseId = req.params.courseId;

    console.log("couseId :", courseId);

    if (!courseId) {
      res.json({
        message: "please provide the courseId!",
      });
      return;
    }

    if (!middlewareData.success) {
      res.status(403).json({
        mesage: "you have not a valid permission",
      });
      return;
    }
    return { ...middlewareData.data, courseId };
  } catch (e) {
    console.log(e);
    res.send({
      message: "error while checking the middleware data",
      error: e.mesage,
    });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const middlewareData = middlewareSchema.safeParse(req.body);

    if (!middlewareData.success) {
      res.status(403).json({
        mesage: "you have not a valid permission",
      });
      return;
    }
    // const findAdminId = await AdminModel.findOne({ email: email });

    // if (!findAdminId) {
    //   res.status(403).json({
    //     message: "unexpected error",
    //   });
    //   return;
    // }

    // const adminId = findAdminId._id;
    const { custome_data, admin_id } = middlewareData.data;
    const checkCourse = await CourseModel.find({ admin_id: admin_id });

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
    const middlewareData = middlewareSchema.safeParse(req.body);

    if (!middlewareData.success) {
      res.status(201).json({
        message: "you don't have right permission",
        error: reqData.error,
      });
      return;
    }

    const { custome_data, admin_id } = middlewareData.data;

    console.log("adminId :", custome_data, admin_id);

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
      admin_id: admin_id,
    });

    res.status(200).json({
      message: "course created successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.mesage });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updateSchema = z.object({
      course_title: z.string().min(5).optional(),
      course_description: z.string().min(5).optional(),
      course_banner_image: z.string().optional(),
      creater_name: z.string().min(3).optional(),
      course_tags: z.array(z.string()).min(3).optional(),
      price: z
        .object({
          total_price: z.number().optional(),
          discount_price: z.number().optional(),
        })
        .optional(),
    });

    const { admin_id, courseId } = await validateIdAndData(req, res);

    const updateReqData = updateSchema.safeParse(req.body);
    if (!updateReqData.success) {
      res.status(403).json(updateReqData.error);
      return;
    }

    const courseData = await CourseModel.findOne({ _id: courseId });
    const adminIdInCourse = courseData.admin_id.toString();

    if (admin_id !== adminIdInCourse) {
      res.status(403).json({
        message:
          "plase provide correct course id our login again as admin account",
      });
      return;
    }
    const updateCourseData = updateReqData.data;
    console.log("updateCourseData :", updateCourseData);

    await CourseModel.findByIdAndUpdate({ _id: courseId }, updateCourseData, {
      upsert: true,
    });
    res.json({
      message: "update the course",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.mesage });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { admin_id, courseId } = await validateIdAndData(req, res);

    const courseData = await CourseModel.findOne({ _id: courseId });
    const adminIdInCourse = courseData.admin_id.toString();

    if (admin_id !== adminIdInCourse) {
      res.status(403).json({
        message:
          "plase provide correct course id our login again as admin account",
      });
      return;
    }

    await CourseModel.findByIdAndDelete(
      { _id: courseId },
      {
        upsert: true,
      }
    );
    res.json({
      message: "delete the course successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.mesage });
  }
};

const publish = async (req, res) => {
  try {
    const { admin_id, courseId } = await validateIdAndData(req, res);
    await findByIdAndUpdate(
      { _id: courseId },
      { isPublish: true },
      { upsert: true }
    );
    res.status(200).json({
      message: "couse publish successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.mesage });
  }
};

const unPublish = async (req, res) => {
  try {
    const { admin_id, courseId } = await validateIdAndData(req, res);
    await findByIdAndUpdate(
      { _id: courseId },
      { isPublish: true },
      { upsert: true }
    );

    res.status(200).json({
      message: "couse un-publish successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.mesage });
  }
};

module.exports = {
  getAllCourse: getAllCourse,
  createCourse: createCourse,
  updateCourse: updateCourse,
  deleteCourse: deleteCourse,
  publish: publish,
  unPublish: unPublish,
};
