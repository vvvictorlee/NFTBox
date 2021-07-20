/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
 function isArray(val) {
	return toString.call(val) === "[object Array]";
}

/**
 * Example:
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
 export function merge(/* obj1, obj2, obj3, ... */) {
	var result = {};

	function assignValue(val, key) {
		if (typeof result[key] === "object" && typeof val === "object") {
			result[key] = merge(result[key], val);
		} else {
			result[key] = val;
		}
	}

	for (var i = 0, l = arguments.length; i < l; i++) {
		forEach(arguments[i], assignValue);
	}
	return result;
}