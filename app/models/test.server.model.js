'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Idea Schema
 */
var TestSchema = new Schema({
	username: {
		type: String,
		default: '',
		trim: true
	},
	employeeId: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Test', TestSchema);