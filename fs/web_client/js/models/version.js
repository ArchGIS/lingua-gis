"use strict";

App.models.Version = function Version() {
  var props = {};
  App.models.proto.call(this, App.models.Version.scheme, props);
};

App.models.Version.url = function(id) {
  return id ? '#version/show/' + id : '#version/show';
};

App.models.Version.href = function(id, text) {
  return '<a href="' + App.models.Version.url(id) + '">' + text + '</a>';
};

