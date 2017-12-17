'use strict';

App.controllers.word = new (Backbone.View.extend({
  'show': function() {
    App.url.setMapping(['id']);
    var wId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      single: {
        word: JSON.stringify({
          "w:Word": {"id": wId, "select": "*"},
        }),

        versions: JSON.stringify({
          "w:Word": {"id": wId},
          "l:Local": {"id": "*", "select": "*"},
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

      _.each(tmplData.l, function(val, i) {
        tmplData.placemarks.push(
          App.controllers.fn.createStandartPlacemark('word-version', tmplData.v[i].id, val.x, val.y, tmplData.v[i].sense, `${i}`)
        );
      });

      App.page.render("show/word", tmplData, tmplData.placemarks)
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
