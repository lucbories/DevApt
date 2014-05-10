/**
 * @file     	Devapt.js
 * @desc     	Devapt static common features: Devapt static class, traces, errors, types, inheritance, modules, resources, utils
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define('Devapt', ['jquery'], function($)
{
	console.info('Loading Devapt bootstrap');
	
	
	/**
	 * @ingroup    			LIBAPT_MAIN_JS
	 * @public
	 * @static
	 * @class				Devapt
	 * @desc				Provide common features : types test, modules repository, classes inheritance
	 */
	var Devapt = function()
	{
	}
	
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @desc				Trace flag
	 */
	Devapt.trace = true;
	
	
	
	/**
	 * @memberof     		Devapt
	 * @public
	 * @static
	 * @method				Devapt
	 * @desc				Provide jQuery object
	 * @return {object}		jQuery object
	 */
	Devapt.jQuery = function()
	{
		return $;
	}
	
	
	
	// -------------------------------------------------- BACKEND ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @desc				current backend
	 */
	Devapt.current_backend = null;
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.get_current_backend()
	 * @desc				Get the current backend
	 * @return {object}		A backend object
	 */
	Devapt.get_current_backend = function()
	{
		return Devapt.current_backend;
	}
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.has_current_backend()
	 * @desc				Test if a current backend exists
	 * @return {boolean}	Has a backend ?
	 */
	Devapt.has_current_backend = function()
	{
		return Devapt.current_backend !== null;
	}
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.set_current_backend(arg_current_backend)
	 * @desc				set the current backend
	 * @param {object}		arg_current_backend		backend object
	 * @return {boolean}	success or failure
	 */
	Devapt.set_current_backend = function(arg_current_backend)
	{
		if ( Devapt.is_valid_backend(arg_current_backend) )
		{
			Devapt.current_backend = arg_current_backend;
			return true;
		}
		
		console.error('Devapt.set_current_backend : bad backend object');
		return false;
	}
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.is_valid_backend(arg_backend)
	 * @desc				Test if the given backend is valid
	 * @param {object}		arg_backend		backend object
	 * @return {boolean}	success or failure
	 */
	Devapt.is_valid_backend = function(arg_backend)
	{
		if ( ! arg_backend.get_infos )
		{
			console.log('Devapt.is_valid_backend: no "get_infos" function');
			return false;
		}
		
		if ( ! arg_backend.build_from_declaration )
		{
			console.log('Devapt.is_valid_backend: no "build_from_declaration" function');
			return false;
		}
		
		if ( ! arg_backend.render_page )
		{
			console.log('Devapt.is_valid_backend: no "render_page" function');
			return false;
		}
		
		if ( ! arg_backend.render_view )
		{
			console.log('Devapt.is_valid_backend: no "render_view" function');
			return false;
		}
		
		if ( ! arg_backend.render_login )
		{
			console.log('Devapt.is_valid_backend: no "render_login" function');
			return false;
		}
		
		if ( ! arg_backend.render_logout )
		{
			console.log('Devapt.is_valid_backend: no "render_logout" function');
			return false;
		}
		
		if ( ! arg_backend.render_error )
		{
			console.log('Devapt.is_valid_backend: no "render_error" function');
			return false;
		}
		
		return true;
	}
	
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.get_current_backend
	 * @desc				Get the current backend
	 * @return {object}		A backend object
	 */
	Devapt.get_current_backend = function()
	{
		return Devapt.current_backend;
	}
	
	
	
	// -------------------------------------------------- UTILS ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.register(arg_modules)
	 * @desc				Register a module definition
	 * @param {object}		arg_modules			module object to register
	 * @return {nothing}
	 */
	Devapt.get_prototype_name = function(arg_prototype)
	{
		if (arg_prototype.name === undefined)
		{
			var funcNameRegex = /function\s+(.{1,})\s*\(/;
			var results = funcNameRegex.exec(arg_prototype.toString());
			return (results && results.length > 1) ? results[1] : null;
		}
		
		return arg_prototype.name
	}
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.use_css(arg_css_files)
	 * @desc				Register a list of css files
	 * @param {object}		arg_css_files	css files array
	 * @return {nothing}
	 */
	Devapt.use_css = function(arg_css_files)
	{
		console.log('Devapt.use_css [' + arg_css_files + ']');
		
		// LOAD MODULE CSS FILES
		if (arg_css_files)
		{
			// CHECK ARRAY
			var css_files = arg_css_files;
			var arg_is_string = typeof arg_css_files == 'string' || typeof arg_css_files == 'String';
			if (arg_is_string)
			{
				css_files = [ arg_css_files ];
			}
			
			// LOOP ON MODULE CSS FILES
			for(css_file_index in css_files)
			{
				var url = css_files[css_file_index];
				
				$('head').append('<link>');
				var css = $('head').children(':last');
				css.attr(
					{
						rel:  "stylesheet",
						type: "text/css",
						href: url,
						media: 'all'
					}
				);
			}
		}
	}
	
	
	
	// -------------------------------------------------- MAIN RUN ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.run()
	 * @desc				Run application
	 * @return {nothing}
	 */
	Devapt.run = function()
	{
		console.info('Devapt.run');
		
		
		// INIT APPLICATION
		// var app = require('core/application');
		// if ( ! app )
		// {
			// console.error('Devapt.run: init application failed');
			// return;
		// }
		
		
		// INIT BACKEND
		if ( ! Devapt.has_current_backend() )
		{
			require(['backend-foundation5/backend'], function(foundation5_backend)
			{
				var result = Devapt.set_current_backend(foundation5_backend);
				if ( ! result)
				{
					console.error('Devapt.run: init backend failed');
					return;
				}
			} );
		}
		var backend = Devapt.get_current_backend();
		
		
		// INIT DEFAULT VIEW
		// var default_view = app.get_home_view();
	}
	
	
	// Bootstrap
	// Devapt.use('addons-datatables-all');
	// Devapt.use('addons-dygraph-all');
	// Devapt.use('addons-flot-all');

	// console.info('Devapt: Update GUI translations');
	// Devapt.use('apps-i18n');
	// DevaptI18n.update_gui();

	// console.info('Devapt: Init editors');
	// Devapt.use('apps-editors');
	// DevaptEditors.init_mixins();
	
	return Devapt;
} );