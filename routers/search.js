const mongoose = require("mongoose");
const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");
const userModel = require("../schemas/modeluser");

const _id = "6329fedcc3479021a8d8d1e4";

router.get("/post", async (req, res) => {
   try {
      const user = await userModel.findById(_id);
      // const view_post_id = user.visit_post;
      console.log(user);
      if (req.query.text) {
         let result = await postModel.aggregate([
            {
               $search: {
                  index: "searchPost",
                  compound: {
                     should: [
                        {
                           text: {
                              query: req.query.text,
                              path: "post_title",
                              fuzzy: {
                                 maxEdits: 2,
                              },
                              score: { "boost": { "value": 3} }
                           }
                        },
                        {
                           text: {
                              query: req.query.text,
                              path: "post_content",
                              fuzzy: {
                                 maxEdits: 2,
                              },
                              score: { "boost": { "value": 2}}
                           }
                        },
                     ],
                  },
                  highlight: {
                     path: ["post_title", "post_content"]
                  }
               }
            },
            {
               $project: {
                  post_content: 1,
                  post_title: 1,
                  _id: 1,
                  highlight: { "$meta": "searchHighlights"},
               }
            },
         ])
         if (result) return res.send(result);
      }
      res.send([]);
   } catch (e) {
      res.status(500).send({ message: e.message });
   }
});

module.exports = router;
