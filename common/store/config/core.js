import {List, Map, fromJS} from 'immutable'
import T from 'typr'

import load_config from './loaders/load_config'



let default_config = load_config({})
export const INITIAL_STATE = fromJS(default_config);


function get_path_array(arg_path)
{
  if ( T.isString(arg_path) )
  {
    arg_path = arg_path.split('.');
  }
  
  if ( T.isArray(arg_path) )
  {
    return arg_path.length > 0 ? arg_path : null;
  }
  
  return null;
}


export function set_all(state, arg_config)
{
  let checked_config = load_config({}, arg_config)
  if (checked_config.error)
  {
    return false;
  }
  
  const config = fromJS(arg_config);
  return state.set('config', config);
}


export function get_value(state, arg_path)
{
  const path = get_path_array(arg_path);
  // console.log(path, 'path')
  // console.log(state, 'state')
  const result = state.getIn(path);
  // console.log(result, 'result')
  return result
}


export function update_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.updateIn(path, arg_value);
}


export function create_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.setIn(path, arg_value);
}


export function remove_value(state, arg_path, arg_value)
{
  const path = get_path_array(arg_path);
  return state.deleteIn(path, arg_value);
}