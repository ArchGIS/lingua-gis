"use strict";

App.models.Word = function Word() {
  var props = {};
  App.models.proto.call(this, App.models.Word.scheme, props);
};

App.models.Word.url = function(id) {
  return id ? '#word/show/' + id : '#word/show';
};

App.models.Word.href = function(id, text) {
  return '<a href="' + App.models.Word.url(id) + '">' + text + '</a>';
};

