/**
 * @file        backend-foundation5/views/panel.js
 * @desc        Foundation 5 panel class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/resources', 'core/view', 'core/application', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptView, DevaptApplication, undefined)
{
	/**
	 * @public
	 * @class				DevaptPanel
	 * @desc				Panel view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptPanel(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_container_jqo, arg_options);
		
		// INIT
		self.trace				= true;
		self.class_name			= 'DevaptPanel';
		self.is_view			= true;
		self.step_content_jqo	= false;
		self.step_container_jqo	= false;
		
		
		/**
		 * @public
		 * @memberof			DevaptPanel
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
		 * @memberof			DevaptPanel
		 * @desc				Render view
		 * @return {boolean}	true:success,false:failure
		 */
		self.render_self = function()
		{
			var self = this;
			var context = 'render_self()';
			self.enter(context, '');
			
			
			// GET NODES
			self.assertNotNull(context, 'container_jqo', self.container_jqo);
			self.container_jqo.addClass('panel');
			// self.container_jqo.addClass('row');
			
			self.leave(context, 'success');
			return true;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptPanel, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'Simple view class to display a text.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptPanel, 'panel_text',			null, true, []);
	
	
	return DevaptPanel;
} );