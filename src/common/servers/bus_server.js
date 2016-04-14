
// import T from 'typr'
// import assert from 'assert'

import Server from './server'



let context = 'common/servers/bus_server'



/**
 * @file Bus server base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class BusServer extends Server
{
	/**
	 * Create a server instance.
	 * @extends Server
	 * @abstract
	 * @param {string} arg_name - server name
	 * @param {object} arg_settings - plugin settings map
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, 'BusServer', arg_settings, arg_context ? arg_context : context)
		
		this.is_bus_server = true
	}
	
	
	/**
	 * Build server.
	 * @returns {nothing}
	 */
	build_server()
	{
		this.enter_group('build_server')
		
		console.error(context + ':build_server:not yet implemented')
		
		this.leave_group('build_server')
	}
	
	
	/**
	 * Enable server (start it).
	 * @returns {nothing}
	 */
	enable()
	{
		this.enter_group('enable Bus server')
		
		console.error(context + ':enable:not yet implemented')
		
		this.leave_group('enable Bus server')
	}
	
	
	/**
	 * Disable server (stop it).
	 * @returns {nothing}
	 */
	disable()
	{
		this.enter_group('disable Bus server')
		
		console.error(context + ':disable:not yet implemented')
		
		this.leave_group('disable Bus server')
	}
	
	
	/**
	 * Post a message on the bus.
	 * @param {object} arg_msg - message payload.
	 * @returns {nothing}
	 */
	post(arg_msg)
	{
		console.error(context + ':post:not yet implemented')
	}
	
	
	/**
	 * Subscribe to messages of the bus.
	 * @param {string|object} arg_filter - messages criteria for filtering.
	 * @param {function} arg_handler - subscription callback as f(msg).
	 * @returns {nothing}
	 */
	subscribe(arg_filter, arg_handler)
	{
		console.error(context + ':subscribe:not yet implemented')
	}
	
	
	static create_client(arg_node, arg_host, arg_port)
	{
		console.error(context + ':create_client:not yet implemented')
		
		return undefined
	}
    
    
    
	// SOCKET SERVER EVENT HANDLERS

	static on_server_connection()
	{
		console.log(context + ':connection on bus server')
	}


	static on_server_close()
	{
		console.log(context + ':close on bus server')
	}


	static on_server_error()
	{
		console.log(context + ':error on bus server')
	}


	static on_server_listening()
	{
		console.log(context + ':listening on bus server')
	}



	// SOCKET CLIENT EVENT HANDLERS

	static on_client_connect()
	{
		console.log(context + ':connect on bus client')
	}


	static on_client_data()
	{
		console.log(context + ':data on bus client')
	}


	static on_client_error(e)
	{
		console.log(context + ':error on bus client', e)
	}


	static on_client_close()
	{
		console.log(context + ':close on bus client')
	}


	static on_client_end()
	{
		console.log(context + ':end on bus client')
	}


	static on_client_timeout()
	{
		console.log(context + ':timeout on bus client')
	}
}
