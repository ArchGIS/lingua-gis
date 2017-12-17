'use strict';

App.controllers.local = new (Backbone.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var lId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      single: {
        local: JSON.stringify({
          "l:Local": {"id": lId, "select": "*"},
        }),

        versions: JSON.stringify({
          "l:Local": {"id": lId},
          "w:Word": {"id": "*", "select": "*"},
          "v:Version": {"id": "*", "select": "*"},
          "w__has__v": {},
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

      App.page.render("show/local", tmplData, tmplData.placemarks)
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
