const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const topicModel = require("../schemas/modeltopic");

router.get("/topic", async (req, res) => {
    try {
        let results;
        if (req.query.text) {
            results = await topicModel.aggregate([
                {
                    $search: {
                        index: "searchTopic",
                        compound: {
                            should: [
                                {
                                    text: {
                                        query: req.query.text,
                                        path: "topic_name",
                                        fuzzy: {
                                            maxEdits: 2,
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        topic_name: 1,
                        _id: 1
                    }
                },
            ])
            if (results) return res.send(results);
        }
        res.send([]);
    } catch (e) {
        res.status(500).send({message: e.message})
    }
});

module.exports = router;