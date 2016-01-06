
import T from 'typr'
import assert from 'assert'
import Polyfill from 'babel-polyfill'

import Instance from './instance'



let context = 'common/base/collection'


export default class Collection
{
	constructor(...args)
	{
		this.is_collection = true
		this.$items = []
		this.$accepted_types = ['*']
		this.set_all(args)
	}
	
	
	// DEFAULT GETTER
	// get $items() { return this.$items }
	
	
	// DEFAULT SETTER
	// set $items(arg_items) { this.set_all(arg_items) }
	
	set_all(arg_items)
	{
		// ONE INSTANCE IS GIVEN
		if ( T.isObject(arg_items) && arg_items instanceof Instance )
		{
			this.$items = [arg_items]
		}
		
		// AN ARRAY IS GIVEN
		if ( T.isArray(arg_items) )
		{
			arg_items.forEach(
				(item) => {
					if (item instanceof Instance)
					{
						this.$items.push(item)
					}
				}
			)
		}
	}
	
	
	get_all(arg_types)
	{
		if (! arg_types)
		{
			return this.$items
		}
		if (T.isString(arg_types))
		{
			return this.$items.filter( item => item.$type == arg_types )
		}
		if (T.isArray(arg_types))
		{
			return this.$items.filter( item => arg_types.indexOf(item.$types) >= 0 )
		}
		return []
	}
	
	
	// DEFAULT ITERATOR
	* [Symbol.iterator]() {
		for (let item of this.$items) {
            yield item;
        }
	}
	
	
	// NAMES GETTER
	get_all_names(arg_types)
	{
		if (! arg_types)
		{
			return this.$items.map( (item) =>{ return item.$name } )
		}
		if (T.isString(arg_types))
		{
			return this.$items.filter( item => item.$type == arg_types ).map( (item) =>{ return item.$name } )
		}
		if (T.isArray(arg_types))
		{
			return this.$items.filter( item => arg_types.indexOf(item.$types) >= 0 ).map( (item) =>{ return item.$name } )
		}
		return []
	}
	
	
	// IDs GETTER
	get_all_ids() { return this.$items.map( (item) =>{ return item.$id } ) }
	
	
	// ITEMS COUNT
	get_count() { return this.$items.length }
    
    
	// GET FIRST ITEM
	get_first()
    {
        if ( ! this.$weak_map )
        {
            return this.$items.length > 0 ? this.$items[0] : null
        }
        
        return this.$weak_map.first() // TO FIX
    }
    
	// GET FIRST ITEM
	get_last()
    {
        if ( ! this.$weak_map )
        {
            return this.$items.length > 0 ? this.$items[ this.$items.length - 1 ] : null
        }
        
        return this.$weak_map.last() // TO FIX
    }
	
	
	// ADD AN ITEM: TODO update indices
	add(arg_item)
	{
		if ( T.isObject(arg_item) && arg_item instanceof Instance )
		{
			if ( this.has_accepted_type('*') || this.has_accepted_type(arg_item.$type) )
			{
				this.$items.push(arg_item)
                
                // CLASS USES WEAK ?
                if (arg_item.is_weaked)
                {
                    if ( ! T.isObject(this.$weak_map) )
                    {
                        this.$weak_map = new WeakMap()
                        this.$weak_map.push(arg_item.get_weak(), arg_item)
                    }
                }
                
				return
			}
			
			this.error('not accepted type [' + arg_item.$type + '] for instance [' + arg_item.$name + ']')
			return
		}
		
		this.error('bad item: not an instance object')
	}
	
	
	// FIND AN ITEM BY NAME: TODO optimize with a map index
	find_by_name(arg_name) { return this.$items.find( item => { return item.$name == arg_name } ) }
    
	
	// FIND AN ITEM BY ID: TODO optimize with a map index
	find_by_id(arg_id) { return this.$items.find( item => item.id == arg_id) }
	
	
	// FIND AN ITEM BY AN ATTRIBUTE: TODO optimize with a map index
	find_by_attr(arg_attr_name, arg_attr_value) { return this.$items.find( item => (arg_attr_name in item) && item[arg_attr_name] == arg_attr_value) }
	
	
	// MANAGE ACCEPTED TYPES
	get_accepted_types()
	{
		this.$accepted_types
	}
	
	set_accepted_types(arg_types)
	{
		assert(T.isArray(arg_types), context + ':bad accepted types array')
		this.$accepted_types = arg_types
	}
	
	add_accepted_type(arg_type)
	{
		assert(T.isString(arg_type), context + ':bad accepted type string')
		this.$accepted_types.push(arg_type)
	}
	
	has_accepted_type(arg_type)
	{
		return this.$accepted_types.indexOf(arg_type) > -1
	}
	
	forEach(arg_cb)
	{
		for(let item of this.$items)
		{
			arg_cb(item)
		}
	}
}