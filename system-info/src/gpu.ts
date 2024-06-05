import * as systemInfo from 'systeminformation';

export async function getGpuInfo(): Promise<[string, string[]]> {
  const [graphics] = await Promise.all([systemInfo.graphics()]);

  let gpus: string[];
  if (graphics && graphics.controllers && graphics.controllers.length > 0) {
    gpus = graphics.controllers.map((x) => {
      return x.vendor.toLowerCase();
    });
  } else {
    gpus = [];
  }

  let is_nvidia = gpus.find((gpu) => /nvidia/i.test(gpu));
  let is_amd = gpus.find((gpu) => /(amd|advanced micro devices)/i.test(gpu));
  let is_apple = gpus.find((gpu) => /apple/i.test(gpu));

  let gpu: string;
  if (is_nvidia) {
    gpu = 'nvidia';
  } else if (is_amd) {
    gpu = 'amd';
  } else if (is_apple) {
    gpu = 'apple';
  } else if (gpus.length > 0) {
    gpu = gpus[0];
  } else {
    gpu = 'none';
  }

  return [gpu, gpus];
}
