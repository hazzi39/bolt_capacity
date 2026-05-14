export interface BoltSpec {
  boltGrade: string;
  boltSize: string;
  phiVf: number;
  phiNtf: number;
  tensileArea: number;
  fuf: number;
  minimumPitch: number;
  minEdgeDistanceShear: number;
  minEdgeDistanceRolledPlate: number;
  minEdgeDistanceRolledSection: number;
  maxNutHeight: number;
  nutWidthAcrossFlats: number;
  nutWidthAcrossCorners: number;
  washerMaxInsideDiameter: number;
  washerMaxOutsideDiameter: number;
  washerMaxThickness: number;
  washerMinThickness: number;
}

export interface BoltDerivedMetrics {
  diameter: number;
  reductionFactor: number;
  shearFactor: number;
  nominalShearCapacity: number;
  nominalTensionCapacity: number;
  shearToTensionRatio: number;
}

export const BOLT_CAPACITY_REDUCTION_FACTOR = 0.8;
export const BOLT_SHEAR_FACTOR = 0.62;

export const boltData: BoltSpec[] = [
  {
    "boltGrade": "Grade 4.6",
    "boltSize": "M12",
    "phiVf": 16.7,
    "phiNtf": 27,
    "tensileArea": 84.3,
    "fuf": 400,
    "minimumPitch": 30,
    "minEdgeDistanceShear": 21,
    "minEdgeDistanceRolledPlate": 18,
    "minEdgeDistanceRolledSection": 15,
    "maxNutHeight": 13.1,
    "nutWidthAcrossFlats": 21,
    "nutWidthAcrossCorners": 24.25,
    "washerMaxInsideDiameter": 14.43,
    "washerMaxOutsideDiameter": 27,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 4.6",
    "boltSize": "M16",
    "phiVf": 31.1,
    "phiNtf": 50.1,
    "tensileArea": 156.7,
    "fuf": 400,
    "minimumPitch": 40,
    "minEdgeDistanceShear": 28,
    "minEdgeDistanceRolledPlate": 24,
    "minEdgeDistanceRolledSection": 20,
    "maxNutHeight": 17.1,
    "nutWidthAcrossFlats": 27,
    "nutWidthAcrossCorners": 31.2,
    "washerMaxInsideDiameter": 18.43,
    "washerMaxOutsideDiameter": 34,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 4.6",
    "boltSize": "M20",
    "phiVf": 48.6,
    "phiNtf": 78.3,
    "tensileArea": 244.8,
    "fuf": 400,
    "minimumPitch": 50,
    "minEdgeDistanceShear": 35,
    "minEdgeDistanceRolledPlate": 30,
    "minEdgeDistanceRolledSection": 25,
    "maxNutHeight": 21.3,
    "nutWidthAcrossFlats": 32,
    "nutWidthAcrossCorners": 36.9,
    "washerMaxInsideDiameter": 21.33,
    "washerMaxOutsideDiameter": 39,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 4.6",
    "boltSize": "M22",
    "phiVf": 60.2,
    "phiNtf": 97.1,
    "tensileArea": 303.4,
    "fuf": 400,
    "minimumPitch": 55,
    "minEdgeDistanceShear": 38.5,
    "minEdgeDistanceRolledPlate": 33,
    "minEdgeDistanceRolledSection": 27.5,
    "maxNutHeight": 23.6,
    "nutWidthAcrossFlats": 36,
    "nutWidthAcrossCorners": 41.6,
    "washerMaxInsideDiameter": 24.52,
    "washerMaxOutsideDiameter": 44,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 4.6",
    "boltSize": "M24",
    "phiVf": 69.9,
    "phiNtf": 112.8,
    "tensileArea": 352.5,
    "fuf": 400,
    "minimumPitch": 60,
    "minEdgeDistanceShear": 42,
    "minEdgeDistanceRolledPlate": 36,
    "minEdgeDistanceRolledSection": 30,
    "maxNutHeight": 24.2,
    "nutWidthAcrossFlats": 41,
    "nutWidthAcrossCorners": 47.3,
    "washerMaxInsideDiameter": 26.52,
    "washerMaxOutsideDiameter": 50,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 4.6",
    "boltSize": "M27",
    "phiVf": 91.1,
    "phiNtf": 147,
    "tensileArea": 459.4,
    "fuf": 400,
    "minimumPitch": 67.5,
    "minEdgeDistanceShear": 47.25,
    "minEdgeDistanceRolledPlate": 40.5,
    "minEdgeDistanceRolledSection": 33.75,
    "maxNutHeight": 27.6,
    "nutWidthAcrossFlats": 46,
    "nutWidthAcrossCorners": 53.1,
    "washerMaxInsideDiameter": 30.52,
    "washerMaxOutsideDiameter": 56,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 4.6",
    "boltSize": "M30",
    "phiVf": 111.2,
    "phiNtf": 179.4,
    "tensileArea": 560.6,
    "fuf": 400,
    "minimumPitch": 75,
    "minEdgeDistanceShear": 52.5,
    "minEdgeDistanceRolledPlate": 45,
    "minEdgeDistanceRolledSection": 37.5,
    "maxNutHeight": 30.7,
    "nutWidthAcrossFlats": 50,
    "nutWidthAcrossCorners": 57.7,
    "washerMaxInsideDiameter": 33.62,
    "washerMaxOutsideDiameter": 60,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 4.6",
    "boltSize": "M36",
    "phiVf": 162,
    "phiNtf": 261.4,
    "tensileArea": 816.7,
    "fuf": 400,
    "minimumPitch": 90,
    "minEdgeDistanceShear": 63,
    "minEdgeDistanceRolledPlate": 54,
    "minEdgeDistanceRolledSection": 45,
    "maxNutHeight": 36.6,
    "nutWidthAcrossFlats": 60,
    "nutWidthAcrossCorners": 59.3,
    "washerMaxInsideDiameter": 39.62,
    "washerMaxOutsideDiameter": 72,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 8.8",
    "boltSize": "M12",
    "phiVf": 34.7,
    "phiNtf": 56,
    "tensileArea": 84.3,
    "fuf": 830,
    "minimumPitch": 30,
    "minEdgeDistanceShear": 21,
    "minEdgeDistanceRolledPlate": 18,
    "minEdgeDistanceRolledSection": 15,
    "maxNutHeight": 13.1,
    "nutWidthAcrossFlats": 21,
    "nutWidthAcrossCorners": 24.25,
    "washerMaxInsideDiameter": 14.43,
    "washerMaxOutsideDiameter": 27,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 8.8",
    "boltSize": "M16",
    "phiVf": 64.5,
    "phiNtf": 104,
    "tensileArea": 156.7,
    "fuf": 830,
    "minimumPitch": 40,
    "minEdgeDistanceShear": 28,
    "minEdgeDistanceRolledPlate": 24,
    "minEdgeDistanceRolledSection": 20,
    "maxNutHeight": 17.1,
    "nutWidthAcrossFlats": 27,
    "nutWidthAcrossCorners": 31.2,
    "washerMaxInsideDiameter": 18.43,
    "washerMaxOutsideDiameter": 34,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 8.8",
    "boltSize": "M20",
    "phiVf": 100.8,
    "phiNtf": 162.5,
    "tensileArea": 244.8,
    "fuf": 830,
    "minimumPitch": 50,
    "minEdgeDistanceShear": 35,
    "minEdgeDistanceRolledPlate": 30,
    "minEdgeDistanceRolledSection": 25,
    "maxNutHeight": 21.3,
    "nutWidthAcrossFlats": 32,
    "nutWidthAcrossCorners": 36.9,
    "washerMaxInsideDiameter": 21.33,
    "washerMaxOutsideDiameter": 39,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 8.8",
    "boltSize": "M22",
    "phiVf": 124.9,
    "phiNtf": 201.5,
    "tensileArea": 303.4,
    "fuf": 830,
    "minimumPitch": 55,
    "minEdgeDistanceShear": 38.5,
    "minEdgeDistanceRolledPlate": 33,
    "minEdgeDistanceRolledSection": 27.5,
    "maxNutHeight": 23.6,
    "nutWidthAcrossFlats": 36,
    "nutWidthAcrossCorners": 41.6,
    "washerMaxInsideDiameter": 24.52,
    "washerMaxOutsideDiameter": 44,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 8.8",
    "boltSize": "M24",
    "phiVf": 145.1,
    "phiNtf": 234.1,
    "tensileArea": 352.5,
    "fuf": 830,
    "minimumPitch": 60,
    "minEdgeDistanceShear": 42,
    "minEdgeDistanceRolledPlate": 36,
    "minEdgeDistanceRolledSection": 30,
    "maxNutHeight": 24.2,
    "nutWidthAcrossFlats": 41,
    "nutWidthAcrossCorners": 47.3,
    "washerMaxInsideDiameter": 26.52,
    "washerMaxOutsideDiameter": 50,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 8.8",
    "boltSize": "M27",
    "phiVf": 189.1,
    "phiNtf": 305,
    "tensileArea": 459.4,
    "fuf": 830,
    "minimumPitch": 67.5,
    "minEdgeDistanceShear": 47.25,
    "minEdgeDistanceRolledPlate": 40.5,
    "minEdgeDistanceRolledSection": 33.75,
    "maxNutHeight": 27.6,
    "nutWidthAcrossFlats": 46,
    "nutWidthAcrossCorners": 53.1,
    "washerMaxInsideDiameter": 30.52,
    "washerMaxOutsideDiameter": 56,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 8.8",
    "boltSize": "M30",
    "phiVf": 230.8,
    "phiNtf": 372.2,
    "tensileArea": 560.6,
    "fuf": 830,
    "minimumPitch": 75,
    "minEdgeDistanceShear": 52.5,
    "minEdgeDistanceRolledPlate": 45,
    "minEdgeDistanceRolledSection": 37.5,
    "maxNutHeight": 30.7,
    "nutWidthAcrossFlats": 50,
    "nutWidthAcrossCorners": 57.7,
    "washerMaxInsideDiameter": 33.62,
    "washerMaxOutsideDiameter": 60,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 8.8",
    "boltSize": "M36",
    "phiVf": 336.2,
    "phiNtf": 542.3,
    "tensileArea": 816.7,
    "fuf": 830,
    "minimumPitch": 90,
    "minEdgeDistanceShear": 63,
    "minEdgeDistanceRolledPlate": 54,
    "minEdgeDistanceRolledSection": 45,
    "maxNutHeight": 36.6,
    "nutWidthAcrossFlats": 60,
    "nutWidthAcrossCorners": 59.3,
    "washerMaxInsideDiameter": 39.62,
    "washerMaxOutsideDiameter": 72,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 10.9",
    "boltSize": "M12",
    "phiVf": 43.1,
    "phiNtf": 69.4,
    "tensileArea": 84.3,
    "fuf": 1030,
    "minimumPitch": 30,
    "minEdgeDistanceShear": 21,
    "minEdgeDistanceRolledPlate": 18,
    "minEdgeDistanceRolledSection": 15,
    "maxNutHeight": 13.1,
    "nutWidthAcrossFlats": 21,
    "nutWidthAcrossCorners": 24.25,
    "washerMaxInsideDiameter": 14.43,
    "washerMaxOutsideDiameter": 27,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 10.9",
    "boltSize": "M16",
    "phiVf": 80,
    "phiNtf": 129.1,
    "tensileArea": 156.7,
    "fuf": 1030,
    "minimumPitch": 40,
    "minEdgeDistanceShear": 28,
    "minEdgeDistanceRolledPlate": 24,
    "minEdgeDistanceRolledSection": 20,
    "maxNutHeight": 17.1,
    "nutWidthAcrossFlats": 27,
    "nutWidthAcrossCorners": 31.2,
    "washerMaxInsideDiameter": 18.43,
    "washerMaxOutsideDiameter": 34,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 10.9",
    "boltSize": "M20",
    "phiVf": 125.1,
    "phiNtf": 201.7,
    "tensileArea": 244.8,
    "fuf": 1030,
    "minimumPitch": 50,
    "minEdgeDistanceShear": 35,
    "minEdgeDistanceRolledPlate": 30,
    "minEdgeDistanceRolledSection": 25,
    "maxNutHeight": 21.3,
    "nutWidthAcrossFlats": 32,
    "nutWidthAcrossCorners": 36.9,
    "washerMaxInsideDiameter": 21.33,
    "washerMaxOutsideDiameter": 39,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.1
  },
  {
    "boltGrade": "Grade 10.9",
    "boltSize": "M22",
    "phiVf": 155,
    "phiNtf": 250,
    "tensileArea": 303.4,
    "fuf": 1030,
    "minimumPitch": 55,
    "minEdgeDistanceShear": 38.5,
    "minEdgeDistanceRolledPlate": 33,
    "minEdgeDistanceRolledSection": 27.5,
    "maxNutHeight": 23.6,
    "nutWidthAcrossFlats": 36,
    "nutWidthAcrossCorners": 41.6,
    "washerMaxInsideDiameter": 24.52,
    "washerMaxOutsideDiameter": 44,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 10.9",
    "boltSize": "M24",
    "phiVf": 180.1,
    "phiNtf": 290.5,
    "tensileArea": 352.5,
    "fuf": 1030,
    "minimumPitch": 60,
    "minEdgeDistanceShear": 42,
    "minEdgeDistanceRolledPlate": 36,
    "minEdgeDistanceRolledSection": 30,
    "maxNutHeight": 24.2,
    "nutWidthAcrossFlats": 41,
    "nutWidthAcrossCorners": 47.3,
    "washerMaxInsideDiameter": 26.52,
    "washerMaxOutsideDiameter": 50,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 10.9",
    "boltSize": "M27",
    "phiVf": 234.7,
    "phiNtf": 378.6,
    "tensileArea": 459.4,
    "fuf": 1030,
    "minimumPitch": 67.5,
    "minEdgeDistanceShear": 47.25,
    "minEdgeDistanceRolledPlate": 40.5,
    "minEdgeDistanceRolledSection": 33.75,
    "maxNutHeight": 27.6,
    "nutWidthAcrossFlats": 46,
    "nutWidthAcrossCorners": 53.1,
    "washerMaxInsideDiameter": 30.52,
    "washerMaxOutsideDiameter": 56,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 10.9",
    "boltSize": "M30",
    "phiVf": 286.4,
    "phiNtf": 461.9,
    "tensileArea": 560.6,
    "fuf": 1030,
    "minimumPitch": 75,
    "minEdgeDistanceShear": 52.5,
    "minEdgeDistanceRolledPlate": 45,
    "minEdgeDistanceRolledSection": 37.5,
    "maxNutHeight": 30.7,
    "nutWidthAcrossFlats": 50,
    "nutWidthAcrossCorners": 57.7,
    "washerMaxInsideDiameter": 33.62,
    "washerMaxOutsideDiameter": 60,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  },
  {
    "boltGrade": "Grade 10.9",
    "boltSize": "M36",
    "phiVf": 417.2,
    "phiNtf": 673,
    "tensileArea": 816.7,
    "fuf": 1030,
    "minimumPitch": 90,
    "minEdgeDistanceShear": 63,
    "minEdgeDistanceRolledPlate": 54,
    "minEdgeDistanceRolledSection": 45,
    "maxNutHeight": 36.6,
    "nutWidthAcrossFlats": 60,
    "nutWidthAcrossCorners": 59.3,
    "washerMaxInsideDiameter": 39.62,
    "washerMaxOutsideDiameter": 72,
    "washerMaxThickness": 4.6,
    "washerMinThickness": 3.4
  }
];

