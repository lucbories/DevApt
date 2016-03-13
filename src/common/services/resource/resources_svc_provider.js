
// import T from 'typr'
import assert from 'assert'

import ExecutableRouteResources from '../../executables/executable_route_get_resource'

import ServiceProvider from '../base/service_provider'


let context = 'common/services/resources/resources_svc_provider'



/**
 * Resources service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ResourcesSvcProvider extends ServiceProvider
{
	/**
	 * Create a resources service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_resources_service, context + ':bad resources service')
		
		this.exec = new ExecutableRouteResources()
		this.server = null
		this.application = null
		this.application_server = null
	}
	
	
	/**
	 * Produce service datas on request (not implemented)
	 * @returns {Promise} - promise of results
	 */
	produce()
	{
		return Promise.resolve(undefined)
	}
}