
import T from 'typr'
import assert from 'assert'
import Errorable from './errorable'
import Collection from './collection'


let context = 'common/base/plugins_manager'



/**
 * @file Plugins manager class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class PluginsManager extends Errorable
{
	/**
	 * Create a plugins manager instance.
	 * @extends Errorable
	 * @param {string|undefined} arg_log_context - optional.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * @returns {nothing}
	 */
	constructor(arg_log_context, arg_logger_manager)
	{
		super(arg_log_context ? arg_log_context : context, arg_logger_manager)
		
		this.is_plugins_manager = true
		
		this.registered_plugins = new Collection()
		this.enabled_plugins = new Collection()
	}
	
	
	/**
	 * Get registered plugins list.
	 * @returns {array} - plugins list 
	 */
	get_plugins()
	{
		return this.registered_plugins.get_all()
	}
	
	
	/**
	 * Get registered plugins list with a filtered type.
	 * @param {string|array} arg_type_or_types - type name or types names array
	 * @returns {array} - plugins list 
	 */
	get_typed_plugins(arg_type_or_types)
	{
		return this.registered_plugins.get_all(arg_type_or_types)
	}
	
	
	/**
	 * Register a plugin to be used later, do not active it now.
	 * @param {object} arg_plugin - plugin instance.
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	register_plugin(arg_plugin)
	{
		assert( T.isObject(arg_plugin) && arg_plugin.is_plugin, context + ':bad plugin object')

		const plugin_name = arg_plugin.get_name()
		if (this.registered_plugins.find_by_name(plugin_name) )
		{
			this.error_already_registered(plugin_name)
			return Promise.resolve(false)
		}

		this.registered_plugins.add(arg_plugin)
		arg_plugin.manager = this

		return Promise.resolve(true)
	}
	
	
	/**
	 * Unregister a registered plugin and disble it before if needed.
	 * @param {object} arg_plugin - plugin instance.
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	unregister_plugin(arg_plugin)
	{
		assert( T.isObject(arg_plugin) && arg_plugin.is_plugin, context + ':bad plugin object')
		
		const plugin_name = arg_plugin.get_name()
		
		// PLUGIN IS REGISTERED ?
		if ( ! this.registered_plugins.has(arg_plugin) )
		{
			this.error_not_registered(plugin_name)
			return Promise.resolve(false)
		}
		
		let disable_promise = Promise.resolve(true)
		
		// PLUGIN IS ENABLED ?
		if (this.enabled_plugins.has(arg_plugin) )
		{
			this.enabled_plugins.remove(arg_plugin)
			disable_promise = arg_plugin.disable()
		}
		
		// UNREGISTER
		this.registered_plugins.remove(arg_plugin)
		arg_plugin.manager = null
		delete arg_plugin.manager
		
		return disable_promise
	}
	
	
	/**
	 * Get a registered plugin by its name and its enabled flag.
	 * @param {string} arg_name - registered plugin name
	 * @param {boolean} arg_enabled - plugin is enabled ?
	 * @returns {Plugin}
	 */
	plugin(arg_name, arg_enabled)
	{
		if (arg_enabled)
		{
			return this.enabled_plugins.item(arg_name)
		}
		return this.registered_plugins.item(arg_name)
	}
	
	
	/**
	 * Get a registered plugin by its name.
	 * @param {string} arg_name - registered plugin name
	 * @returns {Plugin}
	 */
	registered_plugin(arg_name)
	{
		return this.registered_plugins.item(arg_name)
	}
	
	
	/**
	 * Get a enabled plugin by its name.
	 * @param {string} arg_name - enabled plugin name
	 * @returns {Plugin}
	 */
	enabled_plugin(arg_name)
	{
		return this.enabled_plugins.item(arg_name)
	}
	
	
	/**
	 * Error wrapper - on registering an already registered plugin
	 * @param {string} arg_plugin_name - plugin name
	 * @returns {nothing}
	 */
	error_already_registered(arg_plugin_name)
	{
		this.error('plugin with name [' + arg_plugin_name + '] is already registered')
	}
	
	
	/**
	 * Error wrapper - a plugin is not registered
	 * @param {string} arg_plugin_name - plugin name
	 * @returns {nothing}
	 */
	error_not_registered(arg_plugin_name)
	{
		this.error('plugin with name [' + arg_plugin_name + '] is not registered')
	}
}
