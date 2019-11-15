"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var router = (0, _express.Router)();

var debug = require('debug')('edu:index:controller');
/* GET home page */


router.get('/', function (req, res, next) {
  debug('Homepage rendered');
  res.render('index', {
    title: 'Hom'
  });
});
var _default = router;
exports["default"] = _default;