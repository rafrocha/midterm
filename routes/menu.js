//jshint esversion: 6
"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("foods")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
};
