const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
	type: {
		type: String,
		default: 'Point'
	},
	coordinates: {
		type: [Number],
		index: '2dsphere'
	}
});

const EventScheme = new Schema({
  type: {type: String,
  	required: [true, 'type field required']
  },
  properties: {
    type: {
      type: String,
      enum: "event",
      required: [true, 'type marker field required']
    },
    name: {
  	  type: String,
  	  required: [true, 'name field required']
    },
    altername: {
  	  type: String,
  	  required: [true, 'name field required']
    },
    address: {
  	  type: String,
  	  required: [true, 'address field required']
    },
    city: {
  	  type: String,
  	  required: [true, 'city field required']
    },
    country: {
      type: String,
      required: [true, 'country field required']
    },
    vk: {
      type: String
    },
    speciality: {
    	type: [String],
    	enum: ["Хастл","Зук","Сальса", "Бачата", "WCS"]
    },
    classes: {
    	hustle: {type: Boolean},
    	zouk: {type: Boolean},
    	wcs: {type: Boolean},
    	bachata: {type: Boolean},
    	salsa: {type: Boolean}
    },
    activities: {
      masterclass: {type: Boolean},
      party: {type: Boolean},
      fest: {type: Boolean},
      competition: {type: Boolean},
      online: {type: Boolean}
    },
    seoimage: { data: Buffer, contentType: String },
    start: Date,
    end: Date,
    nestedgroup: {
      type: [String]
    },
    offers: {
      type: [Object]
    }
  },/*
  city: {
  	type: String,
  	required: [true, 'city field required']
  },
  country: {
  	type: String,
  	required: [true, 'country field required']
  },
  available: {
  	type: Boolean,
  	default: true
  },*/
  geometry: GeoSchema

});

const Event = mongoose.model('event', EventScheme);


module.exports = Event;