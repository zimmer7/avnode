var User = require('../../models/user');
var Tvshows = require('../../models/tvshow');
var _ = require('lodash');
var config = require('getconfig');
var Joi = require('joi');
var flatten = require('flat');

exports.categoriesSchemaGet = {
  event: Joi.string().regex(new RegExp(config.regex.permalink)).required(),
}
exports.categoriesGet = function(req, res) {
  var query = { 'permalink': req.params.event };
  Event.findOne(query)
  .exec(function(err, event) {
    res.render('controlpanel/superadmin/public', {
      config: config,
      result: event
    });
  });
}
exports.categoriesSchemaPost = {
  _id: Joi.string().alphanum().min(24).max(24).required(),
  title: Joi.string().required(),
  permalink: Joi.string().regex(new RegExp(config.regex.permalink)).required(),
  subtitle: Joi.object().allow(config.locales),
  text: Joi.object().allow(config.locales),
  websites: Joi.array().items(
    Joi.string().uri()
  ),
  venues: Joi.array().items(
    Joi.object().keys({
      venue: Joi.string().alphanum().required(),
      date: Joi.date().format('YYYY-MM-DD'),
      start_time: Joi.date().format('H:i'),
      end_time: Joi.date().format('H:i'),
      street: Joi.string().allow(''),
      streetnumber: Joi.string().allow(''),
      zip: Joi.string().allow(''),
      city: Joi.string().allow(''),
      country: Joi.string().allow('')
    })
  )
};
exports.categoriesPost = function(req, res) {
  var data = _.defaults(req.body, {
    websites: [],
    venues: []
  });
  Event.findByIdAndUpdate(req.body._id, { $set: data }, { new: true }, function (err, event) {
    res.render('controlpanel/superadmin/public', {
      config: config,
      result: event
    });
  });
}

exports.vjtelevisionSchemaGet = {
  //event: Joi.string().regex(new RegExp(config.regex.permalink)).required(),
}
exports.vjtelevisionGet = function(req, res) {
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  var year = 2014;
  var start = new Date(year, month, 1);
  var end = new Date(month==11 ? year+1 : year, month==11 ? 0 : month+1, 1);

  var start = year+"-"+(month+1)+"-1";
  var end = (month==11 ? year+1 : year)+"-"+(month==11 ? 1 : month+2)+"-1";

  var query = { 'palinsestodate': {$gte: start, $lt: end} };
  console.log("start");
  console.log(start);
  console.log("end");
  console.log(end);
  console.log("query");
  console.log(query);
  Tvshows.find(query)
  .exec(function(err, tvshows) {
    res.render('controlpanel/superadmin/vjtelevision', {
      config: config,
      result: tvshows
    });
  });
}
exports.vjtelevisionSchemaPost = {
  _id: Joi.string().alphanum().min(24).max(24).required()
};
exports.vjtelevisionPost = function(req, res) {
  console.log(req.body);
  /*
  var data = _.defaults(req.body, { });
  User.findByIdAndUpdate(req.body._id, { $set: data }, { new: true }, function (err, event) {
    res.render('controlpanel/superadmin/vjtelevision', {
      config: config,
      result: event
    });
  });
   */
}
