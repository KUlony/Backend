const express = require("express");
const router = express.Router()

const postModel = require("../schemas/modelpost");

router.get("/post", async (req, res) => {
   try {
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
                                 maxEdits: 1,
                              },
                              score: { "boost": { "value": 3} }
                           }
                        },
                        {
                           text: {
                              query: req.query.text,
                              path: "post_content",
                              fuzzy: {
                                 maxEdits: 1,
                              },
                              score: { "boost": { "value": 2}}
                           }
                        }
                     ],

                  }
               }
            },
            {
               $project: {
                  post_title: 1,
                  _id: 1,
                  score: { $meta: "searchScore"}
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