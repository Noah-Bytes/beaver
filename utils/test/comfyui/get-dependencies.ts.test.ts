/**
 * @jest-environment node
 */
import { getDependencies } from '../../src/comfyui/get-dependencies';
const data = require('./workflow-quick-and-dirty-weather-change-ip-adapter-control-net-RH4ubUX3wAo0nnywMaZR-crab_close_29-openart.ai.json');

describe('获取依赖信息', () => {
  it('依赖信息', () => {
    const resp = getDependencies(data);
    console.log(resp);
  });
});
