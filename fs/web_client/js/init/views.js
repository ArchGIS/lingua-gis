'use strict';

App.views.functions = {
  "setAccordion": function(accordionSelector) {
    var headers = $(accordionSelector + ' .accordion-header');

    headers.click(function() {
      var panel = $(this).next();
      var isOpen = panel.is(':visible');
   
      panel[isOpen? 'slideUp': 'slideDown']()
          .trigger(isOpen? 'hide': 'show');

      return false;
    });
  },

  "setAccordionHeader": function(header) {
    header.click(function() {
      var panel = $(this).next();
      var isOpen = panel.is(':visible');
   
      panel[isOpen? 'slideUp': 'slideDown']()
          .trigger(isOpen? 'hide': 'show');

      return false;
    });
  },

  "getMonImageCard": (params) => {
    let imagesHtml = '';

    let tmpl = _.template(`
      <div class="media">
        <a class="pull-left" href="<%= HOST_URL %>/local_storage/<%= fileid %>" target="_blank">
          <img class="media-object" src="<%= HOST_URL %>/local_storage/<%= fileid %>" width="300" alt="Фотография памятника">
        </a>
        <div class="media-body">
          <p>Элемент памятника: <%= monumentPart %></p>
          <p>Ракурс: <%= direction %></p>
        </div>
      </div>
    `);

    _.times(params.photo.length, (i) => {
      imagesHtml += tmpl({
        fileid: params.photo[i].fileid,
        monumentPart: params.photo[i].monumentPart || 'Не задано',
        direction: params.cd[i].name
      });
    });

    if (params.photo.length === 0) {
      imagesHtml += '';
    }

    return imagesHtml;
  },

  "setEdit": () => {
    let fields = $("dd.edit-field");

    _.each(fields, function(field, id) {
      let dataFor = $(field).attr("data-for");
      let dataType = $(field).attr("data-type");
      let dataId = $(field).attr("data-id");
      let dataField = $(field).attr("data-field");

      let fieldType = (dataType === "textarea") ? "textarea" : "input"; 
      dataType = (dataType === "textarea") ? "text" : dataType; 

      $(field).attr("uid", id);
      let icon = _.template(`
        <img class="edit-icon" uid="${id}" src="<%= HOST_URL %>/web_client/img/icons/pen.png" width="12" height="12">
      `)
      let iconSave = _.template(`
        <img class="save-icon" uid="${id}" src="<%= HOST_URL %>/web_client/img/icons/save.png" width="12" height="12">
      `)
      let editField = _.template(`
        <${fieldType} class="new-field" uid="${id}" data-for="${dataFor}" data-type="${dataType}" data-id="${dataId}">
      `)

      $(field).after(iconSave);
      $(field).after(editField);
      $(field).append(icon);

      $(`.edit-icon[uid=${id}]`).on("click", function() {
        $(`.new-field[uid=${id}]`).val($.trim($(field).text()));

        $(`.new-field[uid=${id}]`).show();
        $(`.save-icon[uid=${id}]`).show();
        $(`.edit-icon[uid=${id}]`).hide();
        $(`.edit-field[uid=${id}]`).hide();
      })

      $(`.save-icon[uid=${id}]`).on("click", function() {
        let value = $(`.new-field[uid=${id}]`).val().replace(/\n/g, "\\n");
        let query = {};
        query[`el:${dataFor}`] = {};
        query[`el:${dataFor}`]["id"] = `${dataId}`;
        query[`el:${dataFor}`][`${dataField}/${dataType}`] = `${value}`;
        console.log(query)
        query = JSON.stringify(query);

        $.ajax({
          url: "/hquery/upsert",
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
          },
          data: query,
          type: "POST",
          success: (response) => {
            console.log('upsert: ' + response);
            $(field).find("span").text(value)

            $(`.new-field[uid=${id}]`).hide();
            $(`.save-icon[uid=${id}]`).hide();
            $(`.edit-icon[uid=${id}]`).show();
            $(`.edit-field[uid=${id}]`).show();
          }
        });
      })
    })
  },

  "getTopoCard": (topos) => {
    let imagesHtml = '';

    let tmpl = _.template(`
      <div class="media">
        <a class="pull-left" href="<%= HOST_URL %>/local_storage/<%= fileid %>" target="_blank">
          <img class="media-object" src="<%= HOST_URL %>/local_storage/<%= fileid %>" width="300" alt="Card image cap">
        </a>
        <div class="media-body">
          <p>Автор: <%= author %></p>
          <p>Год съёмки: <%= year %></p>
        </div>
      </div>
    `);

    _.times(topos.length, (i) => {
      imagesHtml += tmpl({
        fileid: topos[i].fileid,
        year: topos[i].year || 'Не задано',
        author: topos[i].author || 'Неизвестен'
      });
    });

    if (topos.length === 0) {
      imagesHtml += '';
    }

    return imagesHtml;
  },

  "setCultureAutocomplete": function(field, monId, layerId, subclass, canAdd) {
    layerId = layerId || 0;
    subclass = subclass || "Culture";
    canAdd = (typeof canAdd !== 'undefined') ? canAdd : true;
    
    let d_cultures = App.models.Culture.getAll();
    let grepObject = App.fn.grepObject;

    const lang = App.locale.getLang();
    const prefix = lang === 'ru' ? '' : `${lang}_`;

    $.when(d_cultures).done((cultures) => {
      let items = _.map(cultures, culture => ({'id': culture.id, 'label': culture[`${prefix}name`]}));

      $(field).autocomplete({
        source: function(req, res) {
          let term = req.term.toLowerCase();
          
          res(grepObject(term, items, 'label'));
        },
        minLength: 0
      }).focus(function() {
        $(this).autocomplete("search");
      });
    });

    $(field).on('autocompletefocus', function(event, ui) {
      event.preventDefault();
    });

    $(field).on('autocompleteresponse', function(event, ui) {
      if (ui.content.length === 0 && canAdd) {
        ui.content.push({
          'value': 0,
          'label': 'Ничего не найдено. Добавить?'
        });
      }
    });
    
    $(field).on('autocompleteselect', function(event, ui) {
      if (ui.item.value === 0) {
        let id = field.attr('id');
        let inputValue = field.val();

        App.template.get("culture/create", function(tmpl) {
          $(field).parent().replaceWith(tmpl({
            monId: monId,
            layerId: layerId,
            subclass: subclass
          }));
        });
      } else {
        $(field).attr("data-value", ui.item.id);
      }
    });
  },

  "setAuthorAutocomplete": function($button, aId) {
    App.template.get("author/addCoauthor", function(tmpl) {
      $button.before(tmpl({'aId': aId}));

      App.views.functions.setAccordionHeader($(`#coauthor-header-${aId}`));

      $(`#coauthor-input-${aId}`).autocomplete({
      source: function(request, response) {
        var authors = [];
        
        App.models.Author.findByNamePrefix(request.term)
          .then(function(data) {
            if (data && !data.error) {
              let results = _.map(data, function(row) {
                return {'label': row.name, 'value': row.name, 'id': row.id}
              });

              if (!results.length) {
                results.push('Ничего не найдено. Добавить?');
              }

              response(results);
            } else {
              response();
            }
          });
      },
        minLength: 3
      }).focus(function(){
        $(this).autocomplete("search");
      });

      $(`#coauthor-input-${aId}`).on('autocompletefocus', function(event, ui) {
        event.preventDefault();
      });

      $(`#coauthor-input-${aId}`).on('autocompleteselect', function(event, ui) {
        if (ui.item.value === 'Ничего не найдено. Добавить?') {
          let $input = $(this);
          let id = $input.attr('id');
          let inputValue = $input.val();

          let tmpl = _.template( $(`script#add-coauthor-${aId}`).html() );
          $(`#find-coauthor-${aId}`).replaceWith( tmpl({'aId': aId}) );

          $(`#coauthor-name-input-${aId}`).val(inputValue);
        } else {
          $(`#coauthor-input-id-${aId}`).val(ui.item.id);
        }
      })
    })
  },

  "addLayer": function(button, monId, layerId) {
    let setAccordionHeader = this.setAccordionHeader;

    App.template.get("monument/layer", function(tmpl) {
      button.before(tmpl({'monId': monId, 'layerId': layerId}));

      getDataForSelector($(`#epoch-selector-${monId}-${layerId}`), "Epoch");
      getDataForSelector($(`#type-selector-${monId}-${layerId}`), "MonumentType");
      getDataForSelector($(`#mon-date-scale-selector-${monId}-${layerId}`), "DateScale");
      
      App.views.functions.setCultureAutocomplete($(`#culture-input-${monId}-${layerId}`), monId, layerId);

      setAccordionHeader($(`#layer-header-${monId}-${layerId}`));
    })
  },

  "addExcavation": function(button, excId, map) {
    let d = $.Deferred();
    let setAccordionHeader = this.setAccordionHeader;
    let coordpicker = App.blocks.coordpicker;

    App.template.get("excavation/addExc", function(tmpl) {
      button.before(tmpl({'excId': excId}));

      coordpicker($(`#exc-coord-picker-${excId}`), {
        inputs: [`#exc-x-${excId}`, `#exc-y-${excId}`],
        map: map
      }, `${excId}`);
      setAccordionHeader($(`#exc-header-${excId}`));
      getDataForSelector($(`#exc-spatref-selector-${excId}`), "SpatialReferenceType", "", true);
      console.log($(`#exc-coord-picker-${excId}`))
      d.resolve();
    })

    return d.promise();
  },

  "addLayerCheckbox": function(objFor, objWith, forId, withId, layerId, type) {
    type = type || "checkbox";

    let dataRelationFor = objFor.split("-")[0];
    dataRelationFor += (forId > -1) ? `_${forId}` : '';

    let layerSpan = $("<span>").attr("class", "layer-checkbox");
    let label = $("<label>")
      .attr("style", "margin-right: 3px")
      .attr("for", `${objFor}-layer-${withId}-${layerId}`)
      .text(`слой №${layerId}`);

    let checkbox = $("<input>")
      .attr({
        id: `${objFor}-layer-${withId}-${layerId}`,
        type: type,
        name: `${objFor}-layer-${withId}`,
        "data-relation-for": dataRelationFor,
        "data-relation-with": `${objWith}_${withId}_${layerId}`
      })

    layerSpan.append(label);
    layerSpan.append(checkbox);

    return layerSpan;
  },

  "addRelationCheckbox": function(objFor, objWith, forId, withId, type) {
    type = type || "checkbox";
    
    let dataRelationFor = objFor.split("-")[0];
    dataRelationFor += (forId > -1) ? `_${forId}` : '';

    let checkbox = $("<input>")
      .attr({
        id: `${objFor}-layer-${withId}`,
        type: type,
        "data-relation-for": dataRelationFor,
        "data-relation-with": `${objWith}_${withId}`,
      })

    return checkbox;
  },

  "addMonRelation":  function(entity, relWith, monId, monName, type) {
    type = type || "checkbox";

    let monLayers = $("<div>").attr({
        class: `mon-checkboxes-${monId}`,
        "data-entity": entity,
        "data-input-type": type,
        "data-entity-with": relWith
      })
      .append(`<span class='mon-name-${monId}'>${monName}: </span>`);

    return monLayers;
  },

  "setPresentDate":  function() {
    _.each($("[data-need-date]"), function(field) {
      $(field).val(new Date().getTime());
    });
  },

  "addReportFile": function(button) {
    let reportFileId = 2;
    button.on('click', function(e) {
      button.before(`
        <input id="report-file-input-${reportFileId}" accept=".pdf,.doc,.docx" 
        type="file" data-for="rep:Report" name="fileid"></input>`
      );
      reportFileId++;
    });
  }
}