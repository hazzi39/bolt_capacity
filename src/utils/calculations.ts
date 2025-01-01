// Constants from AS/NZS 5100.6:2017
export const BOLT_PROPERTIES = {
  '4.6': {
    fuf: 400, // MPa
  },
  '8.8': {
    fuf: 830, // MPa
  },
};

export const PHI = 0.8; // Capacity reduction factor (Table 3.2)

// Helper function to calculate areas based on nominal diameter
export function calculateAreas(diameter: number) {
  const Ac = Math.PI * Math.pow(diameter - 1, 2) / 4; // Minor diameter area (threaded portion)
  const Ao = Math.PI * Math.pow(diameter, 2) / 4; // Nominal plain shank area
  return { Ac, Ao };
}

// Calculate reduction factor kr based on connection length
export function calculateKr(length: number): number {
  if (length < 300) return 1.0;
  if (length > 1300) return 0.75;
  return 1.075 - length / 4000;
}

// Calculate bolt shear capacity according to AS/NZS 5100.6:2017
export function calculateBoltShearCapacity(
  grade: string,
  diameter: number,
  threadedLength: number,
  threadedShearPlanes: number,
  unthreadedShearPlanes: number
): number {
  const { fuf } = BOLT_PROPERTIES[grade as keyof typeof BOLT_PROPERTIES];
  const { Ac, Ao } = calculateAreas(diameter);
  const kr = calculateKr(threadedLength);

  // Equation 12.5.3.1(2)
  const Vf = 0.62 * fuf * kr * (threadedShearPlanes * Ac + unthreadedShearPlanes * Ao);

  // Convert to kN from N
  return PHI * Vf / 1000;
}

// Calculate bolt tensile capacity according to AS/NZS 5100.6:2017
export function calculateBoltTensileCapacity(
  grade: string,
  diameter: number
): number {
  const { fuf } = BOLT_PROPERTIES[grade as keyof typeof BOLT_PROPERTIES];
  const { Ac } = calculateAreas(diameter);

  // Equation 12.5.3.2(2)
  const Ntf = Ac * fuf;

  // Convert to kN from N
  return PHI * Ntf / 1000;
}