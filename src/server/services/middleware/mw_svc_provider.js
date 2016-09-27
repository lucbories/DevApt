// NPM IMPORTS
import assert from 'assert'

// SERVER IMPORTS
import ExecutableRouteMiddleware from './executable_route_middleware'
import ServiceExecProvider from '../base/service_exec_provider'


let context = 'server/services/middleware/mw_svc_provider'



/**
 * Middleware service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MiddlewareSvcProvider extends ServiceExecProvider
{
	/**
	 * Create a middleware service provider.
	 * @param {string} arg_provider_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_mw_service, context + ':bad mw service')
		
		this.exec = new ExecutableRouteMiddleware()
	}
	
	
	/**
	 * Produce service datas on request (not implemented)
	 * @returns {Promise} - promise of results
	 */
	produce()
	{
		return Promise.resolve( { msg: 'hello consumer'} )
	}
}