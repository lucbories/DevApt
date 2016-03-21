
import T from 'typr'
import assert from 'assert'
import forge from 'node-forge'

import PluginsManager from '../base/plugins_manager'

// import AuthenticationPluginPassportLocalDb from './authentication_plugin_passport_local_db'
// import AuthenticationPluginPassportLocalFile from './authentication_plugin_passport_local_file'
import AuthenticationPluginURL from './authentication_plugin_url'


let context = 'common/security/authentication_manager'



/**
 * Authentication class to manage authentication plugins.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationManager extends PluginsManager
{
	/**
	 * Create an Authentication manager class: load and create all authentication plugins.
	 * AuthenticationWrapper use created plugins.
	 * @extends PluginsManager
	 * @param {string|undefined} arg_log_context - optional.
	 * @returns {nothing}
	 */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_authentication_manager = true
		
		this.authentication_is_enabled = true
		this.authentication_mode = null
	}
	
	
	/**
	 * Load security settings
	 * @param {object} arg_settings - authentication settings (Immutable object)
	 * @returns {nothing}
	 */
	load(arg_settings)
	{
		assert(T.isObject(arg_settings), context + ':load:bad settings object')
		assert(T.isFunction(arg_settings.has), context + ':load:bad settings immutable')
		assert(arg_settings.has('enabled'), context + ':load:bad settings.enabled')
		assert(arg_settings.has('plugins'), context + ':load:bad settings.plugins')
		assert(arg_settings.has('default_plugins'), context + ':load:bad settings.default_plugins')
		
		// LOAD AUTHENTICATION SETTINGS
		this.authentication_is_enabled = arg_settings.get('enabled')
		this.authentication_plugins = arg_settings.get('plugins')
		this.authentication_default_plugins = arg_settings.get('default_plugins')
		
		// LOAD PLUGINS
		const keys = this.authentication_plugins.toMap().keySeq().toArray()
		keys.forEach(
			(key) => {
				const plugin_cfg = this.authentication_plugins.get(key)
				plugin_cfg.name = key
				const result = this.load_plugin(plugin_cfg)
				if (! result)
				{
					this.error_bad_plugin(this.authentication_mode)
				}
			}
		)
		
		
		// TODO: default security plugin ?
		// TODO: alt plugin settings ?
	}
	
	
	/**
	 * Load security plugin from settings
	 * @param {object} arg_settings - authentication settings (Immutable object)
	 * @returns {boolean}
	 */
	load_plugin(arg_settings)
	{
		const self = this
		
		assert( T.isObject(arg_settings), context + ':load_plugin:bad settings object')
		assert( T.isFunction(arg_settings.has), context + ':load_plugin:bad settings immutable')
		assert( arg_settings.has('mode'), context + ':load_plugin:bad settings.mode')
		assert( T.isString(arg_settings.name) && arg_settings.name.length > 0, context + ':load_plugin:bad settings.name')
		
		// console.log(arg_settings.name, context + ':load_plugin:arg_settings.name')
		
		// LOAD PLUGIN
		const mode = arg_settings.get('mode').toLocaleLowerCase()
		switch(mode)
		{
			case 'database':
			// {
			//	 const plugin = new AuthenticationPluginPassportLocalDb(context)
			//	 this.register_plugin(plugin)
			//	 plugin.enable(arg_settings)
			//	 return true
			// }
			case 'jsonfile':
			// {
			//	 const plugin = new AuthenticationPluginPassportLocalFile(context)
			//	 this.register_plugin(plugin)
			//	 plugin.enable(arg_settings)
			//	 return true
			// }
			// default:
			{
				const plugin = new AuthenticationPluginURL(arg_settings.name, context)
				// self.info(context + ':load_plugin:create plugin for mode [' + mode + '] for name [' + plugin.get_name() + ']')
				
				this.register_plugin(plugin)
				.then(
					(result) => {
						if (result)
						{
							plugin.enable(arg_settings)
							self.info(context + ':load_plugin:success for mode [' + mode + '] for name [' + plugin.get_name() + ']')
						}
						else
						{
							self.error(context + ':load_plugin:failure for mode [' + mode + '] for name [' + plugin.get_name() + ']')
						}
					}
				)
				.catch(
					(reason) => {
						self.error(context + ':load_plugin:failure for mode [' + mode + '] for name [' + plugin.get_name() + ']:' + reason)
					}
				)
				return true
			}
			case 'token': return true // TODO: plugin auth token
		}
		
		return false
	}
	
	
	/**
	 * Hash a password.
	 * @param {string} arg_password - password to hash
	 * @param {string|undefined} arg_digest_method - digest method name (sha1,sha256,sha384,sha512,md5)
	 * @param {string|undefined} arg_encoding_method - encoding method name (hex,utf8,utf16,binary,base64,hexstr)
	 * @returns {string} - hashed password
	 */
	hash_password(arg_password, arg_digest_method, arg_encoding_method)
	{
		assert(T.isString(arg_password), context + ':bad password string')
		arg_digest_method = T.isString(arg_digest_method) ? arg_digest_method : 'sha1'
		arg_encoding_method = T.isString(arg_encoding_method) ? arg_encoding_method : 'hex'
		
		// GET MESSAGE DIGEST FUNCTION
		let md = null
		switch(arg_digest_method.toLocaleLowerCase())
		{
			case 'sha1':   md = forge.md.sha1.create(); break
			case 'sha256': md = forge.md.sha256.create(); break
			case 'sha384': md = forge.md.sha384.create(); break
			case 'sha512': md = forge.md.sha512.create(); break
			case 'md5':	md = forge.md.md5.create(); break
			default: this.error_bad_digest_method(arg_digest_method); return null
		}
		assert(md, context + ':bad message digest object')
		md.update(arg_password)
		
		// GET ENCODED MESSAGE
		let encoded = null
		switch(arg_encoding_method.toLocaleLowerCase())
		{
			case 'hex':
				encoded = md.digest().toHex(); break
			case 'utf8':
			case 'utf-8':
				encoded = md.digest().toString('utf8'); break
			case 'utf16':
			case 'utf-16':
				encoded = md.digest().toString('utf16'); break
			case 'binary':
				encoded = md.digest().toString('binary'); break
			case 'base64':
				encoded = md.digest().toString('base64'); break
			case 'hexstr':
				encoded = md.digest().toString('hex'); break
			default: this.error_bad_encoding_method(arg_encoding_method); return null
		}
		assert(encoded, context + ':bad message encoding result')
		
		return encoded
	}
	
	
	
	
	/**
	 * Check request credentials authentication.
	 *	Request format:
	 *		req.username=...
	 *		req.authorization={
	 *			scheme: <Basic|Signature|...>,
	 *			credentials: <Undecoded value of header>,
	 *			basic: {
	 *				username: $user
	 *				password: $password
	 *			}
	 *		}
	 * @param {object} arg_request - request object
	 * @returns {object} - plain object as { 'user':..., 'password':... }
	 */
	check_request(arg_request)
	{
		if ( !this.authentication_is_enabled )
		{
			return Promise.resolve(true)
		}
		
		const credentials = this.get_credentials(arg_request);
		
		
		if (!credentials.user || !credentials.password)
		{
			return Promise.resolve(false)
		}

		return this.authenticate(credentials);
	}
	
	
	/**
	 * Get request credentials from headers.
	 *	Request format:
	 *		req.username=...
	 *		req.authorization={
	 *			scheme: <Basic|Signature|...>,
	 *			credentials: <Undecoded value of header>,
	 *			basic: {
	 *				username: $user
	 *				password: $password
	 *			}
	 *		}
	 * @param {object} arg_request - request object
	 * @returns {object} - plain object as { 'user':..., 'password':... }
	 */
	get_credentials(arg_request)
	{
		// console.log(arg_request.url, 'arg_request.url')
		// console.log(arg_request.queries, 'arg_request.queries')
		// console.log(arg_request.password, 'arg_request')
		// console.log(arg_request.query(), 'arg_request.query')
		// console.log(arg_request.params, 'arg_request.params')
		
		let credentials = { 'username':null, 'password':null }
		let query_str = null
		if (!arg_request)
		{
			return credentials
		}
		
		// EXPRESS REQUEST
		if (arg_request && arg_request.query && arg_request.query.username && arg_request.query.password)
		{
			this.info('authentication with query map')
			
			credentials.username = arg_request.query.username
			credentials.password = arg_request.query.password
			return credentials
		}
		
		// RESTIFY
		if (arg_request && T.isString(arg_request.query) )
		{
			this.info('authentication with query string')
			query_str = arg_request.query
		}
		if (arg_request && T.isFunction(arg_request.query) )
		{
			this.info('authentication with query function')
			query_str = arg_request.query()
		}
		if ( T.isString(query_str) )
		{
			const queries = query_str.split('&')
			console.log(queries, 'queries part')
			queries.forEach(
				(item/*, index, arr*/) => {
					const parts = item.split('=')
					if ( T.isArray(parts) && parts.length == 2 )
					{
						const key = parts[0]
						const value = parts[1]
						if (key == 'username')
						{
							credentials.username = value
							return
						}
						if (key == 'password')
						{
							credentials.password = value
							return
						}
					}
				}
			)
			
			if (credentials.username && credentials.password)
			{
				return credentials
			}
		}
		
		// RESTIFY QUERY PARSER PLUGIN (NO WORKING)
		if (arg_request && arg_request.params && arg_request.params.username && arg_request.params.password)
		{
			this.info('authentication with params args')
			
			credentials.username = arg_request.params.username
			credentials.password = arg_request.params.password
			return credentials
		}
		
		// RESTIFY AUTHORIZATION PLUGIN
		if (arg_request && arg_request.authorization)
		{
			this.info('authentication with basic auth header args')
			
			if (!arg_request.authorization.basic)
			{
				return credentials
			}
			
			credentials.username = arg_request.authorization.basic.username
			credentials.password = arg_request.authorization.basic.password
			return credentials
		}

		this.error_bad_credentials_format()
		return credentials
	}
	
	
	/**
	 * Error wrapper - error during plugin loading.
	 * @param {string} arg_plugin_mode - plugin mode
	 * @returns {nothing}
	 */
	error_bad_plugin(arg_plugin_mode)
	{
		this.error('bad plugin [' + arg_plugin_mode + ']')
	}
	
	
	/**
	 * Error wrapper - unknow digest method
	 * @param {string} arg_digest_method - digest method name
	 * @returns {nothing}
	 */
	error_bad_digest_method(arg_digest_method)
	{
		this.error('bad digest method [' + arg_digest_method + ']')
	}
	
	
	/**
	 * Error wrapper - unknow encoding method
	 * @param {string} arg_encoding_method - encoding method name
	 * @returns {nothing}
	 */
	error_bad_encoding_method(arg_encoding_method)
	{
		this.error('bad encoding method [' + arg_encoding_method + ']')
	}
	
	
	/**
	 * Error wrapper - unknow request credentials format
	 * @returns {nothing}
	 */
	error_bad_credentials_format()
	{
		this.error('bad request credentials format')
	}
}
