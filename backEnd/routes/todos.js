const { Todo } = require("../models/todo");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { response } = require("express");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user);
    const todos = await Todo.find().sort({ date: -1 });

    res.send(todos);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.post("/", async (req, res) => {
  console.log("starting post");
  const schema = new Joi.object({
    name: Joi.string().min(3).max(200).required(),
    author: Joi.string().min(3).max(30),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  }).options({
    abortEarly: false,
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, author, isComplete, date, uid } = req.body;
  let todo = new Todo({
    name,
    author,
    isComplete,
    date,
    uid,
  });
  //One way to do this below.

  try {
    todo = await todo.save();
    res.send(todo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

// r
//   t
//     co.
//   }
//   co
// }
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).send("Todo not found:");

    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    res.send(deletedTodo);
    console.log("The following was deleted: " + deletedTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    console.log("PATCHING this SHIT up");
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).send("Todo not found:");

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
      isComplete: !todo.isComplete,
    });

    res.send(updatedTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.put("/:id", async (req, res) => {
  console.log("starting put request");
  const schema = new Joi.object({
    name: Joi.string().min(3).max(200).required(),
    author: Joi.string().min(3).max(30),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  }).options({
    abortEarly: false,
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).send("Todo not found:");

    const { name, author, isComplete, date, uid } = req.body;

    const updatedTodo = await Todo.findOneAndUpdate(
      req.param.id,
      {
        name,
        author,
        isComplete,
        date,
        uid,
      },
      { new: true }
    );

    res.send(updatedTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

module.exports = router;
