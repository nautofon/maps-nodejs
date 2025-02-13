import type { PrefabDescription, WithToken } from '@truckermudgeon/map/types';

export const d_oil_gst3 = {
  token: 'd_oil_gst3',
  path: 'prefab/depots/fuel_storage/tx_fuel_storage.ppd',
  nodes: [
    {
      x: 5.75,
      y: -2.0697061601328065e-15,
      z: 0,
      rotation: -3.1415926535897927,
      rotationDir: [-1, 0, -4.44089183380283e-16],
      inputLanes: [],
      outputLanes: [],
    },
    {
      x: -1.75,
      y: -1.5207151755481898e-16,
      z: 0,
      rotation: -3.1415926535897927,
      rotationDir: [-1, 0, -4.44089183380283e-16],
      inputLanes: [],
      outputLanes: [],
    },
  ],
  spawnPoints: [
    {
      type: 13,
      x: 18.591148376464844,
      y: -4.7928948402404785,
    },
    {
      type: 2,
      x: 10.814396858215332,
      y: -4.7928948402404785,
    },
  ],
  mapPoints: [
    {
      x: 5.75,
      y: -2.0697061601328065e-15,
      z: 0,
      neighbors: [1],
      type: 'road',
      navFlags: {
        isStart: true,
        isBase: true,
        isExit: false,
      },
      navNode: {
        node0: true,
        node1: false,
        node2: false,
        node3: false,
        node4: false,
        node5: false,
        node6: false,
        nodeCustom: false,
      },
      lanesLeft: 'auto',
      lanesRight: 'auto',
      offset: 0,
    },
    {
      x: -1.75,
      y: -1.5207151755481898e-16,
      z: 0,
      neighbors: [0],
      type: 'road',
      navFlags: {
        isStart: true,
        isBase: true,
        isExit: false,
      },
      navNode: {
        node0: false,
        node1: true,
        node2: false,
        node3: false,
        node4: false,
        node5: false,
        node6: false,
        nodeCustom: false,
      },
      lanesLeft: 'auto',
      lanesRight: 'auto',
      offset: 0,
    },
  ],
  triggerPoints: [],
  navCurves: [],
  navNodes: [
    {
      type: 'physical',
      endIndex: 0,
      connections: [],
    },
    {
      type: 'physical',
      endIndex: 1,
      connections: [],
    },
  ],
} as unknown as WithToken<PrefabDescription>;

