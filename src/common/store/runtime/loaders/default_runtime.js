const default_runtime = {
	runtime:{
		records:{
			by_id: {},    // record id: record datas (plain object)
			by_query: {}, // query hash:map of record id
			by_model: {}, // model name:map of record id
			by_view: {}   // view name:map of record id
		},
		
		applications:{},
		
		instances:{
			// by_id:{}, // instance id:plain object
			// by_class:{}, // class_name:[] (array of id)
			// by_name:{}, // name:id
			// by_type:{
			// 	servers:[], // (array of id)
			// 	services:[], // (array of id)
			// 	applications:[], // (array of id)
			// 	views:[], // (array of id)
			// 	models:[], // (array of id)
			// 	menubars:[], // (array of id)
			// 	menus:[], // (array of id)
			// 	databases:[], // (array of id)
			// 	plugins:[], // (array of id)
			// 	loggers:[] // (array of id)
			// }
		},
		
		security:{
			authentication:{},
			authorization:{}
		}
	}
}


/*
		applications:
			// mutable runtime values (copy of initial config)
			
			app_name:{
				// runtime config
				used_views:[],    // list of id
				used_models:[],   // list of id
				used_menubars:[], // list of id
				used_menus:[],    // list of id
				used_plugins:[],  // list of id
				used_loggers:[],  // list of id
				used_services:[]  // list of id
			}
		}
*/

/*
	Instance AAA:{
		dependancies:{
			views:[], // list of instance id
			models:[] // list of instance id
		}
		config:{
			// copy of state.config.... instance initial definition
			// runtime values are mutable
			type:
			class_name:
			name:
			id:=name
			...
		}
		state:{
			// other runtime values
		}
	}
*/

export default default_runtime