/**
 * @file        backend-foundation5/views/button-bar.js
 * @desc        Foundation 5 button bar class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-08-05
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/resources', 'views/view', 'core/application', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptView, DevaptApplication, undefined)
{
	/**
	 * @public
	 * @class				DevaptButtonBar
	 * @desc				Button bar view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptButtonBar(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptButtonBar';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptButtonBar
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptButtonBar_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
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
		self.DevaptButtonBar_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptButtonBar
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// CHECK DEFEREED
			self.assertNotNull(context, 'arg_deferred', arg_deferred);
			
			// GET NODES
			self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
			self.content_jqo = $('<div>');
			self.parent_jqo.append(self.content_jqo);
			self.content_jqo.addClass('button-bar');
			
			// GET CURRENT BACKEND
			var backend = Devapt.get_current_backend();
			self.assertNotNull(context, 'backend', backend);
			
			// LOOP ON BUTTON GROUPS VIEWS
			self.assertNotEmptyArray(context, 'self.buttons', self.button_groups);
			for(group_key in self.button_groups)
			{
				var group_view = self.button_groups[group_key];
				
				// RENDER VIEW
				arg_deferred.then( backend.render_view(self.content_jqo, group_view) );
			}
			
			// RESOLVE AND GET PROMISE
			arg_deferred.resolve();
			var promise = arg_deferred.promise();
			
			
			self.leave(context, 'success: promise is resolved');
			return promise;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptButtonBar, ['DevaptView'], 'Luc BORIES', '2014-08-05', 'A button bar view classt.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_option(DevaptButtonBar, {
			name: 'button_groups',
			type: 'array',
			aliases: ['view_buttons'],
			default_value: [],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: true,
			childs: {}
		}
	);
	
	
	return DevaptButtonBar;
} );