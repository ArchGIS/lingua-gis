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

      // let resPlacemarks = App.controllers.fn.getResPlacemarks(tmplData);
      // tmplData.placemarks = _.union(tmplData.placemarks, resPlacemarks);

      App.page.render("show/version", tmplData, tmplData.placemarks)
    };

    var queryCounter = _.reduce(queries, (memo, obj) => { return memo + _.size(obj) }, 0);

    var callRender = _.after(queryCounter, render);

    // _.each(queries.complex, function(query, key) {
    //   $.when(model.sendQuery(query)).then(function(response) {
    //     _.extend(tmplData, response);

    //     var ids = _.map(tmplData[key], function(obj) {return obj.id.toString()});

    //     data.push(model.getData(queries[key], callRender, true, ids));
    //     callRender();
    //   })
    // })

    data.push(model.getData(queries.single, callRender));
  },

  'start': function() {
    console.log('monument controller is launched');
  }
}));
