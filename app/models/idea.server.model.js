'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Idea Schema
 */
var IdeaSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	attachment:{ 
	    type: String, 
	    default: ''
	},
	originalName:{ 
	    type: String, 
	    default: ''
	},
	status: {
		type: String,
		default: 'Pending Admin Approval',
	},
	comment: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	volunteer: {
		type: [{
			type: String,
			enum: []
		}],
		default: []
	}
});

mongoose.model('Idea', IdeaSchema);