/**
 * @file        datas/query.js
 * @desc        Devapt datas query class
 * 					QUERY version 2 FORMAT
 * 					{
 * 						action: '...',
 * 						crud_db: '...',
 * 						crud_table: '...',
 * 						fields: [],
 * 						one_field: '...',
 * 						values: {},
 * 						values_count: ...,
 * 						filters: [],
 * 						orders: [],
 * 						groups: [],
 * 						slice: { offset:'...', length:'...' },
 * 						joins: [],
 * 					}
 * 
 * @see			object/object.js
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'object/events', 'object/object'],
function(Devapt, DevaptTypes, DevaptClass, DevaptEvents, DevaptObject)
{
	/**
	 * @class				DevaptQuery
	 * @desc				Query class constructor
	 * @method				DevaptQuery.constructor
	 * @param {string}		arg_name				object name
	 * @param {object|null}	arg_options				associative array of name/value options
	 * @return {nothing}
	 */
	
	
	/**
	 * @memberof			DevaptQuery
	 * @public
	 * @method				DevaptQuery.constructor
	 * @desc				Query class constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var context = self.class_name + '.constructor[' + self.name + ']';
		self.enter(context, 'constructor');
		
		
		// INIT ATTRIBUTES
		// self.trace =  true;
		self.filters_array = new Array();
		self.filters_array_by_field = new Object();
		if (self.filters && self.filters.length > 0)
		{
			self.filters_array = self.filters;
		}
		
		
		self.leave(context, 'success');
	}
	
	
	
	/**
	 * @memberof			DevaptQuery
	 * @public
	 * @method				DevaptQuery.reset()
	 * @desc				Remove all configured attributes and set a basic read all query (preserve fields, crud_db and crud_table)
	 * @return {nothing}
	 */
	var cb_reset = function()
	{
		this.action = 'read';
		this.query_type = 'select';
		
		this.one_field = null;
		
		this.values = [];
		this.values_count = 0;
		
		this.filters_array = [];
		this.orders = [];
		this.groups = [];
		this.joins = [];
		
		this.slice = null;
	}
	
	
	
	/**
	 * @memberof			DevaptQuery
	 * @public
	 * @method				DevaptQuery.reset()
	 * @desc				Remove all configured attributes and set a basic read all query (reset one_field, values, filters, slice)
	 * @return {nothing}
	 */
	var cb_select_all = function()
	{
		this.action = 'read';
		this.query_type = 'select';
		
		this.one_field = null;
		
		this.values = [];
		this.values_count = 0;
		
		this.filters_array = [];
		this.slice = null;
	}
	
	
	
	/**
	 * @memberof			DevaptQuery
	 * @public
	 * @method				DevaptQuery.is_empty()
	 * @desc				Is empty
	 * @return {boolean}
	 */
	var cb_is_empty = function()
	{
		var self = this;
		var context = 'is_empty()';
		self.enter(context, '');
		
		var is_empty_action = (self.action === null && self.query_type === null) || (self.action === 'read' && self.query_type === 'select');
		var is_empty = is_empty_action && self.values.length && self.slice.length && self.filters_array.length;
		
		self.leave(context, 'success');
		return is_empty;
	}
	
	
	/**
	 * @memberof			DevaptQuery
	 * @public
	 * @method				DevaptQuery.get_json()
	 * @desc				Get query version 2 JSON object
	 * @return {object}
	 */
	var cb_get_json = function()
	{
		var self = this;
		var context = 'get_json()';
		self.enter(context, '');
		
		self.value(context, 'self.filters_array', self.filters_array);
		
		var json_obj = {
			query_json: {
				action: self.action,
				query_type: self.query_type,
				crud_db: self.crud_db,
				crud_table: self.crud_table,
				fields: self.fields,
				one_field: self.one_field,
				values: self.values,
				values_count: self.values_count,
				filters: self.filters_array,
				orders: self.orders,
				groups: self.groups,
				slice: self.slice,
				joins: self.joins
			}
		};
		// console.log(self.filters_array, self.name + '.' + context);
		// console.log(json_obj, context + '.json_obj');
		
		
		self.leave(context, 'success');
		return json_obj;
	}
	
	
	/**
	 * @memberof			DevaptQuery
	 * @public
	 * @method				DevaptQuery.get_key()
	 * @desc				Get query version 2 key string
	 * @return {string}
	 */
	var cb_get_key = function()
	{
		var self = this;
		var context = 'get_key()';
		self.enter(context, '');
		
		
		var json = self.get_json();
		var json_str = JSON.stringify(json);
		if ( ! DevaptTypes.is_not_empty_str(json_str) )
		{
			self.leave(context, Devapt.msg_failure);
			return null;
		}
		
		
		self.leave(context, Devapt.msg_success);
		return Devapt.hash('md5', json_str);
	}
	
	
	/**
	 * @memberof			DevaptQuery
	 * @public
	 * @method				DevaptQuery.remove_filters_for_field(field name)
	 * @desc				Remove all filters for the given field from the query
	 * @param {string}		arg_field_name
	 * @return {nothing}
	 */
	var cb_remove_filters_for_field = function(arg_field_name)
	{
		var self = this;
		var context = 'remove_filters_for_field(' + arg_field_name + ')';
		self.enter(context, '');
		
		
		self.value(context, 'self.filters_array', self.filters_array);
		// console.log(self, context + '.self');
		
		// GET FILTERS FOR FIELD
		var field_filters = self.filters_array_by_field[arg_field_name];
		if ( ! DevaptTypes.is_array(field_filters) )
		{
			self.leave(context, 'nothing to remove');
			return;
		}
		
		// TEST : REMOVE ALL
		if (field_filters.length === self.filters_array.length)
		{
			self.filters_array_by_field[arg_field_name] = [];
			self.filters_array = new Array();
			self.leave(context, 'remove all filters');
			return;
		}
		
		// LOOP ON FILTERS FOR FIELD
		var filter_key = null;
		for(filter_key in field_filters)
		{
			self.value(context, 'loop on filter key', filter_key);
			
			// GET FILTER
			var filter_ref = field_filters[filter_key];
			var filter_index = filter_ref.index;
			self.value(context, 'loop filter index', filter_index);
			// console.log('loop removed filter at ' + filter_index);
			
			// REMOVE FILTER
			self.filters_array.splice(filter_index, 1);
		}
		
		delete self.filters_array_by_field[arg_field_name];
//		self.filters_array_by_field[arg_field_name] = new Array();
//		
//		self.filters_array.forEach(
//			function(index, item, array)
//			{
//				if (item === null)
//				{
//					delete array[index];
//				}
//			}
//		);
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @memberof			DevaptQuery
	 * @public
	 * @method				DevaptQuery.add_filter(filter)
	 * @desc				Add a filter to the query
	 * @param {string}		arg_field_name
	 * @param {object}		arg_filter
	 * @param {boolean}		filter should be unique on this field
	 * @return {nothing}
	 */
	var cb_add_filter = function(arg_field_name, arg_filter, arg_is_unique)
	{
		var self = this;
		var context = 'add_filter(field name,filter,unique)';
		self.enter(context, '');
		
		
		// DEBUG
		// self.trace =  true;
		self.value(context, 'self.filters_array', self.filters_array);
		self.value(context, 'arg_filter', arg_filter);
		// console.log(self, context + ':query');
		
		// INIT FILTERS
		if ( ! DevaptTypes.is_array(self.filters_array) )
		{
			self.step(context, 'init Query filters');
			self.filters_array = new Array();
		}
		
		// REMOVE EXISTING FILED FILTERS
		if (arg_is_unique)
		{
			self.step(context, 'filter is unique');
			self.remove_filters_for_field(arg_field_name);
		}
		// self.value(context, 'filters', self.filters_array);
		// console.log(self.filters_array, context + '[' + self.name + '] filters before');
		self.value(context, 'filters before', self.filters_array);
		
		// ADD FILTER FOR FIELD
		var field_filters = self.filters_array_by_field[arg_field_name];
		if ( ! DevaptTypes.is_array(field_filters) )
		{
			self.step(context, 'init Query filters for field [' + arg_field_name + ']');
			self.filters_array_by_field[arg_field_name] = [];
			field_filters = self.filters_array_by_field[arg_field_name];
		}
		field_filters.push( { index:self.filters_array.length, field_name:arg_field_name } );
		// self.value(context, 'field_filters', field_filters);
		// console.log(field_filters, context + '[' + self.name + '].field_filters for [' + arg_field_name + ']');
		
		// ADD FILTER FOR QUERY
		self.filters_array.push(arg_filter);
		// self.value(context, 'filters', self.filters_array);
		// console.log(self.filters_array, context + '[' + self.name + '] filters after');
		
		// DEBUG
		// self.trace = false;
		
		
		self.leave(context, 'success');
	}
	
	
	
	// ONE FIELD
	var cb_set_one_field = function(arg_one_field)
	{
		// this.assert(arg_one_field instanceof LibaptField);
		this.one_field = arg_one_field;
		return true;
	}
	
	// ACTION METHOD - SET
	var cb_set_action = function(arg_action)
	{
		this.action = arg_action;
	}
	
	var cb_set_select = function()
	{
		this.action = 'read';
		this.query_type = 'select';
	}
	
	var cb_set_select_distinct = function()
	{
		this.action = 'read';
		this.query_type = 'select_distinct';
	}
	
	var cb_set_select_distinct_one = function()
	{
		this.action = 'read';
		this.query_type = 'select_distinct_one';
	}
	
	var cb_set_select_count = function()
	{
		this.action = 'read';
		this.query_type = 'select_count';
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-12',
			'updated':'2014-12-13',
			'description':'Datas query class.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptObject;
	var DevaptQueryClass = new DevaptClass('DevaptQuery', parent_class, class_settings);
	
	// METHODS
	DevaptQueryClass.infos.ctor = cb_constructor;
	
	DevaptQueryClass.add_public_method('reset', {}, cb_reset);
	DevaptQueryClass.add_public_method('select_all', {}, cb_select_all);
	DevaptQueryClass.add_public_method('is_empty', {}, cb_is_empty);
	
	DevaptQueryClass.add_public_method('get_json', {}, cb_get_json);
	DevaptQueryClass.add_public_method('get_key', {}, cb_get_key);
	
	DevaptQueryClass.add_public_method('add_filter', {}, cb_add_filter);
	DevaptQueryClass.add_public_method('remove_filters_for_field', {}, cb_remove_filters_for_field);
	
	DevaptQueryClass.add_public_method('set_one_field', {}, cb_set_one_field);
	DevaptQueryClass.add_public_method('set_action', {}, cb_set_action);
	DevaptQueryClass.add_public_method('set_select', {}, cb_set_select);
	DevaptQueryClass.add_public_method('set_select_distinct', {}, cb_set_select_distinct);
	DevaptQueryClass.add_public_method('set_select_distinct_one', {}, cb_set_select_distinct_one);
	DevaptQueryClass.add_public_method('set_select_count', {}, cb_set_select_count);
	
	// PROPERTIES
	DevaptQueryClass.add_public_str_property('is_query',		'object is a query', true, false, true, []);
	
	DevaptQueryClass.add_public_str_property('action',			'', null, true, false, []);
	DevaptQueryClass.add_public_str_property('query_type',		'', null, true, false, []);
	DevaptQueryClass.add_public_str_property('crud_db',			'', null, false, false, []);
	DevaptQueryClass.add_public_str_property('crud_table',		'', null, false, false, []);
	DevaptQueryClass.add_public_str_property('one_field',		'', null, true, false, []);
	DevaptQueryClass.add_public_str_property('values_count',	'', null, true, false, []);
	
	DevaptQueryClass.add_public_array_property('fields',		'', [], false, false, [], 'string', ',');
	DevaptQueryClass.add_public_array_property('values',		'', [], false, false, [], 'string', ',');
	DevaptQueryClass.add_public_array_property('filters',		'', [], false, false, [], 'object', '|');
	DevaptQueryClass.add_public_array_property('orders',		'', [], false, false, [], 'object', ',');
	DevaptQueryClass.add_public_array_property('groups',		'', [], false, false, [], 'string', ',');
	DevaptQueryClass.add_public_array_property('joins',			'', [], false, false, [], 'object', ',');
	
	DevaptQueryClass.add_public_object_property('slice',		'', null, false, false, []);
	
	
	return DevaptQueryClass;
} );