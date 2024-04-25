export interface IWorkflowDependencies {
  node: string[];
  model: string[];
  lora: string[];
}

export function getDependencies(data: string | any) {
  const result: IWorkflowDependencies = {
    node: [],
    model: [],
    lora: []
  };
  let json = data;
  if (typeof data === 'string') {
    try {
      json = JSON.parse(data);
    } catch (e) {
      return result;
    }
  }

  if (data['nodes'] && Array.isArray(data['nodes'])) {
    for (let node of data['nodes']) {
      result.node.push(node['type']);
      const widgetsValues = node['widgets_values'] as string[];
      if (widgetsValues) {
        widgetsValues.forEach((elem) => {
          if (`${elem}`.includes('.safetensors')) {

            if (`${elem}`.includes('lora')) {
              result.lora.push(elem);
            } else {
              result.model.push(elem);
            }
          }
        });
      }
    }
  }

  return result;
}
