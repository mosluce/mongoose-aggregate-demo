var express = require('express');
var router = express.Router();
var pipe = require('../pipe');

router.use('/', pipe.db());

/* GET home page. */
router.get('/', function (req, res, next) {
    var before = new Date();
    var after = new Date();

    //before.setDate(after.getDate() - 30);
    //before.setHours(after.getHours() - 12);

    //before.setMonth(0);
    //before.setDate(1);
    //before.setHours(0);
    //before.setMinutes(0);
    //before.setSeconds(0);
    //after.setMonth(1);
    //after.setDate(0);
    //after.setHours(23);
    //after.setMinutes(59);
    //after.setSeconds(59);

    var beforeMonth = parseInt(req.query.beforeMonth || new Date().getMonth());
    var afterMonth = parseInt(req.query.afterMonth || new Date().getMonth());

    before.setMonth(beforeMonth - 1);
    before.setDate(1);
    before.setHours(0);
    before.setMinutes(0);
    before.setSeconds(0);
    after.setMonth(afterMonth);
    after.setDate(0);
    after.setHours(23);
    after.setMinutes(59);
    after.setSeconds(59);

    Logger.aggregate()//-> <Aggregation>
        .match({ //<Query> find
            createdAt: {
                $gte: before,
                $lte: after
            }
        })
        .group({
            _id: '$sNum',
            sNum: {$first: '$sNum'},
            count: {$sum: 1} //群組中每包含一筆資料 count 就多 "1"
        })
        .sort('-count') //依照點單率排序
        .exec()
        .then(function (counterItems) {
            console.log(counterItems);
            res.render('index', {
                title: 'Express',
                counterItems: counterItems,
                beforeMonth: beforeMonth,
                afterMonth: afterMonth
            });
        }, next);

});

router.post('/', function (req, res, next) {
    var sNum = req.body.sNum;

    Logger.create({
        sNum: sNum
    }).then(function () {
        //var before = new Date();
        //var after = new Date();
        //
        //before.setDate(after.getDate() - 30);
        //before.setMonth(0);
        //before.setDate(1);
        //before.setHours(0);
        //before.setMinutes(0);
        //before.setSeconds(0);
        //after.setMonth(1);
        //after.setDate(0);
        //after.setHours(23);
        //after.setMinutes(59);
        //after.setSeconds(59);

        res.redirect('/');

        //
        //Logger.count({
        //    sNum: sNum,
        //    createdAt: {
        //        $gte: before,
        //        $lte: after
        //    }
        //}).exec().then(function (count) {
        //    Counter.findOne({
        //        sNum: sNum
        //    }).exec().then(function (counter) {
        //        var promise = null;
        //
        //        if (counter) {
        //            counter.count = count;
        //            promise = counter.save();
        //        } else {
        //            var newCounter = new Counter();
        //            newCounter.sNum = sNum;
        //            newCounter.count = count;
        //            promise = newCounter.save();
        //        }
        //
        //        promise.then(function () {
        //            res.redirect('/');
        //        }, next);
        //    }, next);
        //}, next)
    }, next);
});
module.exports = router;
