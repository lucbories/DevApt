// NPM IMPORTS
import T from 'typr'

// COMMON IMPORTS
import JsonProviderFactory from '../../common/json_provider/json_provider_factory'

// SERVER IMPORTS
import RuntimeExecutable from './runtime_executable'


let context = 'server/runtime/runtime_stage1_executable'



/**
 * @file Runtime Stage 1 loading class.
 * 
 * Runtime Stage 1 consists of:
 * 	  - load master apps settings
 *	  - load security settings
 *    - load logger settings
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
*/
export default class RuntimeStage1Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 1'
	}
	
	// TODO MONITOR EXECUTE PROMISE !!!
	execute()
	{
		const self = this
		
		// SAVE TRACES STATE
		const saved_trace = this.get_trace()
		const has_trace = true || this.runtime.get_setting(['trace', 'stages', 'RuntimeStage1', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}
		

		// EXECUTE ACTIONS
		this.separate_level_1()
		this.enter_group('execute')
		

		let promise = null
		const runtime = this.runtime
		
			
		const settings_provider = runtime.get_setting('settings_provider', null)
		console.log(settings_provider, 'settings_provider')
		
		if ( T.isObject(settings_provider) )
		{
			this.info('Settings provider found for master')
			
			const provider = JsonProviderFactory.create( settings_provider.set('runtime', runtime) )
			promise = provider.provide_json()
			.then(
				// SUCCESS
				function(arg_json)
				{
					self.info('Dispatching master settings into store')
					// console.info('Dispatching master settings into store')
					
					// console.log(arg_json, 'arg_json')

					const base_dir = runtime.get_setting('base_dir', undefined)
					const topology_dir = runtime.get_setting('world_dir', undefined)
					if ( ! runtime.get_registry().load(arg_json, base_dir, topology_dir) )
					{
						const error = runtime.get_topology().get_error()
						const str = runtime.get_topology().format_error(error)
						console.error(context + ':runtime.topology_registry.load:error', str)
						self.error(context + ':runtime.topology_registry.load:error:' + str)
						return false
					}
					
					return true
				}
			)
			.catch(
				// FAILURE
				function(arg_reason)
				{
					self.error(context + ':Master settings loading failure:' + arg_reason)
					return false
				}
			)
		}
		else
		{
			this.error('Settings provider not found')
			promise = Promise.reject('Settings provider not found for master')
		}

		
		// LOAD LOGGERS SETTINGS
		this.info('LOAD LOGGERS SETTINGS')
		promise = promise.then(
			function()
			{
				self.info('Loading Loggers settings')
				
				const loggers_settings = runtime.get_registry().root.get('loggers').toJS()
				const traces_settings = runtime.get_registry().root.get('traces').toJS()
				
				loggers_settings.traces = traces_settings
				runtime.logger_manager.load(loggers_settings)
				
				// console.log(loggers_settings, context + '.execute:loggers_settings')
				
				return true
			}
		)
		.catch(
			// FAILURE
			function(arg_reason)
			{
				self.error(context + ':Loggers settings loading failure:' + arg_reason)
				return false
			}
		)
		
		// LOAD SECURITY SETTINGS
		this.info('LOAD SECURITY SETTINGS')
		promise = promise.then(
			function()
			{
				self.info('Loading Security settings')
				
				const security_settings = runtime.get_registry().root.get('security')
				// console.log(security_settings, context + '.execute:security_settings')
				
				const saved_trace2 = self.get_trace()
				self.set_trace(false)
				runtime.security().load(security_settings)
				self.set_trace(saved_trace2)
				
				return true
			}
		)
		.catch(
			// FAILURE
			function(arg_reason)
			{
				self.error(context + ':Security settings loading failure:' + arg_reason)
				return false
			}
		)
		
		this.leave_group('execute')
		this.separate_level_1()
		
		
		// RESTORE TRACES STATE
		if (! saved_trace && has_trace)
		{
			this.disable_trace()
		}
		
		return promise
	}
}