export const d_farm_grg = {
  token: 'd_farm_grg',
  path: 'prefab/depots/garage/garage_farming.ppd',
  nodes: [
    {
      x: 18.25,
      y: 47.4453125,
      z: 0,
      rotation: -1.5707963267948966,
      rotationDir: [0, 0, -0.9999999403953552],
      inputLanes: [],
      outputLanes: [],
    },
    {
      x: -51.31640625,
      y: 47.39453125,
      z: 0,
      rotation: -1.5707963267948966,
      rotationDir: [0, 0, -0.9999999403953552],
      inputLanes: [],
      outputLanes: [],
    },
  ],
  spawnPoints: [
    {
      type: 13,
      x: 18.5189266204834,
      y: 42.76891326904297,
    },
    {
      type: 1,
      x: -18.94353675842285,
      y: -44.05061721801758,
    },
    {
      type: 1,
      x: -32.94229507446289,
      y: 33.074607849121094,
    },
    {
      type: 2,
      x: 11.460603713989258,
      y: 21.757720947265625,
    },
    {
      type: 20,
      x: 53.58654022216797,
      y: -34.54591751098633,
    },
    {
      type: 1,
      x: 2.3093466758728027,
      y: -44.284610748291016,
    },
    {
      type: 19,
      x: 53.527713775634766,
      y: -17.826473236083984,
    },
  ],
  mapPoints: [
    {
      x: -58.441341400146484,
      y: 47.479679107666016,
      z: 0,
      neighbors: [1, 2],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -58.441341400146484,
      y: 33.39414596557617,
      z: 0,
      neighbors: [3, 0],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -28.6586971282959,
      y: 47.479679107666016,
      z: 0,
      neighbors: [0, 3],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -28.6586971282959,
      y: 33.39414596557617,
      z: 0,
      neighbors: [2, 1],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -58.84678649902344,
      y: -27.127952575683594,
      z: 0,
      neighbors: [5, 6],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -58.84678649902344,
      y: -46.70033645629883,
      z: 0,
      neighbors: [7, 4],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -1.4672510623931885,
      y: -27.127952575683594,
      z: 0,
      neighbors: [4, 7],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -1.4672510623931885,
      y: -46.70033645629883,
      z: 0,
      neighbors: [6, 5],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 26.42349624633789,
      y: 47.4470100402832,
      z: 0,
      neighbors: [9, 10],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 26.42349624633789,
      y: 34.12077713012695,
      z: 0,
      neighbors: [11, 8],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 57.19830322265625,
      y: 47.4470100402832,
      z: 0,
      neighbors: [8, 11],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 57.19830322265625,
      y: 34.12077713012695,
      z: 0,
      neighbors: [10, 9],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -59.99999237060547,
      y: 47.4470100402832,
      z: 0,
      neighbors: [27, 13],
      type: 'polygon',
      color: 1,
      roadOver: false,
    },
    {
      x: 59.999996185302734,
      y: 47.4470100402832,
      z: 0,
      neighbors: [12, 26],
      type: 'polygon',
      color: 1,
      roadOver: false,
    },
    {
      x: -58.79604721069336,
      y: 24.539051055908203,
      z: 0,
      neighbors: [15, 16],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -58.79604721069336,
      y: 0.3595271110534668,
      z: 0,
      neighbors: [17, 14],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -53.69535827636719,
      y: 24.539051055908203,
      z: 0,
      neighbors: [17, 14],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -50.29193878173828,
      y: 0.3595271110534668,
      z: 0,
      neighbors: [15, 16],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 46.76255416870117,
      y: 34.28983688354492,
      z: 0,
      neighbors: [19, 20],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 46.76255416870117,
      y: 2.390129804611206,
      z: 0,
      neighbors: [21, 18],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 57.19830322265625,
      y: 34.28983688354492,
      z: 0,
      neighbors: [18, 21],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 57.19830322265625,
      y: 2.390129804611206,
      z: 0,
      neighbors: [20, 19],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -18.897050857543945,
      y: 47.479679107666016,
      z: 0,
      neighbors: [23, 24],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: -18.897050857543945,
      y: 5.95661735534668,
      z: 0,
      neighbors: [25, 22],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 8.730093955993652,
      y: 47.479679107666016,
      z: 0,
      neighbors: [22, 25],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 8.730093955993652,
      y: 5.95661735534668,
      z: 0,
      neighbors: [24, 23],
      type: 'polygon',
      color: 2,
      roadOver: true,
    },
    {
      x: 59.999996185302734,
      y: -47.669471740722656,
      z: 0,
      neighbors: [13, 27],
      type: 'polygon',
      color: 1,
      roadOver: false,
    },
    {
      x: -59.99999237060547,
      y: -47.669471740722656,
      z: 0,
      neighbors: [12, 26],
      type: 'polygon',
      color: 1,
      roadOver: false,
    },
    {
      x: 18.251543045043945,
      y: 46.84185791015625,
      z: 0,
      neighbors: [],
      type: 'road',
      navFlags: {
        isStart: false,
        isBase: false,
        isExit: true,
      },
      navNode: {
        node0: true,
        node1: true,
        node2: true,
        node3: true,
        node4: true,
        node5: true,
        node6: true,
        nodeCustom: true,
      },
      lanesLeft: 1,
      lanesRight: 1,
      offset: 0,
    },
    {
      x: -1.4672510623931885,
      y: -47.669471740722656,
      z: 0,
      neighbors: [30, 31],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: -1.4672510623931885,
      y: -45.04659652709961,
      z: 0,
      neighbors: [32, 29],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 59.999996185302734,
      y: -47.669471740722656,
      z: 0,
      neighbors: [32, 29],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 59.999996185302734,
      y: -45.04659652709961,
      z: 0,
      neighbors: [30, 31],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 59.999996185302734,
      y: -47.669471740722656,
      z: 0,
      neighbors: [34, 36],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 59.999996185302734,
      y: 47.4470100402832,
      z: 0,
      neighbors: [35, 33],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 56.694549560546875,
      y: 47.4470100402832,
      z: 0,
      neighbors: [36, 34],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 56.694549560546875,
      y: -47.669471740722656,
      z: 0,
      neighbors: [33, 35],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 59.999996185302734,
      y: 2.390129804611206,
      z: 0,
      neighbors: [38, 40],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 59.999996185302734,
      y: -0.6138562560081482,
      z: 0,
      neighbors: [39, 37],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 46.76255416870117,
      y: -0.6138562560081482,
      z: 0,
      neighbors: [40, 38],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 46.76255416870117,
      y: 2.390129804611206,
      z: 0,
      neighbors: [37, 39],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 36.85148620605469,
      y: 11.756073951721191,
      z: 0,
      neighbors: [42, 44],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 36.85148620605469,
      y: -0.6138562560081482,
      z: 0,
      neighbors: [43, 41],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 46.76255416870117,
      y: -0.6138562560081482,
      z: 0,
      neighbors: [44, 42],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 46.76255416870117,
      y: 11.756073951721191,
      z: 0,
      neighbors: [41, 43],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 46.76255416870117,
      y: 34.23298645019531,
      z: 0,
      neighbors: [46, 48],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 46.76255416870117,
      y: 11.756073951721191,
      z: 0,
      neighbors: [47, 45],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 42.01112747192383,
      y: 11.756073951721191,
      z: 0,
      neighbors: [48, 46],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 42.01112747192383,
      y: 34.23298645019531,
      z: 0,
      neighbors: [45, 47],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 23.49333953857422,
      y: 34.23298645019531,
      z: 0,
      neighbors: [50, 52],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 42.01112747192383,
      y: 34.23298645019531,
      z: 0,
      neighbors: [51, 49],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 42.01112747192383,
      y: 29.392839431762695,
      z: 0,
      neighbors: [52, 50],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 23.49333953857422,
      y: 29.392839431762695,
      z: 0,
      neighbors: [49, 51],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 23.49333953857422,
      y: 34.23298645019531,
      z: 0,
      neighbors: [54, 56],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 26.42349624633789,
      y: 34.23298645019531,
      z: 0,
      neighbors: [55, 53],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 26.42349624633789,
      y: 47.4470100402832,
      z: 0,
      neighbors: [56, 54],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
    {
      x: 23.49333953857422,
      y: 47.4470100402832,
      z: 0,
      neighbors: [53, 55],
      type: 'polygon',
      color: 3,
      roadOver: true,
    },
  ],
  triggerPoints: [],
  navCurves: [],
  navNodes: [
    {
      type: 'physical',
      endIndex: 0,
      connections: [],
    },
    {
      type: 'physical',
      endIndex: 1,
      connections: [],
    },
  ],
} as unknown as WithToken<PrefabDescription>;

export const prefab_us_405 = {
  token: 'us_405',
  path: 'prefab/cross_temp/us_cross_0-2_country_t_1-1_country_tmpl.ppd',
  nodes: [
    {
      x: 1.5258788721439487e-7,
      y: 0,
      z: 0,
      rotation: -1.5707963267948966,
      rotationDir: [0, 0, -0.9999999403953552],
      inputLanes: [10],
      outputLanes: [1],
    },
    {
      x: -22.500001907348633,
      y: -22.5000057220459,
      z: -4.0984105215483013e-13,
      rotation: -1.776356733521132e-15,
      rotationDir: [1, 0, -1.776356733521132e-15],
      inputLanes: [4, 3],
      outputLanes: [],
    },
    {
      x: 22.499996185302734,
      y: -22.5,
      z: 2.671640679681713e-14,
      rotation: -3.141592653589791,
      rotationDir: [-1, 0, -2.331468139954592e-15],
      inputLanes: [],
      outputLanes: [4, 8],
    },
  ],
  spawnPoints: [],
  mapPoints: [
    {
      x: 22.499996185302734,
      y: -22.5,
      z: 0,
      neighbors: [2],
      type: 'road',
      navFlags: {
        isStart: true,
        isBase: false,
        isExit: false,
      },
      navNode: {
        node0: false,
        node1: false,
        node2: true,
        node3: false,
        node4: false,
        node5: false,
        node6: false,
        nodeCustom: false,
      },
      lanesLeft: 1,
      lanesRight: 1,
      offset: 0,
    },
    {
      x: 1.5258788721439487e-7,
      y: 0,
      z: 0,
      neighbors: [2],
      type: 'road',
      navFlags: {
        isStart: true,
        isBase: false,
        isExit: false,
      },
      navNode: {
        node0: true,
        node1: false,
        node2: false,
        node3: false,
        node4: false,
        node5: false,
        node6: false,
        nodeCustom: false,
      },
      lanesLeft: 1,
      lanesRight: 1,
      offset: 0,
    },
    {
      x: 3.051757175853709e-7,
      y: -22.5000057220459,
      z: 0,
      neighbors: [1, 0, 3],
      type: 'road',
      navFlags: {
        isStart: false,
        isBase: false,
        isExit: false,
      },
      navNode: {
        node0: false,
        node1: false,
        node2: false,
        node3: false,
        node4: false,
        node5: false,
        node6: false,
        nodeCustom: false,
      },
      lanesLeft: 1,
      lanesRight: 1,
      offset: 0,
    },
    {
      x: -22.500001907348633,
      y: -22.5000057220459,
      z: 0,
      neighbors: [2],
      type: 'road',
      navFlags: {
        isStart: true,
        isBase: false,
        isExit: false,
      },
      navNode: {
        node0: false,
        node1: true,
        node2: false,
        node3: false,
        node4: false,
        node5: false,
        node6: false,
        nodeCustom: false,
      },
      lanesLeft: 1,
      lanesRight: 1,
      offset: 0,
    },
  ],
  triggerPoints: [],
  navCurves: [
    {
      navNodeIndex: 2,
      start: {
        x: -5.329780578613281,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      end: {
        x: 14.705333709716797,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      nextLines: [8],
      prevLines: [6],
    },
    {
      navNodeIndex: 0,
      start: {
        x: -2.249999761581421,
        y: -5.629767894744873,
        z: -1.7053025277077578e-15,
        rotation: 1.5707961519493328,
        rotationQuat: [-8.742277657347586e-8, 0, 0.9999999403953552, 0],
      },
      end: {
        x: -2.249999761581421,
        y: 6.366462939515552e-14,
        z: -1.7053025277077578e-15,
        rotation: 1.5707961519493328,
        rotationQuat: [-8.742277657347586e-8, 0, 0.9999999403953552, 0],
      },
      nextLines: [],
      prevLines: [9],
    },
    {
      navNodeIndex: 2,
      start: {
        x: 2.250000238418579,
        y: -5.467690467834473,
        z: 0,
        rotation: -1.5707965016404586,
        rotationQuat: [-0.9999999403953552, 0, -8.742277657347586e-8, 0],
      },
      end: {
        x: 5.0815815925598145,
        y: -15.530542373657227,
        z: 0,
        rotation: -0.9254446768859417,
        rotationQuat: [-0.9483903646469116, 0, 0.3171054422855377, 0],
      },
      nextLines: [5],
      prevLines: [10],
    },
    {
      navNodeIndex: 3,
      start: {
        x: -22.500001907348633,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      end: {
        x: -14.132777214050293,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      nextLines: [6, 7],
      prevLines: [],
    },
    {
      navNodeIndex: 2,
      start: {
        x: -22.500001907348633,
        y: -24.7500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      end: {
        x: 22.499996185302734,
        y: -24.7500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      nextLines: [],
      prevLines: [],
    },
    {
      navNodeIndex: 2,
      start: {
        x: 5.0815815925598145,
        y: -15.530542373657227,
        z: 0,
        rotation: -0.9254446768859417,
        rotationQuat: [-0.9483903646469116, 0, 0.3171054422855377, 0],
      },
      end: {
        x: 14.705333709716797,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      nextLines: [8],
      prevLines: [2],
    },
    {
      navNodeIndex: 2,
      start: {
        x: -14.132777214050293,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      end: {
        x: -5.329780578613281,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      nextLines: [0],
      prevLines: [3],
    },
    {
      navNodeIndex: 0,
      start: {
        x: -14.132777214050293,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      end: {
        x: -9.06944751739502,
        y: -19.447725296020508,
        z: -4.0984105215483013e-13,
        rotation: 0.3516805246542454,
        rotationQuat: [-0.5725050568580627, 0, 0.8199012279510498, 0],
      },
      nextLines: [9],
      prevLines: [3],
    },
    {
      navNodeIndex: 2,
      start: {
        x: 14.705333709716797,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      end: {
        x: 22.499996185302734,
        y: -20.2500057220459,
        z: -4.0984105215483013e-13,
        rotation: -1.6858738316472e-7,
        rotationQuat: [-0.70710688829422, 0, 0.7071067690849304, 0],
      },
      nextLines: [],
      prevLines: [0, 5],
    },
    {
      navNodeIndex: 0,
      start: {
        x: -9.06944751739502,
        y: -19.447725296020508,
        z: -4.0984105215483013e-13,
        rotation: 0.3516805246542454,
        rotationQuat: [-0.5725050568580627, 0, 0.8199012279510498, 0],
      },
      end: {
        x: -2.249999761581421,
        y: -5.629767894744873,
        z: -1.7053025277077578e-15,
        rotation: 1.5707961519493328,
        rotationQuat: [-8.742277657347586e-8, 0, 0.9999999403953552, 0],
      },
      nextLines: [1],
      prevLines: [7],
    },
    {
      navNodeIndex: 2,
      start: {
        x: 2.250000238418579,
        y: -9.094946814441375e-15,
        z: 0,
        rotation: -1.5707965016404586,
        rotationQuat: [-0.9999999403953552, 0, -8.742277657347586e-8, 0],
      },
      end: {
        x: 2.250000238418579,
        y: -5.467690467834473,
        z: 0,
        rotation: -1.5707965016404586,
        rotationQuat: [-0.9999999403953552, 0, -8.742277657347586e-8, 0],
      },
      nextLines: [2],
      prevLines: [],
    },
  ],
  navNodes: [
    {
      type: 'physical',
      endIndex: 0,
      connections: [
        {
          targetNavNodeIndex: 2,
          curveIndices: [10, 2, 5, 8],
        },
      ],
    },
    {
      type: 'physical',
      endIndex: 1,
      connections: [
        {
          targetNavNodeIndex: 2,
          curveIndices: [4],
        },
        {
          targetNavNodeIndex: 3,
          curveIndices: [3],
        },
      ],
    },
    {
      type: 'physical',
      endIndex: 2,
      connections: [],
    },
    {
      type: 'ai',
      endIndex: 3,
      connections: [
        {
          targetNavNodeIndex: 0,
          curveIndices: [7, 9, 1],
        },
        {
          targetNavNodeIndex: 2,
          curveIndices: [6, 0, 8],
        },
      ],
    },
  ],
} as unknown as WithToken<PrefabDescription>;
