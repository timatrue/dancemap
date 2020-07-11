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

const StudioScheme = new Schema({
  type: {type: String,
  	required: [true, 'type field required']
  },
  properties: {
    type: {
      type: String,
      enum: "studio",
      required: [true, 'type marker field required']
    },
    name: {
  	  type: String,
  	  required: [true, 'name field required']
    },
    subtype: {
      type: String,
      required: [true, 'subtype field required']
    },
    altername: {
  	  type: String,
  	  required: [true, 'name field required']
    },
    desc: {
      type: String,
      required: [true, 'desc field required']
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
    	enum: ["Хастл","Зук","Сальса", "Бачата", "WCS"],
    	required: [true, 'speciality field required']
    },
    classes: {
    	hustle: {type: Boolean},
    	zouk: {type: Boolean},
    	wcs: {type: Boolean},
    	bachata: {type: Boolean},
    	salsa: {type: Boolean}
    },
    seoimage: { 
      data: Buffer,
      contentType: String
    },
    imagesMeta: {
      type: Object
    },
    uid: {
      type: String
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

const Studio = mongoose.model('studio', StudioScheme);


module.exports = Studio;