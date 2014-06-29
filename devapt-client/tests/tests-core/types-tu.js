/**
 * @file        types.js
 * @desc        Devapt static common features: Devapt static types operations
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types'], function(Devapt, DevaptTraces, DevaptTypes)
{
	console.log('Load qUnit test for DevaptTypes');
	
	function run_tests()
	{
		console.log('Running qUnit test for DevaptTypes');
		
		function foo() {}
		
		test('DevaptTypes.type_of', 22,
			function()
			{
				equal(DevaptTypes.type_of(null),			'null', 'DevaptTypes.type_of: null');
				
				equal(DevaptTypes.type_of(undefined),		'undefined', 'DevaptTypes.type_of: undefined');
				equal(DevaptTypes.type_of('str'),			'string', 'DevaptTypes.type_of: string');
				
				equal(DevaptTypes.type_of(123),				'number', 'DevaptTypes.type_of: number');
				equal(DevaptTypes.type_of(12.3),			'number', 'DevaptTypes.type_of: number');
				equal(DevaptTypes.type_of(-123),			'number', 'DevaptTypes.type_of: number');
				equal(DevaptTypes.type_of(-12.3),			'number', 'DevaptTypes.type_of: number');
				equal(DevaptTypes.type_of(0),				'number', 'DevaptTypes.type_of: number');
				
				equal(DevaptTypes.type_of(true),			'boolean', 'DevaptTypes.type_of: boolean');
				equal(DevaptTypes.type_of(false),			'boolean', 'DevaptTypes.type_of: boolean');
				equal(DevaptTypes.type_of('true'),			'string', 'DevaptTypes.type_of: boolean');
				equal(DevaptTypes.type_of('false'),			'string', 'DevaptTypes.type_of: boolean');
				
				equal(DevaptTypes.type_of(foo),				'function', 'DevaptTypes.type_of: function');
				
				equal(DevaptTypes.type_of(new Object()),	'object', 'DevaptTypes.type_of: object');
				equal(DevaptTypes.type_of({}),				'object', 'DevaptTypes.type_of: object');
				equal(DevaptTypes.type_of({a:'a'}),			'object', 'DevaptTypes.type_of: object: {a:\'a\'}');
				
				equal(DevaptTypes.type_of([]),				'array', 'DevaptTypes.type_of: array');
				equal(DevaptTypes.type_of(['a','b']),		'array', 'DevaptTypes.type_of: array');
				
				equal(DevaptTypes.type_of(new Date()),		'date', 'DevaptTypes.type_of: date');
				equal(DevaptTypes.type_of(new Boolean()),	'boolean', 'DevaptTypes.type_of: boolean');
				equal(DevaptTypes.type_of(new Number()),	'number', 'DevaptTypes.type_of: number');
				equal(DevaptTypes.type_of(/hello/),			'regexp', 'DevaptTypes.type_of: regexp');
			}
		);
		
		
		test('DevaptTypes.is/are array,object,null,undefined', 5+3+10+3+12+3+3+10,
			function()
			{
				// 5
				equal(DevaptTypes.is_array(null),						false, 'DevaptTypes.is_array');
				equal(DevaptTypes.is_array({}),							false, 'DevaptTypes.is_array');
				equal(DevaptTypes.is_array({a:'a'}),					false, 'DevaptTypes.is_array: {a:\'a\'}');
				equal(DevaptTypes.is_array([]),							true, 'DevaptTypes.is_array');
				equal(DevaptTypes.is_array(['a','b']),					true, 'DevaptTypes.is_array');
				
				// 3
				equal(DevaptTypes.is_null(null),						true, 'DevaptTypes.is_null: null');
				equal(DevaptTypes.is_null(undefined),					true, 'DevaptTypes.is_null: undefined');
				equal(DevaptTypes.is_null(0),							false, 'DevaptTypes.is_null: 0');
				
				// 10
				equal(DevaptTypes.are_null([]),							false, 'DevaptTypes.are_null: []');
				
				equal(DevaptTypes.are_null(null),						true, 'DevaptTypes.are_null: null');
				equal(DevaptTypes.are_null([null]),						true, 'DevaptTypes.are_null: [null]');
				equal(DevaptTypes.are_null([null, null]),				true, 'DevaptTypes.are_null: [null, null]');
				equal(DevaptTypes.are_null([null, 123]),				false, 'DevaptTypes.are_null: [null, 123]');
				equal(DevaptTypes.are_null([0]),						false, 'DevaptTypes.are_null: [0]');
				
				equal(DevaptTypes.are_null(undefined),					true, 'DevaptTypes.are_null: undefined');
				equal(DevaptTypes.are_null([undefined]),				true, 'DevaptTypes.are_null: [undefined]');
				equal(DevaptTypes.are_null([undefined, undefined]),		true, 'DevaptTypes.are_null: [undefined, undefined]');
				equal(DevaptTypes.are_null([undefined, 123]),			false, 'DevaptTypes.are_null: [undefined, 123]');
				
				// 3
				equal(DevaptTypes.is_not_null(null),					false, 'DevaptTypes.is_not_null: null');
				equal(DevaptTypes.is_not_null(undefined),				false, 'DevaptTypes.is_not_null: undefined');
				equal(DevaptTypes.is_not_null(0),						true, 'DevaptTypes.is_not_null: 0');
				
				// 12
				equal(DevaptTypes.are_not_null([]),						false, 'DevaptTypes.are_not_null: []');
				
				equal(DevaptTypes.are_not_null(null),					false, 'DevaptTypes.are_not_null: null');
				equal(DevaptTypes.are_not_null([null]),					false, 'DevaptTypes.are_not_null: [null]');
				equal(DevaptTypes.are_not_null([null, null]),			false, 'DevaptTypes.are_not_null: [null, null]');
				equal(DevaptTypes.are_not_null([null, 123]),			false, 'DevaptTypes.are_not_null: [null, 123]');
				equal(DevaptTypes.are_not_null([56, 123]),				true, 'DevaptTypes.are_not_null: [45, 123]');
				equal(DevaptTypes.are_not_null([0]),					true, 'DevaptTypes.are_not_null: [0]');
				
				equal(DevaptTypes.are_not_null(undefined),				false, 'DevaptTypes.are_not_null: undefined');
				equal(DevaptTypes.are_not_null([undefined]),			false, 'DevaptTypes.are_not_null: [undefined]');
				equal(DevaptTypes.are_not_null([undefined, undefined]),	false, 'DevaptTypes.are_not_null: [undefined, undefined]');
				equal(DevaptTypes.are_not_null([undefined, 123]),		false, 'DevaptTypes.are_not_null: [undefined, 123]');
				equal(DevaptTypes.are_not_null([78, 123]),				true, 'DevaptTypes.are_not_null: [78, 123]');
				
				// is_undefined: 3
				equal(DevaptTypes.is_undefined(null),					false, 'DevaptTypes.is_undefined: null');
				equal(DevaptTypes.is_undefined(undefined),				true, 'DevaptTypes.is_undefined: undefined');
				equal(DevaptTypes.is_undefined(0),						false, 'DevaptTypes.is_undefined: 0');
				
				// is_object: 3
				equal(DevaptTypes.is_object(0),							false, 'DevaptTypes.is_object: 0');
				equal(DevaptTypes.is_object({}),						true, 'DevaptTypes.is_object: {}');
				equal(DevaptTypes.is_object({a:'a'}),					true, 'DevaptTypes.is_object: {a:\'a\'}');
				
				// are_object: 10
				equal(DevaptTypes.are_object(0),						false, 'DevaptTypes.are_object: 0');
				equal(DevaptTypes.are_object({}),						true, 'DevaptTypes.are_object: {}');
				equal(DevaptTypes.are_object({a:'a'}),					true, 'DevaptTypes.are_object: {a:\'a\'}');
				
				equal(DevaptTypes.are_object([]),						false, 'DevaptTypes.are_object: []');
				equal(DevaptTypes.are_object([0]),						false, 'DevaptTypes.are_object: [0]');
				equal(DevaptTypes.are_object([{}]),						true, 'DevaptTypes.are_object: [{}]');
				equal(DevaptTypes.are_object([{a:'a'}]),				true, 'DevaptTypes.are_object: [{a:\'a\'}]');
				
				equal(DevaptTypes.are_object([0,{}]),					false, 'DevaptTypes.are_object: [0,{}]');
				equal(DevaptTypes.are_object([{},{}]),					true, 'DevaptTypes.are_object: [{},{}]');
				equal(DevaptTypes.are_object([{a:'a'},{}]),				true, 'DevaptTypes.are_object: [{a:\'a\'},{}]');
			}
		);
		
		
		test('DevaptTypes.is/are string,scalar', 7+8+7+9+10+9+9+14+9+14+9,
			function()
			{
				// is_string: 7
				equal(DevaptTypes.is_string(null),						false, 'DevaptTypes.is_string: null');
				equal(DevaptTypes.is_string({}),						false, 'DevaptTypes.is_string: {}');
				equal(DevaptTypes.is_string([]),						false, 'DevaptTypes.is_string: []');
				equal(DevaptTypes.is_string(123),						false, 'DevaptTypes.is_string: 123');
				
				equal(DevaptTypes.is_string(''),						true, 'DevaptTypes.is_string: ""');
				equal(DevaptTypes.is_string('abcd'),					true, 'DevaptTypes.is_string: "abcd"');
				equal(DevaptTypes.is_string( new String('abcd') ),		false, 'DevaptTypes.is_string: new String("abcd")');
				
				// are_string: 8
				equal(DevaptTypes.are_string(''),						true, 'DevaptTypes.are_string: ""');
				equal(DevaptTypes.are_string('abc'),					true, 'DevaptTypes.are_string: "abc"');
				equal(DevaptTypes.are_string(123),						false, 'DevaptTypes.are_string: 123');
				equal(DevaptTypes.are_string([]),						false, 'DevaptTypes.are_string: []');
				equal(DevaptTypes.are_string([123]),					false, 'DevaptTypes.are_string: [123]');
				equal(DevaptTypes.are_string([123,'']),					false, 'DevaptTypes.are_string: [123,""]');
				equal(DevaptTypes.are_string(['']),						true, 'DevaptTypes.are_string: [""]');
				equal(DevaptTypes.are_string(['','abc']),				true, 'DevaptTypes.are_string: ["","abc"]');
				
				// is_boolean: 7
				equal(DevaptTypes.is_boolean(0),						false, 'DevaptTypes.is_boolean: 0');
				equal(DevaptTypes.is_boolean(123),						false, 'DevaptTypes.is_boolean: 123');
				equal(DevaptTypes.is_boolean(true),						true, 'DevaptTypes.is_boolean: true');
				equal(DevaptTypes.is_boolean(false),					true, 'DevaptTypes.is_boolean: false');
				equal(DevaptTypes.is_boolean(null),						false, 'DevaptTypes.is_boolean: null');
				equal(DevaptTypes.is_boolean('true'),					false, 'DevaptTypes.is_boolean: "true"');
				equal(DevaptTypes.is_boolean('false'),					false, 'DevaptTypes.is_boolean: "false"');
				
				// are_boolean: 9
				equal(DevaptTypes.are_boolean(0),						false, 'DevaptTypes.are_boolean: 0');
				equal(DevaptTypes.are_boolean('true'),					false, 'DevaptTypes.are_boolean: "true"');
				equal(DevaptTypes.are_boolean(123),						false, 'DevaptTypes.are_boolean: 123');
				equal(DevaptTypes.are_boolean(true),					true, 'DevaptTypes.are_boolean: true');
				equal(DevaptTypes.are_boolean(false),					true, 'DevaptTypes.are_boolean: false');
				equal(DevaptTypes.are_boolean([]),						false, 'DevaptTypes.are_boolean: []');
				equal(DevaptTypes.are_boolean([true]),					true, 'DevaptTypes.are_boolean: [true]');
				equal(DevaptTypes.are_boolean([true,'']),				false, 'DevaptTypes.are_boolean: [true,""]');
				equal(DevaptTypes.are_boolean([true,false]),			true, 'DevaptTypes.are_boolean: [true,false]');
				
				// is_numeric: 10
				equal(DevaptTypes.is_numeric(0),						true, 'DevaptTypes.is_numeric: 0');
				equal(DevaptTypes.is_numeric('true'),					false, 'DevaptTypes.is_numeric: "true"');
				equal(DevaptTypes.is_numeric(123),						true, 'DevaptTypes.is_numeric: 123');
				equal(DevaptTypes.is_numeric(true),						false, 'DevaptTypes.is_numeric: true');
				equal(DevaptTypes.is_numeric(false),					false, 'DevaptTypes.is_numeric: false');
				equal(DevaptTypes.is_numeric([]),						false, 'DevaptTypes.is_numeric: []');
				equal(DevaptTypes.is_numeric([123]),					false, 'DevaptTypes.is_numeric: [123]');
				equal(DevaptTypes.is_numeric(12.3),						true, 'DevaptTypes.is_numeric: 12.3');
				equal(DevaptTypes.is_numeric(-12.3),					true, 'DevaptTypes.is_numeric: -12.3');
				equal(DevaptTypes.is_numeric(-12.3,56),					true, 'DevaptTypes.is_numeric: -12.3,56');
				
				// is_number: 9
				equal(DevaptTypes.is_number(0),							true, 'DevaptTypes.is_number: 0');
				equal(DevaptTypes.is_number('true'),					false, 'DevaptTypes.is_number: "true"');
				equal(DevaptTypes.is_number(123),						true, 'DevaptTypes.is_number: 123');
				equal(DevaptTypes.is_number(true),						false, 'DevaptTypes.is_number: true');
				equal(DevaptTypes.is_number(false),						false, 'DevaptTypes.is_number: false');
				equal(DevaptTypes.is_number([]),						false, 'DevaptTypes.is_number: []');
				equal(DevaptTypes.is_number([123]),						false, 'DevaptTypes.is_number: [123]');
				equal(DevaptTypes.is_number(12.3),						true, 'DevaptTypes.is_number: 12.3');
				equal(DevaptTypes.is_number(-12.3),						true, 'DevaptTypes.is_number: -12.3');
				
				// are_number: 9
				equal(DevaptTypes.are_number(0),						true, 'DevaptTypes.are_number: 0');
				equal(DevaptTypes.are_number(123),						true, 'DevaptTypes.are_number: 123');
				equal(DevaptTypes.are_number(12.3),						true, 'DevaptTypes.are_number: 12.3');
				equal(DevaptTypes.are_number(-12.3),					true, 'DevaptTypes.are_number: -12.3');
				equal(DevaptTypes.are_number([]),						false, 'DevaptTypes.are_number: []');
				equal(DevaptTypes.are_number([123]),					true, 'DevaptTypes.are_number: [123]');
				equal(DevaptTypes.are_number([12.3]),					true, 'DevaptTypes.are_number: [12.3]');
				equal(DevaptTypes.are_number([-12.3]),					true, 'DevaptTypes.are_number: [-12.3]');
				equal(DevaptTypes.are_number([-12.3,56]),				true, 'DevaptTypes.are_number: [-12.3,56]');
				
				// is_integer: 14
				equal(DevaptTypes.is_integer(0),						true, 'DevaptTypes.is_integer: 0');
				equal(DevaptTypes.is_integer(123),						true, 'DevaptTypes.is_integer: 123');
				equal(DevaptTypes.is_integer(-123),						true, 'DevaptTypes.is_integer: -123');
				equal(DevaptTypes.is_integer(12.3),						false, 'DevaptTypes.is_integer: 12.3');
				equal(DevaptTypes.is_integer(-12.3),					false, 'DevaptTypes.is_integer: -12.3');
				equal(DevaptTypes.is_integer([]),						false, 'DevaptTypes.is_integer: []');
				equal(DevaptTypes.is_integer([123]),					false, 'DevaptTypes.is_integer: [123]');
				equal(DevaptTypes.is_integer([12.3]),					false, 'DevaptTypes.is_integer: [12.3]');
				equal(DevaptTypes.is_integer([-12.3]),					false, 'DevaptTypes.is_integer: [-12.3]');
				equal(DevaptTypes.is_integer([-12.3,56]),				false, 'DevaptTypes.is_integer: [-12.3,56]');
				equal(DevaptTypes.is_integer('123'),					true, 'DevaptTypes.is_integer: "123"');
				equal(DevaptTypes.is_integer('-123'),					true, 'DevaptTypes.is_integer: "-123"');
				equal(DevaptTypes.is_integer('12.3'),					false, 'DevaptTypes.is_integer: "12.3"');
				equal(DevaptTypes.is_integer('-12.3'),					false, 'DevaptTypes.is_integer: "-12.3"');
				
				// are_integer: 9
				equal(DevaptTypes.are_integer(0),						true, 'DevaptTypes.are_integer: 0');
				equal(DevaptTypes.are_integer(123),						true, 'DevaptTypes.are_integer: 123');
				equal(DevaptTypes.are_integer(12.3),					false, 'DevaptTypes.are_integer: 12.3');
				equal(DevaptTypes.are_integer(-12.3),					false, 'DevaptTypes.are_integer: -12.3');
				equal(DevaptTypes.are_integer([]),						false, 'DevaptTypes.are_integer: []');
				equal(DevaptTypes.are_integer([123]),					true, 'DevaptTypes.are_integer: [123,89,49]');
				equal(DevaptTypes.are_integer([12.3]),					false, 'DevaptTypes.are_integer: [12.3]');
				equal(DevaptTypes.are_integer([-12.3]),					false, 'DevaptTypes.are_integer: [-12.3]');
				equal(DevaptTypes.are_integer([-12.3,56]),				false, 'DevaptTypes.are_integer: [-12.3,56]');
				
				// is_float: 14
				equal(DevaptTypes.is_float(0),							true, 'DevaptTypes.is_float: 0');
				equal(DevaptTypes.is_float(123),						true, 'DevaptTypes.is_float: 123');
				equal(DevaptTypes.is_float(-123),						true, 'DevaptTypes.is_float: -123');
				equal(DevaptTypes.is_float(12.3),						true, 'DevaptTypes.is_float: 12.3');
				equal(DevaptTypes.is_float(-12.3),						true, 'DevaptTypes.is_float: -12.3');
				equal(DevaptTypes.is_float([]),							false, 'DevaptTypes.is_float: []');
				equal(DevaptTypes.is_float([123]),						false, 'DevaptTypes.is_float: [123]');
				equal(DevaptTypes.is_float([12.3]),						false, 'DevaptTypes.is_float: [12.3]');
				equal(DevaptTypes.is_float([-12.3]),					false, 'DevaptTypes.is_float: [-12.3]');
				equal(DevaptTypes.is_float([-12.3,56]),					false, 'DevaptTypes.is_float: [-12.3,56]');
				equal(DevaptTypes.is_float('123'),						true, 'DevaptTypes.is_float: "123"');
				equal(DevaptTypes.is_float('-123'),						true, 'DevaptTypes.is_float: "-123"');
				equal(DevaptTypes.is_float('12.3'),						true, 'DevaptTypes.is_float: "12.3"');
				equal(DevaptTypes.is_float('-12.3'),					true, 'DevaptTypes.is_float: "-12.3"');
				
				// are_float: 9
				equal(DevaptTypes.are_float(0),							true, 'DevaptTypes.are_float: 0');
				equal(DevaptTypes.are_float(123),						true, 'DevaptTypes.are_float: 123');
				equal(DevaptTypes.are_float(12.3),						true, 'DevaptTypes.are_float: 12.3');
				equal(DevaptTypes.are_float(-12.3),						true, 'DevaptTypes.are_float: -12.3');
				equal(DevaptTypes.are_float([]),						false, 'DevaptTypes.are_float: []');
				equal(DevaptTypes.are_float([123]),						true, 'DevaptTypes.are_float: [123,89,49]');
				equal(DevaptTypes.are_float([12.3]),					true, 'DevaptTypes.are_float: [12.3]');
				equal(DevaptTypes.are_float([-12.3]),					true, 'DevaptTypes.are_float: [-12.3]');
				equal(DevaptTypes.are_float([-12.3,56]),				true, 'DevaptTypes.are_float: [-12.3,56]');
			}
		);
		
		
		test('DevaptTypes.is/are function,callback', 4+4,
			function()
			{
				var cb1 = function() {};
				var cb2 = [DevaptTypes, DevaptTypes.are_float];
				var f1 = DevaptTypes.are_float;
				
				// is_function: 4
				equal(DevaptTypes.is_function(null),					false, 'DevaptTypes.is_function: null');
				equal(DevaptTypes.is_function(cb1),						true, 'DevaptTypes.is_function: cb1');
				equal(DevaptTypes.is_function(f1),						true, 'DevaptTypes.is_function: f1');
				equal(DevaptTypes.is_function(cb2),						false, 'DevaptTypes.is_function: cb2');
				
				// is_callback: 4
				equal(DevaptTypes.is_callback(null),					false, 'DevaptTypes.is_callback: null');
				equal(DevaptTypes.is_callback(cb1),						true, 'DevaptTypes.is_callback: cb1');
				equal(DevaptTypes.is_callback(f1),						true, 'DevaptTypes.is_callback: f1');
				equal(DevaptTypes.is_callback(cb2),						true, 'DevaptTypes.is_callback: cb2');
			}
		);
		
		
		test('DevaptTypes.is/are empty', 5+5+5+4+4+6+6,
			function()
			{
				var a1 = [];
				var o1 = {};
				var a2 = [123];
				var a3 = ['123', 456];
				
				// is_empty_array: 5
				equal(DevaptTypes.is_empty_array(null),					false, 'DevaptTypes.is_empty_array: null');
				equal(DevaptTypes.is_empty_array(o1),					false, 'DevaptTypes.is_empty_array: o1');
				equal(DevaptTypes.is_empty_array(a1),					true, 'DevaptTypes.is_empty_array: a1');
				equal(DevaptTypes.is_empty_array(a2),					false, 'DevaptTypes.is_empty_array: a2');
				equal(DevaptTypes.is_empty_array(a3),					false, 'DevaptTypes.is_empty_array: a3');
				
				// is_empty_array_or_null: 5
				equal(DevaptTypes.is_empty_array_or_null(null),			true, 'DevaptTypes.is_empty_array_or_null: null');
				equal(DevaptTypes.is_empty_array_or_null(o1),			false, 'DevaptTypes.is_empty_array_or_null: o1');
				equal(DevaptTypes.is_empty_array_or_null(a1),			true, 'DevaptTypes.is_empty_array_or_null: a1');
				equal(DevaptTypes.is_empty_array_or_null(a2),			false, 'DevaptTypes.is_empty_array_or_null: a2');
				equal(DevaptTypes.is_empty_array_or_null(a3),			false, 'DevaptTypes.is_empty_array_or_null: a3');
				
				// is_not_empty_array 5
				equal(DevaptTypes.is_not_empty_array(null),				false, 'DevaptTypes.is_not_empty_array: null');
				equal(DevaptTypes.is_not_empty_array(o1),				false, 'DevaptTypes.is_not_empty_array: o1');
				equal(DevaptTypes.is_not_empty_array(a1),				false, 'DevaptTypes.is_not_empty_array: a1');
				equal(DevaptTypes.is_not_empty_array(a2),				true, 'DevaptTypes.is_not_empty_array: a2');
				equal(DevaptTypes.is_not_empty_array(a3),				true, 'DevaptTypes.is_not_empty_array: a3');
				
				// is_empty_str 4
				equal(DevaptTypes.is_empty_str(null),					false, 'DevaptTypes.is_empty_str: null');
				equal(DevaptTypes.is_empty_str(''),						true, 'DevaptTypes.is_empty_str: ""');
				equal(DevaptTypes.is_empty_str('abc'),					false, 'DevaptTypes.is_empty_str: "abc"');
				equal(DevaptTypes.is_empty_str(123),					false, 'DevaptTypes.is_empty_str: 123');
				
				// is_empty_str_or_null 4
				equal(DevaptTypes.is_empty_str_or_null(null),			true, 'DevaptTypes.is_empty_str_or_null: null');
				equal(DevaptTypes.is_empty_str_or_null(''),				true, 'DevaptTypes.is_empty_str_or_null: ""');
				equal(DevaptTypes.is_empty_str_or_null('abc'),			false, 'DevaptTypes.is_empty_str_or_null: "abc"');
				equal(DevaptTypes.is_empty_str_or_null(123),			false, 'DevaptTypes.is_empty_str_or_null: 123');
				
				// is_empty_int 6
				equal(DevaptTypes.is_empty_int(null),					false, 'DevaptTypes.is_empty_int: null');
				equal(DevaptTypes.is_empty_int(''),						false, 'DevaptTypes.is_empty_int: ""');
				equal(DevaptTypes.is_empty_int('abc'),					false, 'DevaptTypes.is_empty_int: "abc"');
				equal(DevaptTypes.is_empty_int(123),					false, 'DevaptTypes.is_empty_int: 123');
				equal(DevaptTypes.is_empty_int(-123),					false, 'DevaptTypes.is_empty_int: -123');
				equal(DevaptTypes.is_empty_int(0),						true, 'DevaptTypes.is_empty_int: 0');
				
				// is_empty_int_or_null 6
				equal(DevaptTypes.is_empty_int_or_null(null),			true, 'DevaptTypes.is_empty_int_or_null: null');
				equal(DevaptTypes.is_empty_int_or_null(''),				false, 'DevaptTypes.is_empty_int_or_null: ""');
				equal(DevaptTypes.is_empty_int_or_null('abc'),			false, 'DevaptTypes.is_empty_int_or_null: "abc"');
				equal(DevaptTypes.is_empty_int_or_null(123),			false, 'DevaptTypes.is_empty_int_or_null: 123');
				equal(DevaptTypes.is_empty_int_or_null(-123),			false, 'DevaptTypes.is_empty_int_or_null: -123');
				equal(DevaptTypes.is_empty_int_or_null(0),				true, 'DevaptTypes.is_empty_int_or_null: 0');
			}
		);
		
		
		test('DevaptTypes.in_array', 4+7+5+8,
			function()
			{
				var o1 = {};
				var o2 = {'a':null};
				var o3 = {'a':null, 'b':123};
				var o4 = {null:'123'};
				
				var a1 = [];
				var a2 = [123];
				var a3 = ['123', 456];
				var a4 = [null];
				var a5 = [123, null];
				
				equal(DevaptTypes.in_array(o1, null),					false, 'DevaptTypes.in_array: o1 null');
				equal(DevaptTypes.in_array(o2, null),					true, 'DevaptTypes.in_array: o2 null');
				equal(DevaptTypes.in_array(o3, null),					true, 'DevaptTypes.in_array: o3 null');
				equal(DevaptTypes.in_array(o4, null),					false, 'DevaptTypes.in_array: o4 null');
				
				equal(DevaptTypes.in_array(o1, 123),					false, 'DevaptTypes.in_array: o1 123');
				equal(DevaptTypes.in_array(o2, 123),					false, 'DevaptTypes.in_array: o2 123');
				equal(DevaptTypes.in_array(o3, 123),					true, 'DevaptTypes.in_array: o3 123');
				equal(DevaptTypes.in_array(o4, 123, false),				true, 'DevaptTypes.in_array: o4 123 simple');
				equal(DevaptTypes.in_array(o4, 123, true),				false, 'DevaptTypes.in_array: o4 123 strict');
				equal(DevaptTypes.in_array(o4, '123', false),			true, 'DevaptTypes.in_array: o4 "123" simple');
				equal(DevaptTypes.in_array(o4, '123', true),			true, 'DevaptTypes.in_array: o4 "123" strict');
				
				equal(DevaptTypes.in_array(a1, null),					false, 'DevaptTypes.in_array: a1 null');
				equal(DevaptTypes.in_array(a2, null),					false, 'DevaptTypes.in_array: a2 null');
				equal(DevaptTypes.in_array(a3, null),					false, 'DevaptTypes.in_array: a3 null');
				equal(DevaptTypes.in_array(a4, null),					true, 'DevaptTypes.in_array: a4 null');
				equal(DevaptTypes.in_array(a5, null),					true, 'DevaptTypes.in_array: a5 null');
				
				equal(DevaptTypes.in_array(a1, 123),					false, 'DevaptTypes.in_array: a1 123');
				equal(DevaptTypes.in_array(a2, 123),					true, 'DevaptTypes.in_array: a2 123');
				equal(DevaptTypes.in_array(a3, 123, false),				true, 'DevaptTypes.in_array: a3 123 simple');
				equal(DevaptTypes.in_array(a3, 123, true),				false, 'DevaptTypes.in_array: a3 123 strict');
				equal(DevaptTypes.in_array(a3, '123', false),			true, 'DevaptTypes.in_array: a3 "123" simple');
				equal(DevaptTypes.in_array(a3, '123', true),			true, 'DevaptTypes.in_array: a3 "123" strict');
				equal(DevaptTypes.in_array(a4, 123),					false, 'DevaptTypes.in_array: a4 123');
				equal(DevaptTypes.in_array(a5, 123),					true, 'DevaptTypes.in_array: a5 123');
			}
		);
		
		
		test('DevaptTypes.get_value_str', 4+4+5+4,
			function()
			{
				var o1 = {};
				var o2 = {'a':null};
				var o3 = {'a':null, 'b':123};
				var o4 = {null:'123'};
				
				var a1 = [];
				var a2 = [123];
				var a3 = ['123', 456];
				var a4 = [null];
				var a5 = [123, null];
				
				equal(DevaptTypes.get_value_str(null),					'null', 'DevaptTypes.get_value_str: null');
				equal(DevaptTypes.get_value_str(undefined),				'null', 'DevaptTypes.get_value_str: undefined');
				equal(DevaptTypes.get_value_str(123),					'123', 'DevaptTypes.get_value_str: 123');
				equal(DevaptTypes.get_value_str('123'),					'123', 'DevaptTypes.get_value_str: "123"');
				
				equal(DevaptTypes.get_value_str(o1),					'{}', 'DevaptTypes.get_value_str: o1');
				equal(DevaptTypes.get_value_str(o2),					'{\n  a=null\n}', 'DevaptTypes.get_value_str: o2');
				equal(DevaptTypes.get_value_str(o3),					'{\n  a=null\n  b=123\n}', 'DevaptTypes.get_value_str: o3');
				equal(DevaptTypes.get_value_str(o4),					'{\n  null=123\n}', 'DevaptTypes.get_value_str: o4');
				
				equal(DevaptTypes.get_value_str(a1),					'[]', 'DevaptTypes.get_value_str: a1');
				equal(DevaptTypes.get_value_str(a2),					'[0=123]', 'DevaptTypes.get_value_str: a2');
				equal(DevaptTypes.get_value_str(a3),					'[0=123,1=456]', 'DevaptTypes.get_value_str: a3');
				equal(DevaptTypes.get_value_str(a4),					'[0=null]', 'DevaptTypes.get_value_str: a4');
				equal(DevaptTypes.get_value_str(a5),					'[0=123,1=null]', 'DevaptTypes.get_value_str: a5');
				
				equal(DevaptTypes.get_value_str(o1),					'{}', 'DevaptTypes.get_value_str: o1');
				equal(DevaptTypes.get_value_str(o2),					'{\n  a=null\n}', 'DevaptTypes.get_value_str: o2');
				equal(DevaptTypes.get_value_str(o3),					'{\n  a=null\n  b=123\n}', 'DevaptTypes.get_value_str: o3');
				equal(DevaptTypes.get_value_str(o4),					'{\n  null=123\n}', 'DevaptTypes.get_value_str: o4');
			}
		);
		
		
		test('DevaptTypes.to_string', 5,
			function()
			{
				var o3 = {'a':null, 'b':123};
				
				equal(DevaptTypes.to_string(''),						'', 'DevaptTypes.to_string: ""');
				equal(DevaptTypes.to_string('123'),						'123', 'DevaptTypes.to_string: "123"');
				equal(DevaptTypes.to_string(123),						'', 'DevaptTypes.to_string: 123');
				equal(DevaptTypes.to_string(123, 'default'),			'default', 'DevaptTypes.to_string: 123,"default"');
				equal(DevaptTypes.to_string(o3, 'default'),				'default', 'DevaptTypes.to_string: o3,default');
			}
		);
		
		
		test('DevaptTypes.to_boolean', 3+15+15+6,
			function()
			{
				equal(DevaptTypes.to_boolean(null),						false, 'DevaptTypes.to_boolean: null');
				equal(DevaptTypes.to_boolean(undefined),				false, 'DevaptTypes.to_boolean: undefined');
				equal(DevaptTypes.to_boolean(''),						false, 'DevaptTypes.to_boolean: ""');
				
				equal(DevaptTypes.to_boolean(true),						true, 'DevaptTypes.to_boolean: true');
				equal(DevaptTypes.to_boolean(1),						true, 'DevaptTypes.to_boolean: 1');
				equal(DevaptTypes.to_boolean(11),						true, 'DevaptTypes.to_boolean: 11');
				equal(DevaptTypes.to_boolean('1'),						true, 'DevaptTypes.to_boolean: "1"');
				equal(DevaptTypes.to_boolean('true'),					true, 'DevaptTypes.to_boolean: "true"');
				equal(DevaptTypes.to_boolean('True'),					true, 'DevaptTypes.to_boolean: "True"');
				equal(DevaptTypes.to_boolean('TRUE'),					true, 'DevaptTypes.to_boolean: "TRUE"');
				equal(DevaptTypes.to_boolean('y'),						true, 'DevaptTypes.to_boolean: "y"');
				equal(DevaptTypes.to_boolean('Y'),						true, 'DevaptTypes.to_boolean: "Y"');
				equal(DevaptTypes.to_boolean('yes'),					true, 'DevaptTypes.to_boolean: "yes"');
				equal(DevaptTypes.to_boolean('Yes'),					true, 'DevaptTypes.to_boolean: "Yes"');
				equal(DevaptTypes.to_boolean('YES'),					true, 'DevaptTypes.to_boolean: "YES"');
				equal(DevaptTypes.to_boolean('on'),						true, 'DevaptTypes.to_boolean: "on"');
				equal(DevaptTypes.to_boolean('On'),						true, 'DevaptTypes.to_boolean: "On"');
				equal(DevaptTypes.to_boolean('ON'),						true, 'DevaptTypes.to_boolean: "ON"');
				
				equal(DevaptTypes.to_boolean(false),					false, 'DevaptTypes.to_boolean: false');
				equal(DevaptTypes.to_boolean(0),						false, 'DevaptTypes.to_boolean: 0');
				equal(DevaptTypes.to_boolean(-1),						false, 'DevaptTypes.to_boolean: -1');
				equal(DevaptTypes.to_boolean('0'),						false, 'DevaptTypes.to_boolean: "0"');
				equal(DevaptTypes.to_boolean('false'),					false, 'DevaptTypes.to_boolean: "false"');
				equal(DevaptTypes.to_boolean('False'),					false, 'DevaptTypes.to_boolean: "False"');
				equal(DevaptTypes.to_boolean('FALSE'),					false, 'DevaptTypes.to_boolean: "FALSE"');
				equal(DevaptTypes.to_boolean('n'),						false, 'DevaptTypes.to_boolean: "n"');
				equal(DevaptTypes.to_boolean('N'),						false, 'DevaptTypes.to_boolean: "N"');
				equal(DevaptTypes.to_boolean('no'),						false, 'DevaptTypes.to_boolean: "no"');
				equal(DevaptTypes.to_boolean('No'),						false, 'DevaptTypes.to_boolean: "No"');
				equal(DevaptTypes.to_boolean('NO'),						false, 'DevaptTypes.to_boolean: "NO"');
				equal(DevaptTypes.to_boolean('off'),					false, 'DevaptTypes.to_boolean: "off"');
				equal(DevaptTypes.to_boolean('Off'),					false, 'DevaptTypes.to_boolean: "Off"');
				equal(DevaptTypes.to_boolean('OFF'),					false, 'DevaptTypes.to_boolean: "OFF"');
				
				equal(DevaptTypes.to_boolean('xyz'),					false, 'DevaptTypes.to_boolean: "xyz"');
				equal(DevaptTypes.to_boolean(true, 456),				true, 'DevaptTypes.to_boolean: true,456');
				equal(DevaptTypes.to_boolean(false, 456),				false, 'DevaptTypes.to_boolean: false,456');
				equal(DevaptTypes.to_boolean('xyz', 456),				false, 'DevaptTypes.to_boolean: "xyz",456');
				equal(DevaptTypes.to_boolean(['xyz'], 456),				true, 'DevaptTypes.to_boolean: ["xyz"],456');
				equal(DevaptTypes.to_boolean({a:'xyz'}, 0),				false, 'DevaptTypes.to_boolean: {a:"xyz"},0');
			}
		);
		
		
		test('DevaptTypes.to_number', 4+4+8,
			function()
			{
				equal(DevaptTypes.to_number(null),						0, 'DevaptTypes.to_number: null');
				equal(DevaptTypes.to_number(undefined),					0, 'DevaptTypes.to_number: undefined');
				equal(DevaptTypes.to_number(''),						0, 'DevaptTypes.to_number: ""');
				equal(DevaptTypes.to_number('xyz'),						0, 'DevaptTypes.to_number: "xyz"');
				
				equal(DevaptTypes.to_number(null,456),					456, 'DevaptTypes.to_number: null,456');
				equal(DevaptTypes.to_number(undefined,456),				456, 'DevaptTypes.to_number: undefined,456');
				equal(DevaptTypes.to_number('',456),					456, 'DevaptTypes.to_number: "",456');
				equal(DevaptTypes.to_number('xyz',456),					456, 'DevaptTypes.to_number: "xyz",456');
				
				equal(DevaptTypes.to_number(true),						1, 'DevaptTypes.to_number: true');
				equal(DevaptTypes.to_number(false),						0, 'DevaptTypes.to_number: false');
				equal(DevaptTypes.to_number(1),							1, 'DevaptTypes.to_number: 1');
				equal(DevaptTypes.to_number(11),						11, 'DevaptTypes.to_number: 11');
				equal(DevaptTypes.to_number('1'),						1, 'DevaptTypes.to_number: "1"');
				equal(DevaptTypes.to_number('-1'),						-1, 'DevaptTypes.to_number: "-1"');
				equal(DevaptTypes.to_number(1.1),						1.1, 'DevaptTypes.to_number: 1.1');
				equal(DevaptTypes.to_number("1.1"),						1.1, 'DevaptTypes.to_number: "1.1"');
			}
		);
		
		
		test('DevaptTypes.to_integer', 4+4+8,
			function()
			{
				equal(DevaptTypes.to_integer(null),						0, 'DevaptTypes.to_integer: null');
				equal(DevaptTypes.to_integer(undefined),				0, 'DevaptTypes.to_integer: undefined');
				equal(DevaptTypes.to_integer(''),						0, 'DevaptTypes.to_integer: ""');
				equal(DevaptTypes.to_integer('xyz'),					0, 'DevaptTypes.to_integer: "xyz"');
				
				equal(DevaptTypes.to_integer(null,456),					456, 'DevaptTypes.to_integer: null,456');
				equal(DevaptTypes.to_integer(undefined,456),			456, 'DevaptTypes.to_integer: undefined,456');
				equal(DevaptTypes.to_integer('',456),					456, 'DevaptTypes.to_integer: "",456');
				equal(DevaptTypes.to_integer('xyz',456),				456, 'DevaptTypes.to_integer: "xyz",456');
				
				equal(DevaptTypes.to_integer(true),						1, 'DevaptTypes.to_integer: true');
				equal(DevaptTypes.to_integer(false),					0, 'DevaptTypes.to_integer: false');
				equal(DevaptTypes.to_integer(1),						1, 'DevaptTypes.to_integer: 1');
				equal(DevaptTypes.to_integer(11),						11, 'DevaptTypes.to_integer: 11');
				equal(DevaptTypes.to_integer('1'),						1, 'DevaptTypes.to_integer: "1"');
				equal(DevaptTypes.to_integer('-1'),						-1, 'DevaptTypes.to_integer: "-1"');
				equal(DevaptTypes.to_integer(1.1),						1, 'DevaptTypes.to_integer: 1.1');
				equal(DevaptTypes.to_integer("1.1"),					1, 'DevaptTypes.to_integer: "1.1"');
			}
		);
		
		
		test('DevaptTypes.to_float', 4+4+8,
			function()
			{
				equal(DevaptTypes.to_float(null),						0.0, 'DevaptTypes.to_float: null');
				equal(DevaptTypes.to_float(undefined),					0.0, 'DevaptTypes.to_float: undefined');
				equal(DevaptTypes.to_float(''),							0.0, 'DevaptTypes.to_float: ""');
				equal(DevaptTypes.to_float('xyz'),						0.0, 'DevaptTypes.to_float: "xyz"');
				
				equal(DevaptTypes.to_float(null,456),					456.0, 'DevaptTypes.to_float: null,456');
				equal(DevaptTypes.to_float(undefined,456),				456.0, 'DevaptTypes.to_float: undefined,456');
				equal(DevaptTypes.to_float('',456),						456.0, 'DevaptTypes.to_float: "",456');
				equal(DevaptTypes.to_float('xyz',456),					456.0, 'DevaptTypes.to_float: "xyz",456');
				
				equal(DevaptTypes.to_float(true),						0.0, 'DevaptTypes.to_float: true');
				equal(DevaptTypes.to_float(false),						0.0, 'DevaptTypes.to_float: false');
				equal(DevaptTypes.to_float(1),							1.0, 'DevaptTypes.to_float: 1');
				equal(DevaptTypes.to_float(11),							11.0, 'DevaptTypes.to_float: 11');
				equal(DevaptTypes.to_float('1'),						1.0, 'DevaptTypes.to_float: "1"');
				equal(DevaptTypes.to_float('-1'),						-1.0, 'DevaptTypes.to_float: "-1"');
				equal(DevaptTypes.to_float(1.1),						1.1, 'DevaptTypes.to_float: 1.1');
				equal(DevaptTypes.to_float("1.1"),						1.1, 'DevaptTypes.to_float: "1.1"');
			}
		);
		
		
		test('DevaptTypes.is_date', 4+4+2,
			function()
			{
				var today = new Date().toLocaleDateString();
				var date1 = new Date(2014, 8, 1);
				
				equal(DevaptTypes.is_date(null),						false, 'DevaptTypes.is_date: null');
				equal(DevaptTypes.is_date(undefined),					false, 'DevaptTypes.is_date: undefined');
				equal(DevaptTypes.is_date(''),							false, 'DevaptTypes.is_date: ""');
				equal(DevaptTypes.is_date('xyz'),						false, 'DevaptTypes.is_date: "xyz"');
				
				equal(DevaptTypes.is_date(true),						false, 'DevaptTypes.is_date: true');
				equal(DevaptTypes.is_date(false),						false, 'DevaptTypes.is_date: false');
				equal(DevaptTypes.is_date(1),							false, 'DevaptTypes.is_date: 1');
				equal(DevaptTypes.is_date(11),							false, 'DevaptTypes.is_date: 11');
				
				equal(DevaptTypes.is_date(today),						false, 'DevaptTypes.is_date: today');
				equal(DevaptTypes.is_date(date1),						true, 'DevaptTypes.is_date: date1');
			}
		);
		
		
		test('DevaptTypes.are_date', 4+4+2+6,
			function()
			{
				var today = new Date().toLocaleDateString();
				var date1 = new Date(2014, 8, 1);
				
				equal(DevaptTypes.are_date(null),						false, 'DevaptTypes.are_date: null');
				equal(DevaptTypes.are_date(undefined),					false, 'DevaptTypes.are_date: undefined');
				equal(DevaptTypes.are_date(''),							false, 'DevaptTypes.are_date: ""');
				equal(DevaptTypes.are_date('xyz'),						false, 'DevaptTypes.are_date: "xyz"');
				
				equal(DevaptTypes.are_date(true),						false, 'DevaptTypes.are_date: true');
				equal(DevaptTypes.are_date(false),						false, 'DevaptTypes.are_date: false');
				equal(DevaptTypes.are_date(1),							false, 'DevaptTypes.are_date: 1');
				equal(DevaptTypes.are_date(11),							false, 'DevaptTypes.are_date: 11');
				
				equal(DevaptTypes.are_date(today),						false, 'DevaptTypes.are_date: today');
				equal(DevaptTypes.are_date(date1),						true, 'DevaptTypes.are_date: date1');
				
				equal(DevaptTypes.are_date([today]),					false, 'DevaptTypes.are_date: [today]');
				equal(DevaptTypes.are_date([date1]),					true, 'DevaptTypes.are_date: [date1]');
				equal(DevaptTypes.are_date([today,156]),				false, 'DevaptTypes.are_date: [today,156]');
				equal(DevaptTypes.are_date([date1,'78']),				false, 'DevaptTypes.are_date: [date1,"78"]');
				equal(DevaptTypes.are_date([today,date1]),				false, 'DevaptTypes.are_date: [today,date1]');
				equal(DevaptTypes.are_date([date1,date1,date1]),		true, 'DevaptTypes.are_date: [date1,date1,date1]');
			}
		);
		
		
		test('DevaptTypes.to_date', 5+4+4,
			function()
			{
				var today = new Date().toLocaleDateString();
				var date1 = new Date(2014, 9-1, 1).toLocaleDateString();
				var date2 = new Date(1).toLocaleDateString();
				var date3 = new Date(11).toLocaleDateString();
				
				equal(DevaptTypes.to_date(null),						today, 'DevaptTypes.to_date: null');
				equal(DevaptTypes.to_date(null, date1),					date1, 'DevaptTypes.to_date: null,date1');
				equal(DevaptTypes.to_date(undefined),					today, 'DevaptTypes.to_date: undefined');
				equal(DevaptTypes.to_date(''),							today, 'DevaptTypes.to_date: ""');
				equal(DevaptTypes.to_date('xyz'),						today, 'DevaptTypes.to_date: "xyz"');
				
				equal(DevaptTypes.to_date(null,date1),					date1, 'DevaptTypes.to_date: null,date1');
				equal(DevaptTypes.to_date(undefined,date1),				date1, 'DevaptTypes.to_date: undefined,date1');
				equal(DevaptTypes.to_date('',date1),					date1, 'DevaptTypes.to_date: "",date1');
				equal(DevaptTypes.to_date('xyz',date1),					date1, 'DevaptTypes.to_date: "xyz",date1');
				
				equal(DevaptTypes.to_date(true),						today, 'DevaptTypes.to_date: true');
				equal(DevaptTypes.to_date(false),						today, 'DevaptTypes.to_date: false');
				equal(DevaptTypes.to_date(1),							date2, 'DevaptTypes.to_date: 1');
				equal(DevaptTypes.to_date(11),							date3, 'DevaptTypes.to_date: 11');
			}
		);
		
		
		test('DevaptTypes.to_time', 1,
			function()
			{
				equal(DevaptTypes.to_time(''),							'', 'DevaptTypes.to_time: ""');
			}
		);
		
		
		test('DevaptTypes.to_datetime', 1,
			function()
			{
				equal(DevaptTypes.to_datetime(''),						'', 'DevaptTypes.to_datetime: ""');
			}
		);
		
		
		test('DevaptTypes.to_array', 1,
			function()
			{
				equal(DevaptTypes.to_array(''),							'', 'DevaptTypes.to_array: ""');
			}
		);
		
		
		test('DevaptTypes.to_object', 1,
			function()
			{
				equal(DevaptTypes.to_object(''),						'', 'DevaptTypes.to_object: ""');
			}
		);
		
		
		test('DevaptTypes.to_callback', 1,
			function()
			{
				equal(DevaptTypes.to_callback(''),						'', 'DevaptTypes.to_callback: ""');
			}
		);
		
		
		test('DevaptTypes.l/rpad', 2,
			function()
			{
				// equal(DevaptTypes.lpad(''),								'', 'DevaptTypes.rpad: ""');
				
				// equal(DevaptTypes.rpad(''),								'', 'DevaptTypes.rpad: ""');
			}
		);
	}
	
	return run_tests;
} );