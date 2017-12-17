'use strict';

App.views.word = new (Backbone.View.extend({
  "show": function(placemarks) {
    App.views.addToMap(placemarks);

    $("#container").tabs();
    App.views.functions.setAccordion(".accordion");
    App.views.functions.setEdit();
  }
}));
