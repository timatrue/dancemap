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

index.events.all = new Supercluster({
  radius: 40,
  maxZoom: 17
});

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
  
  await Event.find({}).then(function(events) { 
    index.events.all.load(events);

    console.log('index_all_events', index.events.all);
  });
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