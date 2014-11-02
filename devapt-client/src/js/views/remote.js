/**
 * @file        views/remote.js
 * @desc        Remote view class
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-06-24
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/options', 'core/classes', 'views/view', 'core/application'],
function(Devapt, DevaptTrace, DevaptOptions, DevaptClasses, DevaptView, DevaptApplication)
{
	/**
	 * @public
	 * @class				DevaptRemote
	 * @desc				Remote view view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptRemote(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptRemote';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptRemote
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptPanel_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = 'contructor(' + arg_name + ')';
			self.enter(context, '');
			
			
			// INIT OPTIONS
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			if (! init_option_result)
			{
				self.error(context + ': init options failure');
			}
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptPanel_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptRemote
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// CHECK CONTAINER NODE
			self.assertNotNull(context, 'arg_deferred', arg_deferred);
			self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
			
			// GET AND RENDER VIEW CONTENT
			var promise = arg_deferred.then(
				function(arg_url)
				{
					return $.get(arg_url);
				}
			)
			.then(
				function(arg_html)
				{
					self.parent_jqo.html(arg_html);
				}
			);
			
			// GET APP BASE URL
			var url_base	= DevaptApplication.get_url_base();
			
			// GET VIEW CONTENT URL
			var view_content_url = url_base + 'views/' + self.name + '/html_view';
			
			// RESOLVE DEFERRED
			arg_deferred.resolve(view_content_url);
			
			
			self.leave(context, 'success: promise is resolved: async render');
			return promise;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptRemote, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'Remote rendered view class.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptRemote, '...',			null, true, []);
	
	
	return DevaptRemote;
} );