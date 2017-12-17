'use strict';

App.views.local = new (Backbone.View.extend({
  "show": function(placemarks) {
    App.views.addToMap(placemarks);

    $("#container").tabs();
    App.views.functions.setAccordion(".accordion");
    App.views.functions.setEdit();
  }
}));
