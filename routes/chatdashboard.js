/**
 * Created by Harmeet on 12-08-2015.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('chatdashboard', { title: 'Dashboard' });
});

module.exports = router;
