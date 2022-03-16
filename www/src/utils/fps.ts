export default function createFpsRender(fpsNode: HTMLDivElement): Function {
  let fpsArray: number[] = [];
  let lastFps = performance.now();
  return () => {
    const now = performance.now();
    const delta = now - lastFps;
    lastFps = now;
    const fps = (1 / delta) * 1000;

    fpsArray.push(fps);
    fpsArray.length > 100 ? fpsArray.shift() : void 0;

    let min = Infinity;
    let max = -Infinity;
    const sum = fpsArray.reduce((pre, cur) => {
      min = Math.min(cur, min);
      max = Math.max(cur, max);
      return pre + cur;
    }, 0);
    const mean = sum / fpsArray.length;

    fpsNode.textContent = `
Frames per Second:
      latest = ${Math.round(fps)};
avg of last 100 = ${Math.round(mean)};
min of last 100 = ${Math.round(min)};
max of last 100 = ${Math.round(max)};
`.trim();
  };
}
