
import T from 'typr'
import assert from 'assert'

import { store, config } from '../store/index'

// import MiddlewareService from '../services/middleware/mw_service'
// import CrudService from '../services/crud/crud_service'
// import ResourcesService from '../services/resource/resources_service'
// import AssetsService from '../services/assets/assets_service'
// import MetricsService from '../services/metrics/metrics_service'

// import DefaultServicePlugin from '../../plugins/default/services_default_plugin'
// import ServicesManager from '../plugins/services_manager'
import RuntimeExecutable from './runtime_executable'
import PluginsFactory from '../plugins/plugins_factory'


let context = 'common/executables/runtime_stage2_executable'



/**
 * Runtime Stage 2 consists of:
 * 		- create master node servers
 * 		- create services
*/
export default class RuntimeStage2Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 2'
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage2', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}
		
		this.separate_level_1()
		this.enter_group('execute')
		

		// CREATE PLUGINS MANAGERS AND LOAD DEFAULT PLUGINS
		this.runtime.plugins_factory = new PluginsFactory(this.runtime)
		
		// if (this.runtime.is_master)
		// {
		this.info('Create master node servers')
		
		const nodes_cfg = config().get('nodes')
		assert( T.isFunction(nodes_cfg.has), context + ':execute:bad nodes_cfg object')
		if ( nodes_cfg.has('error') )
		{
			this.info('master settings loading failure', nodes_cfg.get('error'))
			this.error('master settings loading failure')
			
			this.leave_group('execute:error')
			this.separate_level_1()
			this.set_trace(saved_trace)
			return Promise.reject('master settings loading failure')
		}
		
		const node_settings = store.get_collection_item('nodes', this.runtime.node.get_name())
		// console.log(context + ':node_settings', node_settings)
		// console.log(context + ':config.nodes', config().get('nodes'))
		// console.log(context + ':config.nodes', config())
		
		this.runtime.node.load_topology_settings(node_settings)
		
		this.info('Create services for all master node servers')
		this.make_services()
		// }
		// else
		// {
		// 	this.enter_group('register_to_master')

			// setTimeout( () => { this.runtime.node.register_to_master() }, 200)
			
		// 	this.leave_group('register_to_master')
		// }

		
		this.leave_group('execute')
		this.separate_level_1()
		
		// RESTORE TRACES STATE
		if (! saved_trace && has_trace)
		{
			this.disable_trace()
		}
		
		return Promise.resolve()
	}
	
	
	make_services()
	{
		this.enter_group('make_services')
		
		const svc_mgr = this.runtime.plugins_factory.services_manager
		
		let services = store.get_collection_names('services')
		services.forEach(
			(service_name) => {
				assert(T.isString(service_name), context + ':bad service namr')
				this.info('Processing service creation of:' + service_name)
				
				let cfg_service = store.get_collection_item('services', service_name)
				
				assert( T.isObject(cfg_service), context + ':bad service cfg for [' + service_name + ']')
				assert( T.isString(cfg_service.get('type')), context + ':bad service type [' + cfg_service.type + ']')
				
				let service = svc_mgr.create(cfg_service.get('type'), service_name, cfg_service)
				
				if (service)
				{
					service.enable()
					this.runtime.services.add(service)
				}
				else
				{
					console.error(context + ':make_services:bad service for ' + service_name)
				}
			}
		)
		
		this.leave_group('make_services')
	}
}
