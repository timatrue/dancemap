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
  properties: {
    name: {
  	  type: String,
  	  required: [true, 'name field required']
    },
    address: {
  	  type: String,
  	  required: [true, 'address field required']
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