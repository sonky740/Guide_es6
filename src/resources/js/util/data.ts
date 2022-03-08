/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): dom/data.js => typescript feat.SKY
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

interface componentObject {
  _element: HTMLElement;
  hide: () => void;
}

const elementMap = new Map();

export default {
  set(element: HTMLElement, key: string, instance: object) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }

    const instanceMap = elementMap.get(element);

    // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }

    instanceMap.set(key, instance);
  },

  get(element: HTMLElement, key: string) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }

    return null;
  },
  getAll(key: string) {
    const instances: componentObject[] = [];
    elementMap.forEach(value => {
      value.forEach((value2: componentObject, _key2: string) => {
        if (_key2 === key) {
          console.log(value2);
          instances.push(value2);
        }
      });
    });
    return instances;
  },

  remove(element: HTMLElement, key: string) {
    if (!elementMap.has(element)) {
      return;
    }

    const instanceMap = elementMap.get(element);

    instanceMap.delete(key);

    // free up element references if there are no instances left for an element
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
};
