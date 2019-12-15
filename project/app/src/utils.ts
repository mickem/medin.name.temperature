// decorator factory function
export function Catch(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // save a reference to the original method
    const originalMethod = descriptor.value;

    // rewrite original method with custom wrapper
    descriptor.value = function(...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);

        // check if method is asynchronous
        if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
          // return promise
          return result.catch((error: any) => {
            console.log(
              `A fault occured in ${propertyKey}: \n|${(originalMethod as any).toString().replace(/\n/g, '\n| ')}`,
            );
            console.log(error);
            throw error;
          });
        }

        // return actual result
        return result;
      } catch (error) {
        throw error;
      }
    };

    return descriptor;
  };
}
