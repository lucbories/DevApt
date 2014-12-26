/**
 * @file        backend-foundation5/views/breadcrumbs.js
 * @desc        Foundation 5 breadcrumbs class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-06-28
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'views/view', 'core/nav-history', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptView, DevaptNavHistory, undefined)
{
	/**
	 * @public
	 * @class				DevaptBreadcrumbs
	 * @desc				Breadcrumbs view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptBreadcrumbs
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;
		var context = 'render_self(deferred)';
		self.enter(context, '');
		
		
		// CHECK DEFEREED
		self.assertNotNull(context, 'arg_deferred', arg_deferred);
		
		// GET NODES
		self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
		
		// RENDER
		self.content_jqo = $('<ul>');
		self.content_jqo.addClass('breadcrumbs');
		self.parent_jqo.append(self.content_jqo);
		
		
		// LOOP ON NAV HISTORY
		var nav_stack = DevaptNavHistory.history_stack;
		self.value(context, 'breadcrumbs html content', nav_stack);
		for(content_key in nav_stack)
		{
			var state = nav_stack[content_key];
			self.assertNotNull(context, 'nav content at [' + content_key + ']', state);
			self.add_history_item(state);
		}
		
		
		// RESOVE RENDER
		arg_deferred.resolve(self);
		
		// GET PROMISE
		var promise = arg_deferred.promise();
		// console.log(promise, 'promise');
		
		
		self.leave(context, 'success: promise is resolved');
		return promise;
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptBreadcrumbs
	 * @desc				Add an history item
	* @param {object}		arg_state		[target object, navigation history state object]
	 * @return {nothing}
	 */
	var cb_add_history_item = function(arg_state)
	{
		var self = this;
		var context = 'add_history_item(state)';
		self.enter(context, '');
		
		
		// console.log(arg_state, 'arg_state');
		self.assertNotNull(context, 'arg_state', arg_state);
		self.assertNotEmptyString(context, 'arg_state.content_label', arg_state.content_label);
		if ( self.history_labels[arg_state.content_label] )
		{
			self.leave(context, 'success: already in history');
			return;
		}
		
		self.history_labels[arg_state.content_label] = arg_state;
		
		
		var li_jqo = $('<li>');
		self.content_jqo.append(li_jqo);
		
		var a_jqo = $('<a>');
		li_jqo.append(a_jqo);
		
		a_jqo.attr('href', '#');
		a_jqo.text(arg_state.content_label);
		a_jqo.click(
			(
				function(state)
				{
					return function()
					{
						// console.log(state, context + '.onclick');
						DevaptNavHistory.set_content(state, true);
					}
				}
			)(arg_state)
		);
		
		
		self.leave(context, 'success');
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptBreadcrumbs
	 * @desc				On navigation history new item
	* @param {object}		arg_operands_array		[event object, target object, navigation history state object]
	 * @return {nothing}
	 */
	var cb_on_nav_history_add = function(arg_operands_array)
	{
		var self = this;
		var context = 'on_nav_history_add(event opds)';
		self.enter(context, '');
		
		// console.log(arg_operands_array, 'breadcrumbs arg_operands_array');
		var arg_state = arg_operands_array[2];
		self.add_history_item(arg_state);
		
		
		self.leave(context, 'success');
	}
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-06-28',
			updated:'2014-12-06',
			description:'Breadrumbs View class.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptView;
	var DevaptBreadcrumbsClass = new DevaptClass('DevaptBreadcrumbs', parent_class, class_settings);
	
	// METHODS
	DevaptBreadcrumbsClass.add_public_method('render_self', {}, cb_render_self);
	DevaptBreadcrumbsClass.add_public_method('add_history_item', {}, cb_add_history_item);
	DevaptBreadcrumbsClass.add_public_method('on_nav_history_add', {}, cb_on_nav_history_add);
	
	// PROPERTIES
	DevaptBreadcrumbsClass.add_public_obj_property('history_labels',	'',		{}, true, false, []);
	
	
	return DevaptBreadcrumbsClass;
} );