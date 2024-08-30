type IContext = {
  [key: string]: any;
};

export function renderTemplate(str: any, context: IContext) {
  const regex = /\{\{(.*?)\}\}/g;
  return str.replace(regex, (match, p1) => {
    console.log(match, p1);
    const expression = p1.trim();
    try {
      const func = new Function(
        ...Object.keys(context),
        `return ${expression};`,
      );
      return func(...Object.values(context));
    } catch (e) {
      console.error(`Error evaluating expression: ${expression}`, e);
      return match;
    }
  });
}
