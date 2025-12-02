
import { CircuitComponentType, CircuitState } from './types';

export const GRID_SIZE = 20;

export const COMPONENT_DEFINITIONS: Record<string, CircuitComponentType> = {
  // --- GATES ---
  AND: {
    type: 'AND',
    name: 'AND Gate',
    category: 'gate',
    icon: 'Component',
    width: 80,
    height: 60,
    ports: [
      { id: 'in1', type: 'input', offsetX: 0, offsetY: 15 },
      { id: 'in2', type: 'input', offsetX: 0, offsetY: 45 },
      { id: 'out', type: 'output', offsetX: 80, offsetY: 30 },
    ],
  },
  OR: {
    type: 'OR',
    name: 'OR Gate',
    category: 'gate',
    icon: 'Component',
    width: 80,
    height: 60,
    ports: [
      { id: 'in1', type: 'input', offsetX: 0, offsetY: 15 },
      { id: 'in2', type: 'input', offsetX: 0, offsetY: 45 },
      { id: 'out', type: 'output', offsetX: 80, offsetY: 30 },
    ],
  },
  XOR: {
    type: 'XOR',
    name: 'XOR Gate',
    category: 'gate',
    icon: 'Component',
    width: 80,
    height: 60,
    ports: [
      { id: 'in1', type: 'input', offsetX: 0, offsetY: 15 },
      { id: 'in2', type: 'input', offsetX: 0, offsetY: 45 },
      { id: 'out', type: 'output', offsetX: 80, offsetY: 30 },
    ],
  },
  NAND: {
    type: 'NAND',
    name: 'NAND Gate',
    category: 'gate',
    icon: 'Component',
    width: 80,
    height: 60,
    ports: [
      { id: 'in1', type: 'input', offsetX: 0, offsetY: 15 },
      { id: 'in2', type: 'input', offsetX: 0, offsetY: 45 },
      { id: 'out', type: 'output', offsetX: 80, offsetY: 30 },
    ],
  },
  NOR: {
    type: 'NOR',
    name: 'NOR Gate',
    category: 'gate',
    icon: 'Component',
    width: 80,
    height: 60,
    ports: [
      { id: 'in1', type: 'input', offsetX: 0, offsetY: 15 },
      { id: 'in2', type: 'input', offsetX: 0, offsetY: 45 },
      { id: 'out', type: 'output', offsetX: 80, offsetY: 30 },
    ],
  },
  XNOR: {
    type: 'XNOR',
    name: 'XNOR Gate',
    category: 'gate',
    icon: 'Component',
    width: 80,
    height: 60,
    ports: [
      { id: 'in1', type: 'input', offsetX: 0, offsetY: 15 },
      { id: 'in2', type: 'input', offsetX: 0, offsetY: 45 },
      { id: 'out', type: 'output', offsetX: 80, offsetY: 30 },
    ],
  },
  NOT: {
    type: 'NOT',
    name: 'NOT Inverter',
    category: 'gate',
    icon: 'Triangle',
    width: 60,
    height: 40,
    ports: [
      { id: 'in', type: 'input', offsetX: 0, offsetY: 20 },
      { id: 'out', type: 'output', offsetX: 60, offsetY: 20 },
    ],
  },

  // --- MEMORY / SEQUENTIAL ---
  D_FF: {
    type: 'D_FF',
    name: 'D Flip-Flop',
    category: 'memory',
    icon: 'MemoryStick',
    width: 80,
    height: 80,
    ports: [
      { id: 'd', type: 'input', offsetX: 0, offsetY: 20, label: 'D' },
      { id: 'clk', type: 'input', offsetX: 0, offsetY: 60, label: '>' },
      { id: 'q', type: 'output', offsetX: 80, offsetY: 20, label: 'Q' },
      { id: 'nq', type: 'output', offsetX: 80, offsetY: 60, label: 'Q\'' },
    ],
  },
  JK_FF: {
    type: 'JK_FF',
    name: 'JK Flip-Flop',
    category: 'memory',
    icon: 'MemoryStick',
    width: 80,
    height: 100,
    ports: [
      { id: 'j', type: 'input', offsetX: 0, offsetY: 20, label: 'J' },
      { id: 'clk', type: 'input', offsetX: 0, offsetY: 50, label: '>' },
      { id: 'k', type: 'input', offsetX: 0, offsetY: 80, label: 'K' },
      { id: 'q', type: 'output', offsetX: 80, offsetY: 20, label: 'Q' },
      { id: 'nq', type: 'output', offsetX: 80, offsetY: 80, label: 'Q\'' },
    ],
  },

  // --- COMPLEX ---
  MUX: {
    type: 'MUX',
    name: 'Multiplexer 2:1',
    category: 'complex',
    icon: 'GitMerge',
    width: 60,
    height: 80,
    ports: [
      { id: 'd0', type: 'input', offsetX: 0, offsetY: 20, label: '0' },
      { id: 'd1', type: 'input', offsetX: 0, offsetY: 60, label: '1' },
      { id: 'sel', type: 'input', offsetX: 30, offsetY: 80, label: 'S' },
      { id: 'out', type: 'output', offsetX: 60, offsetY: 40 },
    ]
  },

  // --- SOURCES ---
  SWITCH: {
    type: 'SWITCH',
    name: 'Toggle Switch',
    category: 'source',
    icon: 'ToggleLeft',
    width: 60,
    height: 40,
    ports: [
      { id: 'out', type: 'output', offsetX: 60, offsetY: 20 },
    ],
  },
  BUTTON: {
    type: 'BUTTON',
    name: 'Push Button',
    category: 'source',
    icon: 'CircleDot',
    width: 40,
    height: 40,
    ports: [
      { id: 'out', type: 'output', offsetX: 40, offsetY: 20 },
    ],
  },
  CLOCK: {
    type: 'CLOCK',
    name: 'Clock Pulse',
    category: 'source',
    icon: 'Clock',
    width: 60,
    height: 40,
    ports: [
      { id: 'out', type: 'output', offsetX: 60, offsetY: 20 },
    ],
  },

  // --- OUTPUTS ---
  LED: {
    type: 'LED',
    name: 'LED Status',
    category: 'output',
    icon: 'Lightbulb',
    width: 40,
    height: 40,
    ports: [
      { id: 'in', type: 'input', offsetX: 0, offsetY: 20 },
    ],
  },
  HEX: {
    type: 'HEX',
    name: 'Hex Display',
    category: 'output',
    icon: 'BoxSelect',
    width: 60,
    height: 80,
    ports: [
      { id: 'in8', type: 'input', offsetX: 0, offsetY: 15 },
      { id: 'in4', type: 'input', offsetX: 0, offsetY: 30 },
      { id: 'in2', type: 'input', offsetX: 0, offsetY: 45 },
      { id: 'in1', type: 'input', offsetX: 0, offsetY: 60 },
    ],
  },
};

