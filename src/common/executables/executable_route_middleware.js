import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'

import { store, config } from '../store/index'
import { get_base_dir } from '../utils/paths'

import ExecutableRoute from './executable_route'


let context = 'common/executables/executable_route_middleware'



export default class ExecutableRouteMiddleware extends ExecutableRoute
{
	constructor()
	{
		super(context)
	}
	
	
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		let self = this
		
		
		const path_file_name = path.join(get_base_dir(), arg_cfg_route.mw_file)
		/*fs.watch(path_file_name,
			function(event, target_file)
			{
				self.info('Reloading middleware file [' + path_file_name + ']')
				
				console.log(target_file, 'is', event)
				delete require.cache[path_file_name]
				
				const mw_cb = require(path_file_name).default
				// console.log(mw_cb, 'mw_cb')
			}
		)*/
		
		
		return function exec_http(req, res, next)
		{
			self.enter_group('ExecutableRouteMiddleware.exec_http')
			
			
			// CHECK ARGS
			assert(T.isString(arg_cfg_route.mw_file), context + ':bad middleware file string')
			
			let mw_cb = null
			
			// LOAD MIDDLEWARE FILE
			try{
				self.info('Loading middleware before')
				
				if (!mw_cb)
				{
					self.info('Loading middleware file [' + path_file_name + ']')
					mw_cb = require(path_file_name).default
                    // console.log(mw_cb, 'mw_cb')
				}
				
				self.info('Loading middleware after')
			}
			catch(e)
			{
				console.log(context + ':middleware loading error:' + e)
				self.error('middleware file not found or not valid')
				self.leave_group('ExecutableRouteMiddleware.exec_http')
				return next(e)
			}
			assert(T.isFunction(mw_cb), context + ':bad middleware function')
			
			// EXECUTE MIDDLEWARE FUNCTION
			try
			{
				self.info('Execute middleware: before')
				// console.log(mw_cb, 'mw_cb')
				mw_cb(req, res)
				self.info('Execute middleware: after')
			}
			catch(e)
			{
				console.log(context + ':middleware execution error:' + e)
				self.error('middleware execution failed')
				self.leave_group('ExecutableRouteMiddleware.exec_http')
				return next(e)
			}
			
			
			self.leave_group('ExecutableRouteMiddleware.exec_http')
			return next()
		}
	}
}
