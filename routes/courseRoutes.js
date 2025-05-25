const { Router } = require("express");
const {
  getAllCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  publish,
  unPublish,
} = require("../controller/courseController");

const courseRouter = Router();

courseRouter.get("/all-course", getAllCourse);
courseRouter.post("/course/create", createCourse);

courseRouter.patch("/:courseId/update", updateCourse);

courseRouter.delete("/:courseId/course/delete", deleteCourse);

courseRouter.post("/:courseId/publish/", publish);

courseRouter.post("/:courseId/un-publish", unPublish);

module.exports = {
  courseRouter: courseRouter,
};