export const CIRCUIT_EXAMPLES: Record<string, { name: string; description: string; state: CircuitState }> = {
  SUBTRACTOR_4BIT: {
    name: "4-Bit Binary Subtractor",
    description: "Engineering Standard: Performs A - B using 2's Complement logic (Inverters + Adder).",
    state: {
      scale: 0.7,
      offset: { x: 40, y: 40 },
      selectedId: null,
      nodes: [
        // Inputs A
        { id: 'a3', type: 'SWITCH', x: 60, y: 40, rotation: 0, data: { active: true }, label: 'A3 (8)' },
        { id: 'a2', type: 'SWITCH', x: 60, y: 100, rotation: 0, data: { active: false }, label: 'A2 (4)' },
        { id: 'a1', type: 'SWITCH', x: 60, y: 160, rotation: 0, data: { active: true }, label: 'A1 (2)' },
        { id: 'a0', type: 'SWITCH', x: 60, y: 220, rotation: 0, data: { active: false }, label: 'A0 (1)' },
        // Inputs B
        { id: 'b3', type: 'SWITCH', x: 60, y: 320, rotation: 0, data: { active: false }, label: 'B3 (8)' },
        { id: 'b2', type: 'SWITCH', x: 60, y: 380, rotation: 0, data: { active: true }, label: 'B2 (4)' },
        { id: 'b1', type: 'SWITCH', x: 60, y: 440, rotation: 0, data: { active: false }, label: 'B1 (2)' },
        { id: 'b0', type: 'SWITCH', x: 60, y: 500, rotation: 0, data: { active: true }, label: 'B0 (1)' },
        // 2's Comp Logic (XORs acting as controlled inverters with Cin=1)
        { id: 'xor_b0', type: 'XOR', x: 200, y: 500, rotation: 0, data: {}, label: 'INV B0' },
        { id: 'xor_b1', type: 'XOR', x: 200, y: 440, rotation: 0, data: {}, label: 'INV B1' },
        { id: 'xor_b2', type: 'XOR', x: 200, y: 380, rotation: 0, data: {}, label: 'INV B2' },
        { id: 'xor_b3', type: 'XOR', x: 200, y: 320, rotation: 0, data: {}, label: 'INV B3' },
        // Mode Select (Subtract = 1)
        { id: 'mode_sub', type: 'SWITCH', x: 60, y: 600, rotation: 0, data: { active: true }, label: 'SUB MODE' },
        // Adders (represented by XOR/AND logic blocks for visual clarity)
        { id: 'sum_0', type: 'XOR', x: 400, y: 220, rotation: 0, data: {}, label: 'SUM 0' },
        { id: 'sum_1', type: 'XOR', x: 400, y: 160, rotation: 0, data: {}, label: 'SUM 1' },
        { id: 'sum_2', type: 'XOR', x: 400, y: 100, rotation: 0, data: {}, label: 'SUM 2' },
        { id: 'sum_3', type: 'XOR', x: 400, y: 40, rotation: 0, data: {}, label: 'SUM 3' },
        // Output
        { id: 'hex', type: 'HEX', x: 600, y: 120, rotation: 0, data: { value: 0 }, label: 'RESULT' }
      ],
      wires: [
        // Mode to XORs (Invert B)
        { id: 'w_m0', sourceNodeId: 'mode_sub', sourcePortId: 'out', targetNodeId: 'xor_b0', targetPortId: 'in2', state: true },
        { id: 'w_m1', sourceNodeId: 'mode_sub', sourcePortId: 'out', targetNodeId: 'xor_b1', targetPortId: 'in2', state: true },
        { id: 'w_m2', sourceNodeId: 'mode_sub', sourcePortId: 'out', targetNodeId: 'xor_b2', targetPortId: 'in2', state: true },
        { id: 'w_m3', sourceNodeId: 'mode_sub', sourcePortId: 'out', targetNodeId: 'xor_b3', targetPortId: 'in2', state: true },
        // B Inputs to XORs
        { id: 'w_b0', sourceNodeId: 'b0', sourcePortId: 'out', targetNodeId: 'xor_b0', targetPortId: 'in1', state: false },
        { id: 'w_b1', sourceNodeId: 'b1', sourcePortId: 'out', targetNodeId: 'xor_b1', targetPortId: 'in1', state: false },
        { id: 'w_b2', sourceNodeId: 'b2', sourcePortId: 'out', targetNodeId: 'xor_b2', targetPortId: 'in1', state: false },
        { id: 'w_b3', sourceNodeId: 'b3', sourcePortId: 'out', targetNodeId: 'xor_b3', targetPortId: 'in1', state: false },
        // Adder Logic (Simplified for Visuals - A XOR B_inv)
        { id: 'w_a0', sourceNodeId: 'a0', sourcePortId: 'out', targetNodeId: 'sum_0', targetPortId: 'in1', state: false },
        { id: 'w_inv0', sourceNodeId: 'xor_b0', sourcePortId: 'out', targetNodeId: 'sum_0', targetPortId: 'in2', state: false },
        { id: 'w_a1', sourceNodeId: 'a1', sourcePortId: 'out', targetNodeId: 'sum_1', targetPortId: 'in1', state: false },
        { id: 'w_inv1', sourceNodeId: 'xor_b1', sourcePortId: 'out', targetNodeId: 'sum_1', targetPortId: 'in2', state: false },
        { id: 'w_a2', sourceNodeId: 'a2', sourcePortId: 'out', targetNodeId: 'sum_2', targetPortId: 'in1', state: false },
        { id: 'w_inv2', sourceNodeId: 'xor_b2', sourcePortId: 'out', targetNodeId: 'sum_2', targetPortId: 'in2', state: false },
        { id: 'w_a3', sourceNodeId: 'a3', sourcePortId: 'out', targetNodeId: 'sum_3', targetPortId: 'in1', state: false },
        { id: 'w_inv3', sourceNodeId: 'xor_b3', sourcePortId: 'out', targetNodeId: 'sum_3', targetPortId: 'in2', state: false },
        // Sums to Hex
        { id: 'w_h1', sourceNodeId: 'sum_0', sourcePortId: 'out', targetNodeId: 'hex', targetPortId: 'in1', state: false },
        { id: 'w_h2', sourceNodeId: 'sum_1', sourcePortId: 'out', targetNodeId: 'hex', targetPortId: 'in2', state: false },
        { id: 'w_h4', sourceNodeId: 'sum_2', sourcePortId: 'out', targetNodeId: 'hex', targetPortId: 'in4', state: false },
        { id: 'w_h8', sourceNodeId: 'sum_3', sourcePortId: 'out', targetNodeId: 'hex', targetPortId: 'in8', state: false },
      ]
    }
  },
  SHIFT_REGISTER: {
    name: "4-Bit Shift Register (SISO)",
    description: "Data enters serially and shifts right on each clock pulse. Essential for data communication.",
    state: {
      scale: 1,
      offset: { x: 50, y: 50 },
      selectedId: null,
      nodes: [
        { id: 'clk', type: 'CLOCK', x: 60, y: 200, rotation: 0, data: {}, label: 'CLK' },
        { id: 'data_in', type: 'SWITCH', x: 60, y: 80, rotation: 0, data: { active: false }, label: 'DATA' },
        { id: 'ff0', type: 'D_FF', x: 200, y: 100, rotation: 0, data: { q: false }, label: 'BIT 0' },
        { id: 'ff1', type: 'D_FF', x: 340, y: 100, rotation: 0, data: { q: false }, label: 'BIT 1' },
        { id: 'ff2', type: 'D_FF', x: 480, y: 100, rotation: 0, data: { q: false }, label: 'BIT 2' },
        { id: 'ff3', type: 'D_FF', x: 620, y: 100, rotation: 0, data: { q: false }, label: 'BIT 3' },
        { id: 'led0', type: 'LED', x: 200, y: 240, rotation: 0, data: { active: false }, label: 'Q0' },
        { id: 'led1', type: 'LED', x: 340, y: 240, rotation: 0, data: { active: false }, label: 'Q1' },
        { id: 'led2', type: 'LED', x: 480, y: 240, rotation: 0, data: { active: false }, label: 'Q2' },
        { id: 'led3', type: 'LED', x: 620, y: 240, rotation: 0, data: { active: false }, label: 'Q3' },
      ],
      wires: [
        { id: 'w_d0', sourceNodeId: 'data_in', sourcePortId: 'out', targetNodeId: 'ff0', targetPortId: 'd', state: false },
        { id: 'w_c0', sourceNodeId: 'clk', sourcePortId: 'out', targetNodeId: 'ff0', targetPortId: 'clk', state: false },
        { id: 'w_s1', sourceNodeId: 'ff0', sourcePortId: 'q', targetNodeId: 'ff1', targetPortId: 'd', state: false },
        { id: 'w_c1', sourceNodeId: 'clk', sourcePortId: 'out', targetNodeId: 'ff1', targetPortId: 'clk', state: false },
        { id: 'w_s2', sourceNodeId: 'ff1', sourcePortId: 'q', targetNodeId: 'ff2', targetPortId: 'd', state: false },
        { id: 'w_c2', sourceNodeId: 'clk', sourcePortId: 'out', targetNodeId: 'ff2', targetPortId: 'clk', state: false },
        { id: 'w_s3', sourceNodeId: 'ff2', sourcePortId: 'q', targetNodeId: 'ff3', targetPortId: 'd', state: false },
        { id: 'w_c3', sourceNodeId: 'clk', sourcePortId: 'out', targetNodeId: 'ff3', targetPortId: 'clk', state: false },
        // LEDs
        { id: 'w_l0', sourceNodeId: 'ff0', sourcePortId: 'q', targetNodeId: 'led0', targetPortId: 'in', state: false },
        { id: 'w_l1', sourceNodeId: 'ff1', sourcePortId: 'q', targetNodeId: 'led1', targetPortId: 'in', state: false },
        { id: 'w_l2', sourceNodeId: 'ff2', sourcePortId: 'q', targetNodeId: 'led2', targetPortId: 'in', state: false },
        { id: 'w_l3', sourceNodeId: 'ff3', sourcePortId: 'q', targetNodeId: 'led3', targetPortId: 'in', state: false },
      ]
    }
  },
  FULL_ADDER: {
    name: "1-Bit Full Adder",
    description: "Adds three 1-bit binary numbers (A, B, Carry-In) and outputs Sum and Carry-Out.",
    state: {
      scale: 1,
      offset: { x: 50, y: 50 },
      selectedId: null,
      nodes: [
        { id: 'a', type: 'SWITCH', x: 60, y: 60, rotation: 0, data: { active: false }, label: 'Input A' },
        { id: 'b', type: 'SWITCH', x: 60, y: 140, rotation: 0, data: { active: false }, label: 'Input B' },
        { id: 'cin', type: 'SWITCH', x: 60, y: 220, rotation: 0, data: { active: false }, label: 'Carry In' },
        { id: 'xor1', type: 'XOR', x: 200, y: 100, rotation: 0, data: {}, label: 'Half Add' },
        { id: 'xor2', type: 'XOR', x: 360, y: 160, rotation: 0, data: {}, label: 'Sum Logic' },
        { id: 'and1', type: 'AND', x: 200, y: 240, rotation: 0, data: {}, label: 'Carry 1' },
        { id: 'and2', type: 'AND', x: 360, y: 300, rotation: 0, data: {}, label: 'Carry 2' },
        { id: 'or1', type: 'OR', x: 500, y: 270, rotation: 0, data: {}, label: 'C-Out Logic' },
        { id: 'sum_led', type: 'LED', x: 500, y: 160, rotation: 0, data: { active: false }, label: 'SUM' },
        { id: 'cout_led', type: 'LED', x: 640, y: 270, rotation: 0, data: { active: false }, label: 'CARRY OUT' }
      ],
      wires: [
        { id: 'w1', sourceNodeId: 'a', sourcePortId: 'out', targetNodeId: 'xor1', targetPortId: 'in1', state: false },
        { id: 'w2', sourceNodeId: 'b', sourcePortId: 'out', targetNodeId: 'xor1', targetPortId: 'in2', state: false },
        { id: 'w3', sourceNodeId: 'xor1', sourcePortId: 'out', targetNodeId: 'xor2', targetPortId: 'in1', state: false },
        { id: 'w4', sourceNodeId: 'cin', sourcePortId: 'out', targetNodeId: 'xor2', targetPortId: 'in2', state: false },
        { id: 'w5', sourceNodeId: 'xor2', sourcePortId: 'out', targetNodeId: 'sum_led', targetPortId: 'in', state: false },
        { id: 'w6', sourceNodeId: 'a', sourcePortId: 'out', targetNodeId: 'and1', targetPortId: 'in1', state: false },
        { id: 'w7', sourceNodeId: 'b', sourcePortId: 'out', targetNodeId: 'and1', targetPortId: 'in2', state: false },
        { id: 'w8', sourceNodeId: 'xor1', sourcePortId: 'out', targetNodeId: 'and2', targetPortId: 'in1', state: false },
        { id: 'w9', sourceNodeId: 'cin', sourcePortId: 'out', targetNodeId: 'and2', targetPortId: 'in2', state: false },
        { id: 'w10', sourceNodeId: 'and1', sourcePortId: 'out', targetNodeId: 'or1', targetPortId: 'in2', state: false },
        { id: 'w11', sourceNodeId: 'and2', sourcePortId: 'out', targetNodeId: 'or1', targetPortId: 'in1', state: false },
        { id: 'w12', sourceNodeId: 'or1', sourcePortId: 'out', targetNodeId: 'cout_led', targetPortId: 'in', state: false }
      ]
    }
  },
  TRAFFIC_LIGHT: {
    name: "Traffic Light Controller",
    description: "Uses a Clock and Logic to cycle through Green, Yellow, and Red states.",
    state: {
      scale: 1,
      offset: { x: 50, y: 50 },
      selectedId: null,
      nodes: [
        { id: 'clk', type: 'CLOCK', x: 60, y: 150, rotation: 0, data: {}, label: 'Timer' },
        { id: 'ff1', type: 'JK_FF', x: 200, y: 120, rotation: 0, data: { q: false }, label: 'State A' },
        { id: 'ff2', type: 'JK_FF', x: 350, y: 120, rotation: 0, data: { q: false }, label: 'State B' },
        { id: 'logic_g', type: 'AND', x: 500, y: 60, rotation: 0, data: {}, label: 'G_Logic' },
        { id: 'logic_y', type: 'XOR', x: 500, y: 160, rotation: 0, data: {}, label: 'Y_Logic' },
        { id: 'logic_r', type: 'AND', x: 500, y: 260, rotation: 0, data: {}, label: 'R_Logic' },
        { id: 'led_g', type: 'LED', x: 650, y: 70, rotation: 0, data: { active: false }, label: 'GREEN' },
        { id: 'led_y', type: 'LED', x: 650, y: 170, rotation: 0, data: { active: false }, label: 'YELLOW' },
        { id: 'led_r', type: 'LED', x: 650, y: 270, rotation: 0, data: { active: false }, label: 'RED' },
        { id: 'pow', type: 'SWITCH', x: 60, y: 50, rotation: 0, data: { active: true }, label: 'POWER' }
      ],
      wires: [
        { id: 'w1', sourceNodeId: 'pow', sourcePortId: 'out', targetNodeId: 'ff1', targetPortId: 'j', state: true },
        { id: 'w2', sourceNodeId: 'pow', sourcePortId: 'out', targetNodeId: 'ff1', targetPortId: 'k', state: true },
        { id: 'w3', sourceNodeId: 'pow', sourcePortId: 'out', targetNodeId: 'ff2', targetPortId: 'j', state: true },
        { id: 'w4', sourceNodeId: 'pow', sourcePortId: 'out', targetNodeId: 'ff2', targetPortId: 'k', state: true },
        { id: 'w5', sourceNodeId: 'clk', sourcePortId: 'out', targetNodeId: 'ff1', targetPortId: 'clk', state: false },
        { id: 'w6', sourceNodeId: 'ff1', sourcePortId: 'q', targetNodeId: 'ff2', targetPortId: 'clk', state: false },
        { id: 'w7', sourceNodeId: 'ff1', sourcePortId: 'nq', targetNodeId: 'logic_g', targetPortId: 'in1', state: false },
        { id: 'w8', sourceNodeId: 'ff2', sourcePortId: 'nq', targetNodeId: 'logic_g', targetPortId: 'in2', state: false },
        { id: 'w9', sourceNodeId: 'ff1', sourcePortId: 'q', targetNodeId: 'logic_y', targetPortId: 'in1', state: false },
        { id: 'w10', sourceNodeId: 'ff2', sourcePortId: 'nq', targetNodeId: 'logic_y', targetPortId: 'in2', state: false },
        { id: 'w11', sourceNodeId: 'ff2', sourcePortId: 'q', targetNodeId: 'logic_r', targetPortId: 'in1', state: false },
        { id: 'w12', sourceNodeId: 'pow', sourcePortId: 'out', targetNodeId: 'logic_r', targetPortId: 'in2', state: true },
        { id: 'w13', sourceNodeId: 'logic_g', sourcePortId: 'out', targetNodeId: 'led_g', targetPortId: 'in', state: false },
        { id: 'w14', sourceNodeId: 'logic_y', sourcePortId: 'out', targetNodeId: 'led_y', targetPortId: 'in', state: false },
        { id: 'w15', sourceNodeId: 'logic_r', sourcePortId: 'out', targetNodeId: 'led_r', targetPortId: 'in', state: false }
      ]
    }
  },
  SR_LATCH: {
    name: "SR Latch (Memory)",
    description: "Basic storage cell using two NOR gates. Can Set (S) and Reset (R) a bit.",
    state: {
      scale: 1,
      offset: { x: 50, y: 50 },
      selectedId: null,
      nodes: [
        { id: 's', type: 'BUTTON', x: 60, y: 60, rotation: 0, data: { active: false }, label: 'SET' },
        { id: 'r', type: 'BUTTON', x: 60, y: 180, rotation: 0, data: { active: false }, label: 'RESET' },
        { id: 'nor1', type: 'NOR', x: 200, y: 40, rotation: 0, data: {}, label: 'NOR A' },
        { id: 'nor2', type: 'NOR', x: 200, y: 200, rotation: 0, data: {}, label: 'NOR B' },
        { id: 'q', type: 'LED', x: 350, y: 50, rotation: 0, data: { active: false }, label: 'Q' },
        { id: 'nq', type: 'LED', x: 350, y: 210, rotation: 0, data: { active: true }, label: 'Q\'' }
      ],
      wires: [
        { id: 'w1', sourceNodeId: 's', sourcePortId: 'out', targetNodeId: 'nor1', targetPortId: 'in1', state: false },
        { id: 'w2', sourceNodeId: 'r', sourcePortId: 'out', targetNodeId: 'nor2', targetPortId: 'in2', state: false },
        { id: 'w3', sourceNodeId: 'nor1', sourcePortId: 'out', targetNodeId: 'q', targetPortId: 'in', state: false },
        { id: 'w4', sourceNodeId: 'nor2', sourcePortId: 'out', targetNodeId: 'nq', targetPortId: 'in', state: true },
        // Feedback loops (cross-coupled)
        { id: 'w5', sourceNodeId: 'nor1', sourcePortId: 'out', targetNodeId: 'nor2', targetPortId: 'in1', state: false },
        { id: 'w6', sourceNodeId: 'nor2', sourcePortId: 'out', targetNodeId: 'nor1', targetPortId: 'in2', state: true }
      ]
    }
  }
};
