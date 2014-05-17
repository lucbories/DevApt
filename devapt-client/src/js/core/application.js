/**
 * @file        core/application.js
 * @desc        Devapt static application features
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptInit)
{
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @class
	 * @desc		Devapt application features container
	 */
	var DevaptApplication = function() {};
	
	
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptApplication.app_trace = false;
	
	
	/**
	 * @memberof	DevaptApplication
	 * @public
	 * @static
	 * @desc		Application configuration
	 */
	DevaptApplication.app_config = null;
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_config()
	 * @desc				Get application configuration associative array
	 * @return {object}		Application configuration
	 */
	DevaptApplication.get_config = function()
	{
		var context = 'DevaptApplication.get_config()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		if ( ! DevaptTypes.is_object(DevaptApplication.app_config) )
		{
			DevaptTrace.trace_leave(context, 'failure', DevaptApplication.app_trace);
			return null;
		}
		
		
		DevaptTrace.trace_leave(context, 'found', DevaptApplication.app_trace);
		return DevaptApplication.app_config;
	}
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.gset_config(arg_config)
	 * @desc				Get application configuration associative array
	 * @param {object}		Application configuration
	 * @return {boolean}		failure or success
	 */
	DevaptApplication.set_config = function(arg_config)
	{
		var context = 'DevaptApplication.set_config(arg_config)';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		// CHECK CONFIGURATION
		if ( ! DevaptTypes.is_object(arg_config) )
		{
			DevaptTrace.trace_leave(context, 'failure', DevaptApplication.app_trace);
			return false;
		}
		
		// SET CONFIGURATION
		DevaptApplication.app_config = arg_config;
		
		
		DevaptTrace.trace_leave(context, 'success', DevaptApplication.app_trace);
		return true;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.run()
	 * @desc				Init application and render views
	 * @return {nothing}
	 */
	DevaptApplication.run = function()
	{
		var context = 'DevaptApplication.run()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		// INIT BACKEND
		if ( ! Devapt.has_current_backend() )
		{
			DevaptTrace.trace_step(context, 'no current backend', DevaptApplication.app_trace);
			
			require(['backend-foundation5/backend'], function(foundation5_backend)
			{
				DevaptTrace.trace_step(context, 'set current backend', DevaptApplication.app_trace);
				
				// SET CURRENT BACKEND
				var result = Devapt.set_current_backend(foundation5_backend);
				if ( ! result)
				{
					console.error('Devapt.run: init backend failed');
					return;
				}
				
				// GET CURRENT BACKEND
				var backend = Devapt.get_current_backend();
				
				// INIT DEFAULT VIEW
				DevaptInit.init();
				
				// INIT TOP MENUBAR
				var topmenubar = DevaptApplication.get_topbar_name();
				var options= {'class_name':'Menubar', 'class_type':'view', 'trace':true, 'name':'menus' , 'menubar_name':topmenubar};
				backend.build_from_declaration(options, function(view) { view.render(); } );
			} );
		}
		else
		{
			var backend = Devapt.get_current_backend();
			
			
			// INIT DEFAULT VIEW
			DevaptInit.init();
			
			// INIT TOP MENUBAR
			var topmenubar = DevaptApplication.get_topbar_name();
			var options= {'class_name':'Menubar', 'class_type':'view', 'trace':true, 'name':'menus' , 'menubar_name':topmenubar};
			backend.build_from_declaration(options, function(view) { view.render(); } );
		}
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
	}
	
	
	/**
	 * @memberof				DevaptApplication
	 * @public
	 * @static
	 * @method					DevaptApplication.get_value(arg_path)
	 * @desc					Get application configuration value
	 * @param {string}			arg_value_path	Value path (aaa.bb.ccc.dd)
	 * @param {anything}		arg_default_value	Default value
	 * @return {anything}		Configuration value or null if not found
	 */
	DevaptApplication.get_value = function(arg_value_path, arg_default_value)
	{
		var context = 'DevaptApplication.get_value(value path, default value)';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		
		var path_array = arg_value_path.split('.');
		var path_node = DevaptApplication.app_config;
		for(path_node_index in path_array)
		{
			var path_node_value = path_array[path_node_index];
			if ( path_node[path_node_value] )
			{
				path_node = path_node[path_node_value];
				continue;
			}
			
			DevaptTrace.trace_leave(context, 'not found, returns default value', DevaptApplication.app_trace);
			return arg_default_value;
		}
		
		if ( path_node === DevaptApplication.app_config )
		{
			DevaptTrace.trace_leave(context, 'not found, returns default value', DevaptApplication.app_trace);
			return arg_default_value;
		}
		
		
		DevaptTrace.trace_leave(context, 'found', DevaptApplication.app_trace);
		return path_node;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_url_base()
	 * @desc				Get application configuration base url "application.url.base"
	 * @return {string}		Application base url
	 */
	DevaptApplication.get_url_base = function()
	{
		var context = 'DevaptApplication.get_url_base()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('url.base', null);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_home_view_url()
	 * @desc				Get application configuration home url "application.url.home"
	 * @return {string}		Application base url
	 */
	DevaptApplication.get_home_view_url = function(arg_)
	{
		var context = 'DevaptApplication.get_home_view_url()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('url.home', null);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	/**
	 * @memberof			DevaptApplication
	 * @public
	 * @static
	 * @method				DevaptApplication.get_topbar_name()
	 * @desc				Get application configuration "application.layouts.default.topbar.name"
	 * @return {string}		Application base url
	 */
	DevaptApplication.get_topbar_name = function()
	{
		var context = 'DevaptApplication.get_topbar_name()';
		DevaptTrace.trace_enter(context, '', DevaptApplication.app_trace);
		
		var value = DevaptApplication.get_value('layouts.default.topbar.name', null);
		
		DevaptTrace.trace_leave(context, '', DevaptApplication.app_trace);
		return value;
	}
	
	
	return DevaptApplication;
} );