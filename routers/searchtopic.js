const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const topicModel = require("../schemas/modeltopic");
const userModel = require("../schemas/modeluser");

router.get("/topic", async (req, res) => {
    // #swagger.tags = ['Search']
    // #swagger.description = 'ค้นหา Topic ด้วยข้อความ'
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
            ])
            if (results) return res.send(results);
        }
        res.send([]);
    } catch (e) {
        res.status(500).send({message: e.message})
    }
});

router.get("/user", async (req, res) => {
    try {
        let results;
        if(req.query.text) {
            results = await userModel.aggregate([
                {
                    $search: {
                        index: "searchUser",
                        compound: {
                            should: [
                                {
                                    text: {
                                        query: req.query.text,
                                        path: "user_name",
                                        fuzzy: {
                                            maxEdits: 2,
                                        }
                                    }
                                },
                                {
                                    text: {
                                        query: req.query.text,
                                        path: "user_firtname",
                                        fuzzy: {
                                            maxEdits: 2,
                                        }
                                    }
                                },
                                {
                                    text: {
                                        query: req.query.text,
                                        path: "user_lastname",
                                        fuzzy: {
                                            maxEdits: 2,
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
            ])
            if (results) return res.send(results);
        }
        res.send([]);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

module.exports = router;