export const getBoltGrades = (): string[] => {
  return Array.from(new Set(boltData.map(bolt => bolt.boltGrade)));
};

export const getBoltSizes = (grade: string): string[] => {
  return boltData
    .filter(bolt => bolt.boltGrade === grade)
    .map(bolt => bolt.boltSize);
};

export const getBoltSpec = (grade: string, size: string): BoltSpec | undefined => {
  return boltData.find(bolt => bolt.boltGrade === grade && bolt.boltSize === size);
};

export const parseBoltDiameter = (boltSize: string): number => {
  const match = boltSize.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export const getBoltDerivedMetrics = (bolt: BoltSpec): BoltDerivedMetrics => {
  const nominalTensionCapacity = bolt.phiNtf / BOLT_CAPACITY_REDUCTION_FACTOR;
  const nominalShearCapacity = bolt.phiVf / BOLT_CAPACITY_REDUCTION_FACTOR;

  return {
    diameter: parseBoltDiameter(bolt.boltSize),
    reductionFactor: BOLT_CAPACITY_REDUCTION_FACTOR,
    shearFactor: BOLT_SHEAR_FACTOR,
    nominalShearCapacity,
    nominalTensionCapacity,
    shearToTensionRatio: nominalTensionCapacity === 0 ? 0 : nominalShearCapacity / nominalTensionCapacity,
  };
};
