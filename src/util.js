export function containsNestedArray(value) {
  // If value is an array, check if any of its elements are arrays
  if (Array.isArray(value)) {
    return value.some(
      (item) => Array.isArray(item) || containsNestedArray(item)
    );
  }
  // If value is an object, check its properties
  else if (typeof value === 'object' && value !== null) {
    return Object.values(value).some(
      (item) => Array.isArray(item) || containsNestedArray(item)
    );
  }
  return false;
}

export function getNode(rootNode, path) {
  // Create a copy of the path to avoid modifying the original
  const pathCopy = Array.isArray(path) ? [...path] : path;

  // Base case: empty path returns the current node
  if (pathCopy.length === 0) {
    return rootNode;
  }

  // Get the next key in the path and continue recursion
  const nextKey = pathCopy.shift();
  return getNode(rootNode[nextKey], pathCopy);
}

export function convertToArray(val) {
  return Array.isArray(val) ? val : [val];
}
