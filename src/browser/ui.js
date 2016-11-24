// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'

// BROWSER IMPORTS
import Loggable from '../common/base/loggable'
import Component from './components/component'
import Table from './components/table'
import Tree from './components/tree'
import TableTree from './components/table_tree'
import Topology from './components/topology'
import RecordsTable from './components/records_table'
import Page from './components/page'

// VTREE
import vdom_parser from 'vdom-parser'

import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import create_element from 'virtual-dom/create-element'

import vdom_as_json from 'vdom-as-json'
import VNode from 'virtual-dom/vnode/vnode'
import VText from 'virtual-dom/vnode/vtext'
import html_to_vdom from 'html-to-vdom'

const vdom_from_json = vdom_as_json.fromJson

const convertHTML = html_to_vdom({
    VNode: VNode,
    VText: VText
})



const context = 'browser/ui'



/**
 * @file UI interaction class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class UI extends Loggable
{
	/**
	 * Create a UI instance.
	 * 
	 * 	API:
	 * 		->constructor(arg_runtime, arg_store)
	 * 		->get(arg_name):Component - Get a UI component by its name.
	 * 		->create(arg_name):Component - Create a UI component.
	 * 		->find_state(arg_state, arg_name, arg_state_path = []):Immutable.Map|undefined - Find a UI component state.
	 * 		->render(arg_view_name):Promise(Component) - Render a view by its name.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_store - UI components state store.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_store)
	{
		super(context)

		this.is_ui = true
		this.runtime = arg_runtime
		this.store = arg_store
		this.cache = {}
		this.state_by_path = {}

		this.page = {
			menubar:undefined,
			header:undefined,
			breadcrumbs:undefined,
			content:undefined,
			footer:undefined
		}
		
		this.vtrees = {}
		this.vtrees_targets = {}

		this.body_page = new Page()
	}
	
	
	
	/**
	 * Get a UI component by its name.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component}
	 */
	get(arg_name)
	{
		if (arg_name in this.cache)
		{
			return this.cache[arg_name]
		}
		
		return this.create(arg_name)
	}
	
	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component}
	 */
	create(arg_name)
	{
		const current_state = this.store.get_state()
		let state_path = ['views']
		const component_state = this.find_state(current_state, arg_name, state_path)
		console.log('component_state', component_state)
		assert( T.isObject(component_state), context + ':create:bad state object for ' + arg_name)
		
		this.state_by_path[arg_name] = state_path
		
		const type = component_state.has('browser_type') ? component_state.get('browser_type') : component_state.get('type')
		assert( T.isString(type), context + ':create:bad type string for ' + arg_name)
		
		switch(type)
		{
			case 'Table':
				{
					const comp_state = component_state.toJS()
					const comp = new Table(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'TableTree':
				{
					const comp_state = component_state.toJS()
					const comp = new TableTree(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Topology':
				{
					const comp_state = component_state.toJS()
					const comp = new Topology(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'RecordsTable':
				{
					const comp_state = component_state.toJS()
					const comp = new RecordsTable(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Tree':
				{
					const comp_state = component_state.toJS()
					const comp = new Tree(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Button':
			case 'HBox':
			case 'VBox':
			case 'List':
			case 'Page':
			case 'Script':
			case 'Menubar':
			case 'Tabs':
			default:
				{
					const comp_state = component_state.toJS()
					const comp = new Component(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
		}
		
		// return undefined
	}
	
	
	
	/**
	 * Find a UI component state.
	 * 
	 * @param {Immutable.Map} arg_state - registry global state object.
	 * @param {string} arg_name - component name.
	 * @param {array} arg_state_path - state path (optional, default=[])
	 * 
	 * @returns {Immutable.Map|undefined} - component state object.
	 */
	find_state(arg_state, arg_name, arg_state_path = [])
	{
		const js_state = arg_state && arg_state.toJS ? arg_state.toJS() : arg_state
		console.log('ui.find_state for ' + arg_name, arg_state_path, js_state)
		
		if (! arg_state)
		{
			console.error('state is undefined for ' + arg_name)
			return undefined
		}

		if (! T.isFunction(arg_state.get) )
		{
			// GLOBAL STATE IS NOT AN IMMUTABLE.MAP
			console.error(context + ':find_state:state is not an Immutable for ' + arg_name)
			// console.log(context + ':find_state:state:', arg_state)
			return undefined
		}
		
		// FOUND ON ROOT
		if ( arg_state.has('name') )
		{
			const name = arg_state.get('name').toString()
			arg_state_path.push(name)
			if ( name == arg_name )
			{
				console.log('ui.find_state FOUND 1 for ' + arg_name, arg_state_path)
				return arg_state
			}
		}
		
		// LOOKUP ON VIEWS CHILDREN
		let children_key = 'children'
		if (arg_state_path.length == 1 && arg_state_path[0] == 'views')
		{
			children_key = 'views'
			arg_state_path.pop()
		}
		if ( arg_state.has(children_key) )
		{
			arg_state_path.push(children_key)
			
			if ( arg_state.hasIn( [children_key, arg_name] ) )
			{
				arg_state_path.push(arg_name)
				console.log('ui.find_state FOUND 2 for ' + arg_name, arg_state_path)
				return arg_state.getIn( [children_key, arg_name] )
			}
			
			let result = undefined
			arg_state.get(children_key).forEach(
				(child_state, key) => {
					if (! result)
					{
						console.log('ui.find_state loop on child ' + key + ' for ' + arg_name, arg_state_path)
						result = this.find_state(child_state, arg_name, arg_state_path)
						if (result)
						{
							console.log('ui.find_state FOUND 3 for ' + arg_name, arg_state_path)
							return
						}
					}
				}
			)
			if (result)
			{
				console.log('ui.find_state FOUND 4 for ' + arg_name, arg_state_path, result && result.toJS ? result.toJS() : result)
				return result
			}
			
			arg_state_path.pop() // CHILDREN
		}
		
		if ( arg_state.has('name') )
		{
			arg_state_path.pop() // NAME
		}

		// console.error('state not found for ' + arg_name)
		return undefined
	}



	/**
	 * Render a view by its name. Request view content an definition to the server if needed.
	 * 
	 * @param {string} arg_view_name - resource view name.
	 * 
	 * @returns {Promise} - Promise of a view controller
	 */
	render(arg_view_name)
	{
		this.enter_group('render')
		console.log(context + ':render:enter')

		this.leave_group('render:async')
		console.log(context + ':render:leave async')
		return this.runtime.register_service('rest_api_resources_query_1')
		.then(
			(service)=>{
				console.log(context + ':render:get service for ' + arg_view_name)
				return service.get( {collection:'views', 'resource':arg_view_name} )
			},
			
			(reason)=>{
				console.error(context + ':render:error 1 for ' + arg_cmd.url, reason)
			}
		)
		.then(
			(stream)=>{
				console.log(context + ':render:get listen stream for ' + arg_view_name)
				return new Promise(
					function(resolve, reject)
					{
						stream.onValue(
							(response)=>{
								resolve(response)
							}
						)
						stream.onError(
							(reason)=>{
								reject(reason)
							}
						)
					}
				)
			},
			
			(reason)=>{
				console.error(context + ':render:error 2 for ' + arg_cmd.url, reason)
			}
		)
		.then(
			(response)=>{
				console.log(context + ':render:get response for ' + arg_view_name, response)

				if (response.result == 'done')
				{
					console.log(context + ':render:dispatch ADD_JSON_RESOURCE action for ' + arg_view_name)
					const action = { type:'ADD_JSON_RESOURCE', resource:arg_view_name, json:response.datas }
					this.store.dispatch(action)
					return this.create(arg_view_name)
				}

				return undefined
			},
			
			(reason)=>{
				console.error(context + ':render:error 3 for ' + arg_cmd.url, reason)
			}
		)
		.then(
			(resource_instance)=>{
				if (! resource_instance)
				{
					return 'Bad resource instance'
				}

				return resource_instance.render()
			},
			
			(reason)=>{
				console.error(context + ':render:error 4 for ' + arg_cmd.url, reason)
			}
		)
		// .then(
		// 	(html)=>{
		// 		//...
		// 	}
		// )

	}


	render_with_middleware(arg_cmd, arg_route, arg_credentials)
	{
		console.log(context + ':render_with_middleware:cmd,route,credentials:', arg_cmd, arg_route, arg_credentials)

		const middleware = arg_cmd.middleware

		// GET AN URL HTML CONTENT
		const get_url_cb = ()=>{
			let url = arg_route + '?' + arg_credentials.get_url_part()
			this._router.add_handler(url,
				()=> {
					// $.get(url).then(
					// 	(html)=>{
					// 		this.body_page.render_html(html) // TODO
					// 	}
					// )
					const url_callback = (html)=>{
						this.body_page.render_html(html)
					}
					window.devapt().ajax.get_html(url, url_callback)
				}
			)
		}

		this.runtime.register_service(arg_cmd.middleware)
		.then(
			(service)=>{
				console.log(context + ':render_with_middleware:get rendering for ' + arg_cmd.url)
				return service.get( { route:arg_cmd.url } )
			},
			
			(reason)=>{
				console.error(context + ':render_with_middleware:error 0', reason)
			}
		)
		.then(
			(stream)=>{
				console.log(context + ':render_with_middleware:get listen stream for ' + arg_cmd.url)
				return new Promise(
					function(resolve, reject)
					{
						stream.onValue(
							(response)=>{
								resolve(response)
							}
						)
						stream.onError(
							(reason)=>{
								reject(reason)
							}
						)
					}
				)

				.then(
					(rendering_result_response)=>{
						if (! rendering_result_response)
						{
							get_url_cb()
						}

						if ( T.isObject(rendering_result_response.datas) && rendering_result_response.datas.is_rendering_result )
						{
							return this.process_rendering_result(rendering_result_response.datas, arg_credentials)
						}
						throw('rendering failed for middleware [' + arg_cmd.middleware + '] on route [' + arg_route + ']')
					},
			
					(reason)=>{
						console.error(context + ':render_with_middleware:error 2 for ' + arg_cmd.url, reason)
					}
				)

				.then(
					(arg_content_ids)=>{
						arg_content_ids.forEach(
							(id)=>{
								document.getElementById(id).style.display = 'block'
							}
						)
					}
				)
			},

			(reason)=>{
				console.error(context + ':render_with_middleware:error 1 for ' + arg_cmd.url, reason)
			}
		)
		.catch(
			(reason)=>{
				console.error(context + ':render_with_middleware:error for ' + arg_cmd.url, reason)
			}
		)
	}



	process_rendering_result(arg_rendering_result, arg_credentials)
	{
		this.enter_group('process_rendering_result')
		this.debug('rendering result', arg_rendering_result)
		
		if (! arg_credentials)
		{
			arg_credentials = this.runtime.session_credentials
		}

		this.assets_urls_templates = arg_rendering_result.assets_urls_templates
		
		// PROCESS HEADERS
		this.process_rendering_result_headers(arg_rendering_result.headers, arg_credentials)

		// PROCESS HTML CONTENT
		const ids = []
		_.forEach(arg_rendering_result.vtrees,
			(new_vtree_json, id)=>{
				// GET NEW TREE AND STATE
				let new_vtree = vdom_from_json(new_vtree_json)
				new_vtree.prototype = VNode.prototype
				// const new_state = s
				
				this.debug('id:', id)
				this.debug('new_vtree:', new_vtree)

				ids.push(id)

				if ( T.isArray(new_vtree) )
				{
					new_vtree = new VNode('DIV', { id:'content' }, new_vtree, 'id', undefined)
				}

				let element = document.getElementById(id)

				// GET PREVIOUS TREE
				let prev_vtree = undefined
				if (id in this.vtrees)
				{
					prev_vtree = this.vtrees[id]
					
					// CHECK IF PREVIOUS VIEW STATE IS DIFFERENT FROM NEW VIEW STATE
					// const p 

				} else {
					if (element)
					{
						this.debug('element found for id=' + id, element)

						prev_vtree = vdom_parser(element)
					} else {
						this.debug('create element for id=' + id)

						const content = document.getElementById('content')
						assert(content, context + ':process_rendering_result:bad content element')
						element = create_element(new_vtree)
						content.appendChild(element)
					}
				}

				if (prev_vtree)
				{
					this.debug('prev_vtree found for id=' + id, prev_vtree)

					if ( T.isArray(prev_vtree) )
					{
						prev_vtree = new VNode('DIV', {}, prev_vtree, 'id', undefined)
					}
					const patches = diff(prev_vtree, new_vtree)
					this.debug('patches', patches)
					
					element = patch(element, patches)
					this.debug('element', element)

					this.vtrees_targets[id] = element
				}

				this.vtrees[id] = new_vtree
			}
		)

		// PROCESS HEAD STYLES AND SCRIPTS
		this.process_rendering_result_styles_urls (document.head, arg_rendering_result.head_styles_urls, arg_credentials)
		this.process_rendering_result_styles_tags (document.head, arg_rendering_result.head_styles_tags, arg_credentials)
		this.process_rendering_result_scripts_urls(document.head, arg_rendering_result.head_scripts_urls, arg_credentials)
		this.process_rendering_result_scripts_tags(document.head, arg_rendering_result.head_scripts_tags, arg_credentials)

		// PROCESS BODY STYLES AND SCRIPTS
		this.process_rendering_result_styles_urls (document.body, arg_rendering_result.body_styles_urls, arg_credentials)
		this.process_rendering_result_styles_tags (document.body, arg_rendering_result.body_styles_tags, arg_credentials)
		this.process_rendering_result_scripts_urls(document.body, arg_rendering_result.body_scripts_urls, arg_credentials)
		this.process_rendering_result_scripts_tags(document.body, arg_rendering_result.body_scripts_tags, arg_credentials)

		window.devapt().content_rendered()

		this.leave_group('process_rendering_result')
		return ids
	}


	process_rendering_result_headers(arg_rendering_result_headers=[], arg_credentials)
	{
		this.debug('process_rendering_result_headers:rendering headers', arg_rendering_result_headers)
		
		arg_rendering_result_headers.forEach(
			(header)=>{
				const has_header = false // TODO
				// const e = document.createElement(header)
				// document.head.appendChild(e)// TODO
			}
		)
	}


	get_asset_url(arg_url, arg_type, arg_credentials)
	{
		const template = this.assets_urls_templates[arg_type]
		const url = T.isString(template) ? template.replace('{{url}}', arg_url) : arg_url
		const credentials_tag = '{{credentials_url}}'

		if (url.indexOf(credentials_tag) >= 0)
		{
			return url.replace(credentials_tag, arg_credentials.get_url_part())
		}

		return url + '?' + arg_credentials.get_url_part()
	}


	process_rendering_result_scripts_urls(arg_dom_element, arg_rendering_result_scripts_urls=[], arg_credentials)
	{
		this.debug('process_rendering_result_scripts_urls:rendering body_scripts_urls', arg_rendering_result_scripts_urls)
		
		arg_rendering_result_scripts_urls.forEach(
			(url)=>{
				url.src = this.get_asset_url(url.src, 'script', arg_credentials)

				let e = document.getElementById(url.id)
				if (e)
				{
					if (e.getAttribute('src') == url.src)
					{
						return
					}
					e.parentNode.removeChild(e)
				}
				
				e = document.createElement('script')
				e.setAttribute('id', url.id)
				e.setAttribute('src', url.src)
				e.setAttribute('type', 'text/javascript')
				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_scripts_tags(arg_dom_element, arg_rendering_result_scripts_tags=[], arg_credentials)
	{
		this.debug('process_rendering_result_scripts_tags:rendering body_scripts_tags', arg_rendering_result_scripts_tags)
		
		arg_rendering_result_scripts_tags.forEach(
			(tag)=>{
				let e = document.getElementById(tag.id)
				if (e)
				{
					if (e.text == tag.content)
					{
						return
					}
					e.parentNode.removeChild(e)
				}

				e = document.createElement('script')
				e.text = tag.content
				e.setAttribute('id', tag.id)
				e.setAttribute('type', 'text/javascript')
				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_styles_urls(arg_dom_element, arg_rendering_result_styles_urls=[], arg_credentials)
	{
		this.debug('process_rendering_result_styles_urls:rendering body_styles_urls', arg_rendering_result_styles_urls)
		
		arg_rendering_result_styles_urls.forEach(
			(url)=>{
				url.href = this.get_asset_url(url.href, 'style', arg_credentials)
				
				let e = document.getElementById(url.id)
				if (e)
				{
					console.log('e exists', e)
					if (e.getAttribute('href') == url.href)
					{
						return
					}
					console.log('existing e is different', e, url.href)
					e.parentNode.removeChild(e)
				}
				
				e = document.createElement('link')
				e.setAttribute('id', url.id)
				e.setAttribute('href', url.href)
				e.setAttribute('media', url.media ? url.media : 'all')
				e.setAttribute('rel', 'stylesheet')
				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_styles_tags(arg_dom_element, arg_rendering_result_scripts_tags=[], arg_credentials)
	{
		this.debug('process_rendering_result_styles_tags:rendering body_styles_tags', arg_rendering_result_scripts_tags)
		
		arg_rendering_result_scripts_tags.forEach(
			(tag)=>{
				let e = document.getElementById(tag.id)
				if (e)
				{
					if (e.text == tag.content)
					{
						return
					}

					e.parentNode.removeChild(e)
				}

				e = document.createElement('style')
				e.text = tag.content
				e.setAttribute('id', tag.id)
				e.setAttribute('type', 'text/stylesheet')
				arg_dom_element.appendChild(e)
			}
		)
	}
}
