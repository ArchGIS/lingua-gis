'use strict';

App.views.search = new (Backbone.View.extend({
  'index': function() {
    const loc = App.locale;
    const lang = loc.getLang();
    const t = loc.translate;
    const ctl = lang === "en" ? loc.cyrToLatin : src => src;
    const prefix = lang === 'ru' ? '' : `${lang}_`;

    const excludeIdent = App.fn.excludeIdentMonuments;

    const mapInstance = App.views.map();
    let overlays = null;

    const $results = $('#search-results');

    const $objectToggler = App.page.get('objectToggler');
    let object = null;
    let objects = {
      'word-params': {
        'handler': searchWord,
        'columnsMaker': function(words) {
            console.log(words)

          return _.map((words), function(w) {
            return App.models.Word.href(w.id, `${w.name}`);
          });
        },
        'inputs': {
          'name': $('#word-input'),
        }
      },
      'local-params': {
        'handler': searchLocal,
        'columnsMaker': function(locals) {
          return _.map((locals), function(l) {
            return App.models.Local.href(l.id, `${l.name}`);
          });
        },
        'inputs': {
          'name': $('#local-input'),
        }
      },
      'udm-params': {
        'handler': searchUdm,
        'columnsMaker': function(vers) {
          return _.map((vers), function(v) {
            var name2 = (v.name2) ? ` / ${v.name2}` : ' '
            var name3 = (v.name3) ? ` / ${v.name3}` : ' '
            return App.models.Version.href(v.id, `${v.name1} ${name2} ${name3} (${v.sense})`);
          });
        },
        'inputs': {
          'name': $('#udm-input'),
        }
      },
      'sense-params': {
        'handler': searchSense,
        'columnsMaker': function(vers) {
          return _.map((vers), function(v) {
            var name2 = (v.name2) ? ` / ${v.name2}` : ' '
            var name3 = (v.name3) ? ` / ${v.name3}` : ' '
            return App.models.Version.href(v.id, `${v.sense} ( ${v.name1} ${name2} ${name3})`);
          });
        },
        'inputs': {
          'name': $('#sense-input'),
        }
      },
    };

    $('#show-results-button').on('click', showResults);

    // Заполнение и отрисовка результатов.
    function showResults() {
      $results.empty();
      object.handler(object);
    }

    // Смена искомого объекта.
    $objectToggler.setCallback(function($object) {
      $results.empty();
      App.views.clearOverlays(overlays);
      object = objects[$object.prop('id')];
    });
    object = objects['word-params'];

    var query = {
      areas: JSON.stringify({
        "a:Area": {"id": "*", "select": "*"},
      }),
    }

    var areas = [];
    var showAreas = function() {
      var placemarks = [];
      _.each(areas[0].a, function(area, id) {
        placemarks.push(
          App.controllers.fn.createPolygonPlacemark('area', area.id, area.polygonCoords, `${area.region} (${area.district} район)`, "1", 5)
        );
      })
      
      overlays = App.views.addToMap(placemarks, mapInstance);
    }
    var callRender = _.after(1, showAreas);
    areas.push(App.models.fn.getData(query, callRender));

    function find(urlStr, params) {
      return new Promise(function(resolve, reject) {
        var url = App.url.make(urlStr, params);

        $.get({
          url: url,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
          },
          success: (response) => {
            resolve($.parseJSON(response));
          },
          error: reject
        });
      });
    };

    function addResults(response, columnsMaker) {
      if (response.length) {
        const list = columnsMaker(response);

        _.each(list, function(item, i) {
          $results.append(`<p>${ ctl(item) }</p>`);
        });

      } else {
        $results.append(`<p>${ t('search.noResults') }</p>`);
      }
    }

    // Поиск памятника
    function searchWord(my) {
      var input = my.inputs;

      var name = input.name.val();
      var params = {'name': name}

      if (true) {
        find('/search/words', params)
          .then(function(response) {
            addResults(response, my.columnsMaker)
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
      }
    }

    function searchLocal(my) {
      var input = my.inputs;

      var name = input.name.val();
      var params = {'name': name}

      if (true) {
        find('/search/locals', params)
          .then(function(response) {
            addResults(response, my.columnsMaker)
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
      }
    }

    function searchUdm(my) {
      var input = my.inputs;

      var name = input.name.val();
      var params = {'name': name, 'mode': "udmurt"}

      if (true) {
        find('/search/versions', params)
          .then(function(response) {
            addResults(response, my.columnsMaker)
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
      }
    }

     function searchSense(my) {
      var input = my.inputs;

      var name = input.name.val();
      var params = {'name': name, 'mode': "sense"}

      if (true) {
        find('/search/versions', params)
          .then(function(response) {
            addResults(response, my.columnsMaker)
          }, function(error) {
            console.log(error);
          });
      } else {
        $results.append(`<p class="danger">${ t('search.fill') }</p>`);
      }
    }
  }
}));
