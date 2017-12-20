'use strict';

App.controllers.version = new (Backbone.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var vId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      single: {
        version: JSON.stringify({
          "v:Version": {"id": vId, "select": "*"},
        }),

        word: JSON.stringify({
          "v:Version": {"id": vId},
          "w:Word": {"id": "*", "select": "*"},
          "w__has__v": {},
        }),

        locals: JSON.stringify({
          "v:Version": {"id": vId},
          "l:Local": {"id": "*", "select": "*"},
          "v__has__l": {},
        }),
      },
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      tmplData.placemarks = [];

      _.each(tmplData.l, function(local, i) {
        tmplData.placemarks[i] = {
          type: "local",
          id: `${local.id}`,
          coords: [local.x, local.y],
          pref: {
            hintContent: local.name
          },
          opts: {
            preset: "0"
          }
        };
      })

      App.page.render("show/version", tmplData, tmplData.placemarks)
    };

    var queryCounter = _.reduce(queries, (memo, obj) => { return memo + _.size(obj) }, 0);
    var callRender = _.after(queryCounter, render);

    data.push(model.getData(queries.single, callRender));
  },

  'start': function() {
    console.log('monument controller is launched');
  }
}));
