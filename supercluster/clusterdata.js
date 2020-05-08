const Supercluster = require('supercluster')
const Studio = require('../models/studio')
const Event = require('../models/event')

let index = {
  studios: {},
  events: {}
};

/*memory usage debug
index.all1 = new Supercluster({radius: 40,maxZoom: 17});
index.all2 = new Supercluster({radius: 40,maxZoom: 17});
index.all3 = new Supercluster({radius: 40,maxZoom: 17});
index.all4 = new Supercluster({radius: 40,maxZoom: 17});
index.all5 = new Supercluster({radius: 40,maxZoom: 17});
index.all6 = new Supercluster({radius: 40,maxZoom: 17});
index.all7 = new Supercluster({radius: 40,maxZoom: 17});
index.all8 = new Supercluster({radius: 40,maxZoom: 17});
index.all9 = new Supercluster({radius: 40,maxZoom: 17});
index.all10 = new Supercluster({radius: 40,maxZoom: 17});*/


/*EVENTS*/
index.events.all = new Supercluster({
  radius: 40,
  maxZoom: 17
});

index.events.hustle = new Supercluster({
  radius: 40,
  maxZoom: 17
});

index.events.zouk = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.events.wcs = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.events.bachata = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.events.salsa = new Supercluster({
    radius: 40,
    maxZoom: 17
});

/*STUDIOS*/
index.studios.all = new Supercluster({
  radius: 40,
  maxZoom: 17
});


index.studios.hustle = new Supercluster({
  radius: 40,
  maxZoom: 17
});

index.studios.zouk = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.studios.wcs = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.studios.bachata = new Supercluster({
    radius: 40,
    maxZoom: 17
});

index.studios.salsa = new Supercluster({
    radius: 40,
    maxZoom: 17
});


async function getData() {
  /*EVENTS*/
  await Event.find({}).then(function(events) { 
    index.events.all.load(events);

    console.log('index_all_events', index.events.all);
  });
  await Event.find({'properties.classes.hustle': true}).then(function(events) { 
    index.events.hustle.load(events);
    console.log('index_hustle_events', index.events.hustle);
  });
  await Event.find({'properties.classes.zouk': true}).then(function(events) { 
    index.events.zouk.load(events);
    console.log('index_zouk_events', index.events.events);
  });
  await Event.find({'properties.classes.wcs': true}).then(function(events) { 
    index.events.wcs.load(events);
    console.log('index_wcs_events', index.events.wcs);
  });
  await Event.find({'properties.classes.bachata': true}).then(function(events) { 
    index.events.bachata.load(events);
    console.log('index_bachata_events', index.events.bachata);
  });
  await Event.find({'properties.classes.salsa': true}).then(function(events) { 
    index.events.salsa.load(events);
    console.log('index_salsa_events', index.events.events);
  });


/*STUDIOS*/
  await Studio.find({}).then(function(studios) { 
    index.studios.all.load(studios);

    console.log('index_all_studios', index.studios.all);
  });
  await Studio.find({'properties.classes.hustle': true}).then(function(studios) { 
    index.studios.hustle.load(studios);
    console.log('index_hustle_studios', index.studios.hustle);
  });
  await Studio.find({'properties.classes.zouk': true}).then(function(studios) { 
    index.studios.zouk.load(studios);
    console.log('index_zouk_studios', index.studios.zouk);
  });
  await Studio.find({'properties.classes.wcs': true}).then(function(studios) { 
    index.studios.wcs.load(studios);
    console.log('index_wcs_studios', index.studios.wcs);
  });
  await Studio.find({'properties.classes.bachata': true}).then(function(studios) { 
    index.studios.bachata.load(studios);
    console.log('index_bachata_studios', index.studios.bachata);
  });

  await Studio.find({'properties.classes.salsa': true}).then(function(studios) { 
    index.studios.salsa.load(studios);
    console.log('index_salsa_studios', index.studios.salsa);
  });
  return index;
}


module.exports = {getData, index};