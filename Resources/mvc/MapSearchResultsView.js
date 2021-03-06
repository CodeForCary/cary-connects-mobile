var MapCommands = require('/mvc/MapCommands');

var template = {
  properties: {
    height: '60dp'
  },
  childTemplates: [
    {
      type: 'Ti.UI.ImageView',
      bindId: 'image',
      properties: {
        top: '5dp',
        left: '15dp',
        width: '45dp',
        height: '45dp'
      }
    },
    {
      type: 'Ti.UI.Label',
      bindId: 'title',
      properties: {
        color: '#000000',
        font: {
          fontSize: '18dp'
        },
        top: '10dp',
        left: '65dp',
        right: '0',
        height: '24dp',
        wordWrap: false,
        ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_END
      }
    },
    {
      type: 'Ti.UI.Label',
      bindId: 'address',
      properties: {
        color: '#000000',
        font: {
          fontSize: '12dp'
        },
        top: '34dp',
        left: '65dp',
        right: '0',
        height: '18dp',
        wordWrap: false,
        ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_END
      }
    }
  ]
};

exports.createListView = function (win, view) {

  var label = Ti.UI.createLabel({
    top: 60 + 'dp',
    left: 20 + 'dp',
    right: 20 + 'dp',
    color: '#ffffff',
    text: 'Find parking in Cary by searching for the name of a business or place...'
  });
  view.add(label);

  var listView = Ti.UI.createListView({
    top: 60 + 'dp',
    left: 0,
    right: 0,
    bottom: 20 + 'dp',
    templates: {'template': template},
    defaultItemTemplate: 'template',
    backgroundColor: '#92bfd6',
    visible: false
  });
  var listSection = Ti.UI.createListSection({});
  listView.setSections([listSection]);
  view.add(listView);

  listView.addEventListener('itemclick', function (ev) {
    console.log('Item clicked');

    // Find the record
    var itemId = ev.itemId;
    var record = MapCommands.places[itemId];
    Ti.App.fireEvent('HideSearch');
    Ti.App.fireEvent('ShowPlaceCard', {
      record: record
    });
    Ti.App.fireEvent('ShowMapMarker', {
      record: record
    });
  });

  // Add Global Event Listeners
  Ti.App.addEventListener('UpdateSearchResults', function (ev) {
    console.log('MapSearchResultsView.UpdateSearchResults() called');

    // Determine if results can be shown
    var records = ev.records;
    if (records === undefined || records.length === 0) {
      listView.hide();
      return;
    }

    // Determine the search results
    var rowData = [];
    for (var i = 0; i < records.length; i++) {

      var thisRecord = records[i];

      var rowParameters = {
        title: {
          text: thisRecord.name
        },
        address: {
          text: thisRecord.address
        },
        properties: {
          itemId: thisRecord.itemId,
          accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
          backgroundColor: '#92bfd6'
        }
      };
      if (Ti.UI.iOS) {
        rowParameters.properties.selectionStyle = Ti.UI.iOS.ListViewCellSelectionStyle.NONE;
      }
      rowData.push(rowParameters);
    }

    // listSection.appendItems(rowData);
    listSection.setItems(rowData);

    // Show the results
    listView.show();
  });

  return listView;
};