const { Router } = require("express");
const {
  getAllCourse,
  createCourse,
} = require("../controller/courseController");

const courseRouter = Router();

courseRouter.get("/all-course", getAllCourse);
courseRouter.post("/course/create", createCourse);

courseRouter.patch("/course/update", (req, res) => {
  res.json({
    message: "course preview endpoint",
  });
});

courseRouter.delete("/:courseId/course/delete", (req, res) => {
  res.json({
    message: "course preview endpoint",
  });
});

courseRouter.post("/:courseId/publish/", (req, res) => {
  res.json({
    message: "course preview endpoint",
  });
});

module.exports = {
  courseRouter: courseRouter,
};
