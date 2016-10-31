
import T from 'typr'
import assert from 'assert'

import Loggable from '../../common/base/loggable'
import runtime from '../base/runtime'
import RenderStack from './base/render_stack'


const context = 'common/rendering/render'



/**
 * Rendering wrapper class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Render extends Loggable
{
    /**
     * Create a rendering wrapper class.
	 * 
	 * @param {string} arg_assets_styles - application service name to provide style assets.
	 * @param {string} arg_assets_scripts - application service name to provide script assets.
	 * @param {string} arg_assets_img - application service name to provide image assets.
	 * @param {string} arg_assets_html - application service name to provide html assets.
	 * @param {TopologyDefineApplication} arg_application - application.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html, arg_application)
	{
		super(context)

		this.is_render = true

		this.stack = new RenderStack()
		this.application = arg_application
		
		this.rendering_manager = runtime.get_plugins_factory().get_rendering_manager()
		
		this.set_assets_services_names(arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html)
		
		if ( ! this.is_server_runtime )
		{
			this.update_trace_enabled()
		}
	}



	/**
	 * Set assets services names.
	 * 
	 * @param {string} arg_assets_styles  - styles assets service name.
	 * @param {string} arg_assets_scripts - scripts assets service name.
	 * @param {string} arg_assets_img     - images assets service name.
	 * @param {string} arg_assets_html    - html assets service name.
	 * 
	 * @returns {nothing}
	 */
	set_assets_services_names(arg_assets_styles, arg_assets_scripts, arg_assets_img, arg_assets_html)
	{
		this.assets_styles_service_name = arg_assets_styles ? arg_assets_styles : null
		this.assets_scripts_service_name = arg_assets_scripts ? arg_assets_scripts : null
		this.assets_images_service_name = arg_assets_img ? arg_assets_img : null
		this.assets_html_service_name = arg_assets_html ? arg_assets_html : null

		this.assets_styles_service_consumer = null
		this.assets_scripts_service_consumer = null
		this.assets_images_service_consumer = null
		this.assets_html_service_consumer = null
	}
    


    /**
     * Get an url to server the given image asset.
	 * 
     * @param {string} arg_url - image asset relative url.
	 * 
     * @returns {string} absolute image asset url.
     */
	get_url_with_credentials(arg_url)
	{
		this.enter_group('get_url_with_credentials')

		const url = runtime.context.get_url_with_credentials(arg_url)

		this.leave_group('get_url_with_credentials')
		return url
	}
	
    
    /**
     * Get an url to server the given image asset.
     * @param {string} arg_url - image asset relative url.
     * @returns {string} absolute image asset url.
     */
	get_assets_image_url(arg_url)
	{
		this.enter_group('get_assets_image_url')

		const name = this.assets_images_service_name
		const url = this.get_assets_url(this.assets_images_service_consumer, name, arg_url)

		this.leave_group('get_assets_image_url')
		return url
	}
	
    
    /**
     * Get an url to server the given static html asset.
     * @param {string} arg_url - html asset relative url.
     * @returns {string} absolute html asset url.
     */
	get_assets_html_url(arg_url)
	{
		this.enter_group('get_assets_html_url')

		const name = this.assets_html_service_name
		const url = this.get_assets_url(this.assets_html_service_consumer, name, arg_url)

		this.leave_group('get_assets_html_url')
		return url
	}
	
    
    /**
     * Get an url to server the given script asset.
     * @param {string} arg_url - script asset relative url.
     * @returns {string} absolute script asset url.
     */
	get_assets_script_url(arg_url)
	{
		this.enter_group('get_assets_script_url')

		const name = this.assets_scripts_service_name
		const url = this.get_assets_url(this.assets_scripts_service_consumer, name, arg_url)

		this.leave_group('get_assets_script_url')
		return url
	}
	
    
    /**
     * Get an url to server the given style asset.
     * @param {string} arg_url - script asset relative url.
     * @returns {string} absolute script asset url.
     */
	get_assets_style_url(arg_url)
	{
		this.enter_group('get_assets_style_url')

		const name = this.assets_styles_service_name
		const url = this.get_assets_url(this.assets_styles_service_consumer, name, arg_url)

		this.leave_group('get_assets_style_url')
		return url
	}
	
    
    /**
     * Get an url to server the given image asset.
	 * 
     * @param {object} arg_consumer - service consumer.
     * @param {string} arg_svc_name - service name or null.
     * @param {string} arg_url - image asset relative url.
	 * 
     * @returns {string} absolute image asset url.
     */
	get_assets_url(arg_consumer, arg_svc_name, arg_url)
	{
		this.enter_group('get_assets_url')

		// console.log(typeof arg_url, 'arg_url', arg_url)
		assert( T.isString(arg_url), context + ':get_assets_url:bad url string for svc [' + arg_svc_name + '] for url [' + arg_url + ']')

		const has_consumer = T.isObject(arg_consumer) && arg_consumer.is_service_consumer
		if (! has_consumer)
		{
			assert( T.isString(arg_svc_name), context + ':get_assets_url:bad svc name string')

			const deployed_services = runtime.deployed_local_topology.deployed_services_map
			const service = (arg_svc_name in deployed_services) ? deployed_services[arg_svc_name] : undefined
			assert( T.isObject(service) && service.is_service, context + ':get_assets_script_url:bad service object')

			this.assets_scripts_service_consumer = service.create_consumer()
		}
		assert( T.isObject(this.assets_scripts_service_consumer) && this.assets_scripts_service_consumer.is_service_consumer, context + ':get_assets_script_url:bad consumer object')

		const service = this.assets_scripts_service_consumer.get_service()
		if (! service)
		{
			this.error('no service found for images assets')
			this.leave_group('get_assets_url')
			return null
		}

		const strategy = null
		const provider = service.get_a_provider(strategy)
		let url = this.assets_scripts_service_consumer.get_url_for(provider, { url: arg_url})
		url = runtime.context.get_url_with_credentials(url)

		this.leave_group('get_assets_url')
		return url
	}
    
	
	
    /**
     * Move up to the rendered components stack.
	 * 
     * @returns {object} the Render instance.
     */
	up()
	{
		this.stack.leave()
		return this
	}
	

	
    /**
     * Push a Component instance on the rendering stack.
	 * 
     * @param {object} arg_component - Component instance.
     * @returns {object} this.
     */
	push(arg_component)
	{
		this.stack.enter(arg_component)
		return this
	}
	
	

    /**
     * Add a Component instance to the current component children and push it on the rendering stack.
	 * 
     * @param {object|string} arg_component - Component instance or Component instance name.
	 * 
     * @returns {object} this.
     */
	add(arg_component)
	{
		// NOT A CONTAINER
		if ( ! this.current().is_container )
		{
			console.warn(context + ':add:bad container')
			return this
		}

		// COMPONENT NAME
		if ( T.isString(arg_component) )
		{
			const component_name = arg_component
			
			this.current().create_and_add_child(component_name)
			arg_component = this.current().get_component(component_name)
			
			this.push(arg_component)
			return this
		}

		// COMPONENT INSTANCE
		// assert( T.isObject(arg_component) && arg_component.is_component, context + ':bad component object')
		if ( T.isObject(arg_component) && arg_component.is_component )
		{
			this.current().add_child(arg_component)
			
			this.push(arg_component)
			return this
		}
		
		console.warn(context + ':add:bad child instance')
		return this
	}

	
	
    /**
     * Get the current Component instance.
     * @returns {object} current Component instance..
     */
	current()
	{
		return this.stack.current()
	}
	
	
    /**
     * Create a component instance and push it on the rendering stack.
     * @param {string} arg_class_name - component class name.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	new_component(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name) && arg_class_name.length > 0, context + ':new_component:bad class name string')
		assert( T.isString(arg_name) && arg_name.length > 0, context + ':new_component:bad name string')
		
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.state = arg_state
		
		let component = this.rendering_manager.create(arg_class_name, arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad ' + arg_class_name + ' component object')
		component.renderer = this
		
		const current = this.current()
		if ( current && current.is_container )
		{
			current.add_child(component)
		}
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a Page component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @returns {object} this.
     */
	page(arg_name, arg_settings)
	{
		arg_settings = arg_settings ? arg_settings : {}
		arg_settings.render = this
        
		let component = this.rendering_manager.create('Page', arg_name, arg_settings)
		assert( T.isObject(component) && component.is_component, context + ':bad Page component object')
		
		this.push(component)
		
		return this
	}
	
	
    /**
     * Create a Button component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	button(arg_name, arg_settings, arg_state)
	{
		return this.new_component('Button', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a Tree component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	tree(arg_name, arg_settings, arg_state)
	{
		return this.new_component('Tree', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a HBox component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	hbox(arg_name, arg_settings, arg_state)
	{
		return this.new_component('HBox', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a VBox component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	vbox(arg_name, arg_settings, arg_state)
	{
		return this.new_component('VBox', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a List component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	list(arg_name, arg_settings, arg_state)
	{
		return this.new_component('List', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a Menubar component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	menubar(arg_name, arg_settings, arg_state)
	{
		return this.new_component('Menubar', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a Table component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	table(arg_name, arg_settings, arg_state)
	{
		return this.new_component('Table', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a Tabs component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	tabs(arg_name, arg_settings, arg_state)
	{
		return this.new_component('Tabs', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a InputField component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	input_field(arg_name, arg_settings, arg_state)
	{
		return this.new_component('InputField', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Create a Script component instance and push it on the rendering stack.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {object} this.
     */
	script(arg_name, arg_settings, arg_state)
	{
		return this.new_component('Script', arg_name, arg_settings, arg_state)
	}
	
	
    /**
     * Render the rendering stack of componenents.
     * @returns {string} rendered HTML string.
     */
	render()
	{
		if (! this.current())
		{
			return null
		}
		
		return this.current().render()
	}
}
