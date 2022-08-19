/* eslint-disable @typescript-eslint/ban-ts-comment */
export const LIGHT_GRAY = '#e3e3e1';

export function getSorter<T>(dataIndex: string) {
  return (a: T, b: T) => {
    const aProp = getProp(a, dataIndex);

    if (typeof aProp === 'number') {
      return aProp - getProp(b, dataIndex);
    }

    return getPropString(a, dataIndex).localeCompare(getPropString(b, dataIndex), 'en');
  };
}

export function getProp(object: unknown, property: string) {
  if (!object || !property || typeof object !== 'object') {
    return undefined;
  }

  const properties = property.split('.');
  let currentObject = object;
  let index = 0;
  let currentProperty = properties[index];

  while (currentObject.hasOwnProperty(currentProperty)) {
    if (index === properties.length - 1) {
      // @ts-ignore
      return currentObject[currentProperty];
    } else {
      // @ts-ignore
      currentObject = currentObject[currentProperty];
      if (currentObject === undefined) {
        return undefined;
      }
      index++;
      currentProperty = properties[index];
    }
    if (currentObject === undefined) {
      return undefined;
    }
  }

  return undefined;
}

export function getPropString(object: unknown, property: string): string {
  const value = getProp(object, property);
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  if (value && value.toString) {
    return value.toString();
  }
  return value + '';
}

export function calculatePageNumbers(currentPage: number, pageCount: number) {
  if (pageCount < 8) {
    return Array.from(new Array(pageCount)).map((_, i) => i + 1);
  }

  const dotsLeft = currentPage - 1 >= 4;
  const dotsRight = pageCount - currentPage >= 4;

  return [
    1,
    dotsLeft ? '...' : currentPage < 4 ? 2 : currentPage - 2,
    currentPage < 4 ? 3 : currentPage > pageCount - 3 ? pageCount - 4 : currentPage - 1,
    currentPage < 4 ? 4 : currentPage > pageCount - 3 ? pageCount - 3 : currentPage,
    currentPage < 4 ? 5 : currentPage > pageCount - 3 ? pageCount - 2 : currentPage + 1,
    dotsRight
      ? '...'
      : currentPage < 4
      ? 6
      : currentPage > pageCount - 3
      ? pageCount - 1
      : currentPage + 2,
    pageCount,
  ];
}

export function setProp(obj: unknown, path: string, value: unknown) {
  if (!obj || path.length === 0 || typeof obj !== 'object') {
    return;
  }
  const keyPath = path.split('.');
  const lastKeyIndex = keyPath.length - 1;
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i];
    // @ts-ignore
    if (!(key in obj) || !obj[key]) {
      // @ts-ignore
      obj[key] = {};
    }
    // @ts-ignore
    obj = obj[key];
  }
  // @ts-ignore
  obj[keyPath[lastKeyIndex]] = value;
}
