"use strict";

App.models.Local = function Local() {
  var props = {};
  App.models.proto.call(this, App.models.Local.scheme, props);
};

App.models.Local.url = function(id) {
  return id ? '#local/show/' + id : '#local/show';
};

App.models.Local.href = function(id, text) {
  return '<a href="' + App.models.Local.url(id) + '">' + text + '</a>';
};

