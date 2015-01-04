/**
 * @file        core/nav-history.js
 * @desc        Devapt static navigation history features
 * @ingroup     DEVAPT_CORE
 * @date        2014-06-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/classes', 'core/mixin-assertion', 'core/event', 'core/events'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptMixinAssertion, DevaptEvent, DevaptEvents)
{
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @class
	 * @desc		Devapt navigation history features container
	 */
	var DevaptNavHistory = function() {};
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptNavHistory.history_trace = false;
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.current_topbar_object
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.current_topbar_name = null;
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.history_stack
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.history_stack = [];
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.history_map
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.history_map = {};
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.history_breadcrumbs_name
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.history_breadcrumbs_name = null;
	
	
	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @static
	 * @property	DevaptNavHistory.history_breadcrumbs_object
	 * @desc		... (static attribute)
	 */
	DevaptNavHistory.history_breadcrumbs_object = null;
	
	
	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.append_callback_on_add(arg_callback_function)
	 * @desc					Append a new callback to call on each new event
	 * @param {function}		arg_callback_function
	 * @return {nothing}
	 */
	DevaptNavHistory.init = function()
	{
		console.info('DevaptNavHistory.init');
		
		var $ = Devapt.jQuery();
		
		if (window.popstate)
		{
			$(window).bind('popstate',
				function(e)
				{
					return DevaptNavHistory.on_hash_change(e);
				}
			);
		}
		else
		{
			$(window).bind('hashchange',
				function(e)
				{
					return DevaptNavHistory.on_hash_change(e);
				}
			);
		}
		
		// REGISTER HOME PAGE
		var content_label	= 'Home';
		var content_id		= null;
		var content_url		= window.location.pathname;
		var page_title		= 'Home';
		var page_location	= window.location.pathname;
		DevaptNavHistory.push_url_content(content_label, content_id, content_url, page_title, page_location);
	}
	


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.get_location_hash()
	 * @desc					Get location hash (pathname part after the #) (null if no hash part)
	 * @return {string|null}
	 */
	DevaptNavHistory.get_location_hash = function()
	{
		var context = 'DevaptNavHistory.get_location_hash()';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		DevaptTraces.trace_var(context, 'hash', window.location.hash, DevaptNavHistory.history_trace);
		var href = window.location.hash;
		var hash_index = href.indexOf('#');
		
		return hash_index >= 0 ? href.substr(hash_index + 1) : null;
	}


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.on_hash_change(event)
	 * @desc					Do actions on location hash (pathname part after the #) change
	 * @param {object}			arg_window_event
	 * @return {boolean}
	 */
	DevaptNavHistory.on_hash_change = function(arg_window_event)
	{
		var context = 'DevaptNavHistory.on_hash_change(event)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// console.error(arg_window_event);
		
		var state_key = DevaptNavHistory.get_location_hash();
		DevaptTraces.trace_var(context, 'state_key', state_key, DevaptNavHistory.history_trace);
		DevaptTraces.trace_var(context, 'hash after state key', window.location.hash, DevaptNavHistory.history_trace);
		
		var state = DevaptNavHistory.history_map[state_key];
		DevaptTraces.trace_var(context, 'state', state, DevaptNavHistory.history_trace);
		
		if ( ! state && state_key && state_key.substr(0, 5) === 'view:' )
		{
			DevaptTraces.trace_step(context, 'process view hash', DevaptNavHistory.history_trace);
			var hash_parts = state_key.split(':');
			if (hash_parts.length === 4 || hash_parts.length === 5)
			{
				DevaptTraces.trace_step(context, 'process view hash parts', DevaptNavHistory.history_trace);
				state =
				{
					content_label:	hash_parts[3],
					content_id:		'page_content_id',
					content_url:	null,
					content_cb:		null,
					content_html:	null,
					content_view:	hash_parts[1],
					page_title:		hash_parts[2],
					page_location:	window.location.pathname + window.location.hash,
					menubar_name:	(hash_parts.length === 5) ? hash_parts[4] : DevaptNavHistory.current_topbar_name
				};
				DevaptTraces.trace_var(context, 'state', state, DevaptNavHistory.history_trace);
			}
		}
		
		if (state)
		{
			DevaptTraces.trace_var(context, 'hash for state', window.location.hash, DevaptNavHistory.history_trace);
			var result = DevaptNavHistory.set_content(state, true);
			if (! result)
			{
				DevaptTraces.trace_leave(context, 'failure', DevaptNavHistory.history_trace);
				return true; // do not propagate event
			}
		}
		
		
		DevaptTraces.trace_leave(context, 'success', DevaptNavHistory.history_trace);
		return true; // do not propagate event
	}


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.push_html_content(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
	 * @desc					Push an html update on the navigation history stack
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {string}		arg_content_html
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @return {nothing}
	 */
	DevaptNavHistory.push_html_content = function(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
	{
		var context = 'DevaptNavHistory.push_html_content(...)';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	null,
				content_cb:		null,
				content_html:	arg_content_html,
				content_view:	null,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	arg_page_location ? arg_page_location : null,
				menubar_name:	DevaptNavHistory.current_topbar_name
			};
		var state_key = 'html:' + arg_page_title + ':' + arg_content_label + ':' + state.menubar_name;
		DevaptNavHistory.history_stack.push(state);
		DevaptNavHistory.history_map[state_key] = state;
		
		// UPDATE BREADCRUMBS
		DevaptNavHistory.update_breadcrumbs(state);
	}


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.push_cb_content(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
	 * @desc					Push a javascript callback on the navigation history stack
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {function}		arg_content_cb
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @return {nothing}
	 */
	DevaptNavHistory.push_cb_content = function(arg_content_label, arg_content_id, arg_content_cb, arg_page_title, arg_page_location)
	{
		var context = 'DevaptNavHistory.push_cb_content(...)';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	null,
				content_cb:		arg_content_cb,
				content_html:	null,
				content_view:	null,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	arg_page_location ? arg_page_location : null,
				menubar_name:	DevaptNavHistory.current_topbar_name
			};
		var state_key = 'cb:' + arg_page_title + ':' + arg_content_label + ':' + state.menubar_name;
		DevaptNavHistory.history_stack.push(state);
		DevaptNavHistory.history_map[state_key] = state;
		
		// UPDATE BREADCRUMBS
		DevaptNavHistory.update_breadcrumbs(state);
	}


	/**
	 * @memberof				DevaptNavHistory
	 * @public
	 * @method					DevaptNavHistory.push_url_content(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
	 * @desc					Push a javascript callback on the navigation history stack
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {function}		arg_content_url
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @return {nothing}
	 */
	DevaptNavHistory.push_url_content= function(arg_content_label, arg_content_id, arg_content_url, arg_page_title, arg_page_location)
	{
		var context = 'DevaptNavHistory.push_url_content(...)';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	arg_content_url,
				content_cb:		null,
				content_html:	null,
				content_view:	null,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	arg_page_location ? arg_page_location : null,
				menubar_name:	DevaptNavHistory.current_topbar_name
			};
		var state_key = 'url:' + arg_page_title + ':' + arg_content_label + ':' + state.menubar_name;
		DevaptNavHistory.history_stack.push(state);
		DevaptNavHistory.history_map[state_key] = state;
		
		// UPDATE BREADCRUMBS
		DevaptNavHistory.update_breadcrumbs(state);
	}


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.push_view_content(lable, id, html, title, location)
	 * @desc				Push a javascript callback on the navigation history stack
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {function}	arg_content_view_name
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @return {nothing}
	 */
	DevaptNavHistory.push_view_content= function(arg_content_label, arg_content_id, arg_content_view_name, arg_page_title, arg_page_location)
	{
		var context = 'DevaptNavHistory.push_view_content(...)';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		var state =
			{
				content_label:	arg_content_label,
				content_id:		arg_content_id,
				content_url:	null,
				content_cb:		null,
				content_html:	null,
				content_view:	arg_content_view_name,
				page_title:		arg_page_title ? arg_page_title : null,
				page_location:	arg_page_location ? arg_page_location : null,
				menubar_name:	DevaptNavHistory.current_topbar_name
			};
		var state_key = 'view:' + arg_content_view_name + ':' + arg_page_title + ':' + arg_content_label + ':' + state.menubar_name;
		DevaptNavHistory.history_stack.push(state);
		DevaptNavHistory.history_map[state_key] = state;
		
		// UPDATE BREADCRUMBS
		DevaptNavHistory.update_breadcrumbs(state);
	}


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.update_breadcrumbs()
	 * @desc				Update application breadcrumbs (static method)
	 * @param {object}		arg_state			navigation history state object
	 * @return {nothing}
	 */
	DevaptNavHistory.update_breadcrumbs = function(arg_state)
	{
		var context = 'DevaptNavHistory.update_breadcrumbs(state)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		// console.log(arg_state, 'arg_state');
		// console.log(arg_state.menubar_name ? arg_state.menubar_name : 'null', 'arg_state.menubar_name');
		
		if (DevaptNavHistory.history_stack.length < 2)
		{
			DevaptTraces.trace_leave(context, 'nothing to update', DevaptNavHistory.history_trace);
			return;
		}
		
		if ( DevaptTypes.is_object(DevaptNavHistory.history_breadcrumbs_object) && DevaptTypes.is_object(arg_state) )
		{
			DevaptTraces.trace_step(context, 'fire event', DevaptNavHistory.history_trace);
			var event_name = 'nav-history.add';
			var event = DevaptEvent.create(event_name, { emitter_object:DevaptNavHistory.history_breadcrumbs_object, operands_array:[arg_state] } );
			DevaptEvents.fire(event);
		}
		
		
		DevaptTraces.trace_leave(context, '', DevaptNavHistory.history_trace);
	}


	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @method		DevaptNavHistory.reset()
	 * @desc		Remove all navigation history (static method)
	 * @return {nothing}
	 */
	DevaptNavHistory.reset = function()
	{
		var context = 'DevaptNavHistory.reset()';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		DevaptNavHistory.history_stack = [];
		DevaptNavHistory.history_map = {};
	}


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.go_back()
	 * @desc				Go back in navigation history (static method)
	 * @return {nothing}
	 */
/*	DevaptNavHistory.go_back = function()
	{
		var context = 'DevaptNavHistory.go_back()';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		if ( ! DevaptTypes.is_not_empty_array(DevaptNavHistory.history_stack) )
		{
			DevaptTraces.trace_step(context, 'stack is empty', DevaptNavHistory.history_trace);
			return;
		}
		
		// DevaptNavHistory.history_stack = [];
	}*/


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.go_forward()
	 * @desc				Go forward in navigation history (static method)
	 * @return {nothing}
	 */
/*	DevaptNavHistory.go_forward = function()
	{
		var context = 'DevaptNavHistory.go_forward()';
		DevaptTraces.trace_step(context, '', DevaptNavHistory.history_trace);
		
		if ( ! DevaptTypes.is_not_empty_array(DevaptNavHistory.history_stack) )
		{
			DevaptTraces.trace_step(context, 'stack is empty', DevaptNavHistory.history_trace);
			return;
		}
		
		// DevaptNavHistory.history_stack = [];
	}*/


	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.set_content(state)
	 * @desc				Set page content (static method)
	 * @param {object}		arg_state			navigation history state object
	 * @param {boolean}		arg_force_render
	 * @return {boolean|promise}
	 */
	DevaptNavHistory.set_content = function(arg_state, arg_force_render)
	{
		var context = 'DevaptNavHistory.set_content(state)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// CHECK STATE OBJECT
		if ( ! DevaptTypes.is_object(arg_state) )
		{
			DevaptTraces.trace_leave(context, 'state is not an object', DevaptNavHistory.history_trace);
			return false;
		}
		// console.log(arg_state, 'set_content.state');
		
		
		// GET STATE ATTRIBUTES
		var content_label	= arg_state.content_label;
		var content_id		= arg_state.content_id;
		var content_url		= arg_state.content_url;
		var content_cb		= arg_state.content_cb;
		var content_html	= arg_state.content_html;
		var content_view	= arg_state.content_view;
		var page_title		= arg_state.page_title;
		var page_location	= arg_state.page_location;
		var menubar_name	= arg_state.menubar_name;
		
		
		// CHECK STATE
		if ( ! DevaptTypes.is_not_empty_str(content_label) )
		{
			DevaptTraces.trace_leave(context, 'bad state content label', DevaptNavHistory.history_trace);
			return false;
		}
		if ( ! DevaptTypes.is_not_empty_str(page_title) )
		{
			DevaptTraces.trace_leave(context, 'bad state page title', DevaptNavHistory.history_trace);
			return false;
		}
		if ( ! DevaptTypes.is_not_empty_str(page_location) )
		{
			DevaptTraces.trace_leave(context, 'bad state page location', DevaptNavHistory.history_trace);
			return false;
		}
		
		
		// SWITCH TOP MENUBAR
		if (DevaptNavHistory.current_topbar_name && menubar_name)
		{
			if (DevaptNavHistory.current_topbar_name !== menubar_name)
			{
				// console.log('DevaptNavHistory.current_topbar_name !== menubar_name');
				
				var current_menubar_object = DevaptClasses.get_instance(DevaptNavHistory.current_topbar_name);
				var target_menubar_object = DevaptClasses.get_instance(menubar_name);
				
				if (current_menubar_object)
				{
					if (target_menubar_object)
					{
						if (target_menubar_object.is_rendered)
						{
							DevaptTraces.trace_step(context, 'menubar exists and is rendered', DevaptNavHistory.history_trace);
							current_menubar_object.switch_top_menubar(target_menubar_object, false);
						}
						else
						{
							var render_promise = target_menubar_object.render();
							render_promise.done(
								function()
								{
									DevaptTraces.trace_step(context, 'menubar exists and is now rendered', DevaptNavHistory.history_trace);
									current_menubar_object.switch_top_menubar(target_menubar_object, false);
								}
							);
						}
					}
					else
					{
						if ( DevaptTypes.is_not_empty_str(menubar_name) )
						{
							// CREATE AND RENDER NEW MENUBAR
							self.step(context, 'create menubar and render it');
							var backend = Devapt.get_current_backend();
							var topmenubar_promise = backend.render_view(null, menubar_name);
							topmenubar_promise.done(
								function()
								{
									self.step(context, 'menubar created and rendered');
									
									var menubar_object = DevaptClasses.get_instance(menubar_name);
									self.value(context, 'menubar_object.name', menubar_object.name);
									self.value(context, 'menubar_object.is_rendered', menubar_object.is_rendered);
									
									current_menubar_object.switch_top_menubar(menubar_object, true);
								}
							);
						}
					}
				}
			}
		}
		
		
		// HTML CONTENT
		if ( DevaptTypes.is_not_empty_str(content_id) && DevaptTypes.is_not_empty_str(content_html) )
		{
			// console.log('set_page_html_content', context);
			var result = DevaptNavHistory.set_page_html_content(content_label, content_id, content_html, page_title, page_location, arg_force_render);
			
			DevaptTraces.trace_leave(context, 'set html content', DevaptNavHistory.history_trace);
			return result;
		}
		
		// VIEW CONTENT
		if ( DevaptTypes.is_not_empty_str(content_id) && DevaptTypes.is_not_empty_str(content_view) )
		{
			// console.log('set_page_view_content', context);
			var result = DevaptNavHistory.set_page_view_content(content_label, content_id, content_view, page_title, page_location, arg_force_render, menubar_name);
			
			DevaptTraces.trace_leave(context, 'set view content', DevaptNavHistory.history_trace);
			return result;
		}
		
		// URL CONTENT
		if ( DevaptTypes.is_not_empty_str(content_url) )
		{
			// console.log('content_url', context);
			window.title = page_title;
			window.location = page_location;
			
			// SAVE NAVIGATION
			if (arg_force_render)
			{
				DevaptNavHistory.push_html_content(content_label, content_id, content_html, page_title, page_location)
			}
			
			DevaptTraces.trace_leave(context, 'set view content', DevaptNavHistory.history_trace);
			return result;
		}
		
		
		DevaptTraces.trace_leave(context, 'bad state content', DevaptNavHistory.history_trace);
		return false;
	}
	

	/**
	 * @memberof			DevaptNavHistory
	 * @public
	 * @method				DevaptNavHistory.set_page_html_content(label, id, html, title, location)
	 * @desc				Go forward in navigation history (static method)
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {string}		arg_content_html
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @param {boolean}		arg_force_render
	 * @return {boolean}
	 */
	DevaptNavHistory.set_page_html_content = function(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location, arg_force_render)
	{
		var context = 'DevaptNavHistory.set_page_html_content(...)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// GET CONTENT JQO
		var page_container_jqo = $('#' + arg_content_id);
		if ( ! page_container_jqo)
		{
			return DevaptTraces.trace_leaveko(context, 'bad content id [' + arg_content_id + ']', false, DevaptNavHistory.history_trace);
		}
		
		// GET CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		self.assertNotNull(context, 'backend', backend);
		
		// SAVE NAVIGATION
		if (arg_force_render)
		{
			DevaptNavHistory.push_html_content(arg_content_label, arg_content_id, arg_content_html, arg_page_title, arg_page_location)
		}
		
		// UPDATE PAGE CONTENT
		var div_jqo = $('<div>').html(arg_content_html);
		page_container_jqo.append(div_jqo);
		
		window.title = arg_page_title;
		window.location = arg_page_location;
		
		
		DevaptTraces.trace_leve(context, '', DevaptNavHistory.history_trace);
		return true;
	}


	/**
	 * @memberof	DevaptNavHistory
	 * @public
	 * @method		DevaptNavHistory.set_page_view_content(label, id, view, title, location)
	 * @desc		Go forward in navigation history (static method)
	 * @param {string}		arg_content_label
	 * @param {string}		arg_content_id
	 * @param {string}		arg_content_html
	 * @param {string}		arg_page_title
	 * @param {string}		arg_page_location
	 * @param {boolean}		arg_force_render
	 * @param {string}		arg_menubar_name
	 * @return {object}		render promise object
	 */
	DevaptNavHistory.set_page_view_content = function(arg_content_label, arg_content_id, arg_content_view_name, arg_page_title, arg_page_location, arg_force_render, arg_menubar_name)
	{
		var context = 'DevaptNavHistory.set_page_view_content(...)';
		DevaptTraces.trace_enter(context, '', DevaptNavHistory.history_trace);
		
		
		// UPDATE TITLE AND LOCATION
		window.title = arg_page_title;
		var new_hash = 'view:' + arg_content_view_name + ':' + arg_page_title + ':' + arg_content_label;
		if ( DevaptTypes.is_not_empty_str(arg_menubar_name) )
		{
			new_hash += ':' + arg_menubar_name;
		}
		if ( DevaptNavHistory.get_location_hash() !== new_hash )
		{
			DevaptTraces.trace_step(context, 'update location hash', DevaptNavHistory.history_trace);
			DevaptTraces.trace_var(context, 'current hash', DevaptNavHistory.get_location_hash(), DevaptNavHistory.history_trace);
			DevaptTraces.trace_var(context, 'target hash', new_hash, DevaptNavHistory.history_trace);
			window.location.hash = new_hash;
		}
		
		// SAVE NAVIGATION
		if (arg_force_render)
		{
			DevaptNavHistory.push_view_content(arg_content_label, arg_content_id, arg_content_view_name, arg_page_title, arg_page_location);
			DevaptTraces.trace_var(context, 'hash after push_view_content', window.location.hash, DevaptNavHistory.history_trace);
		}
		
		
		// if ( ! arg_force_render )
		// {
			// var deferred = $.Deferred();
			// deferred.resolve();
			// var promise = deferred.promise();
			
			// DevaptTraces.trace_leave(context, 'nothing to do', DevaptNavHistory.history_trace);
			// return promise;
		// }
		
		
		// GET CONTENT JQO
		var page_container_jqo = $('#' + arg_content_id);
		if ( ! page_container_jqo)
		{
			return DevaptTraces.trace_leaveko(context, 'bad content id [' + arg_content_id + ']', false, DevaptNavHistory.history_trace);
		}
		page_container_jqo.children().hide();
		DevaptTraces.trace_var(context, 'hash after container hide', window.location.hash, DevaptNavHistory.history_trace);
		
		
		// SHOW AN EXISTING VIEW
		var view_object = DevaptClasses.get_instance(arg_content_view_name);
		// console.log(view_object, context + ':view_object for [' + arg_content_view_name + ']');
		if (view_object)
		{
			view_object.content_jqo.show();
			DevaptTraces.trace_var(context, 'hash after content show', window.location.hash, DevaptNavHistory.history_trace);
			
			var deferred = $.Deferred();
			deferred.resolve();
			var promise = deferred.promise();
			
			DevaptTraces.trace_leave(context, 'show existing view', DevaptNavHistory.history_trace);
			return promise;
		}
		
		
		// GET CURRENT BACKEND
		var backend = Devapt.get_current_backend();
		DevaptMixinAssertion.infos.proto.assert_not_null(context, 'backend', backend);
		
		
		// RENDER VIEW
		var promise = backend.render_view(page_container_jqo, arg_content_view_name);
		DevaptTraces.trace_var(context, 'hash after render view', window.location.hash, DevaptNavHistory.history_trace);
		
		
		DevaptTraces.trace_leave(context, 'async renderer', DevaptNavHistory.history_trace);
		return promise;
	}

	
	return DevaptNavHistory;
} );