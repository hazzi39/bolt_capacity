import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
  type FileChild,
} from 'docx';
import type { BoltDerivedMetrics, BoltSpec } from '../data/bolts';

export interface SavedResultRow {
  id: number;
  boltGrade: string;
  boltSize: string;
  phiVf: number;
  phiNtf: number;
  minimumPitch: number;
  minEdgeDistanceShear: number;
  timestamp: string;
}

interface MetadataRow {
  label: string;
  value: string;
}

interface KeyValueRow {
  parameter: string;
  value: string;
  units?: string;
}

interface ResultRow {
  check: string;
  value: string;
  status: 'PASS' | 'FAIL';
}

interface EquationRow {
  label: string;
  equation: string;
  description: string;
}

interface FigureData {
  caption: string;
  imageData: Uint8Array;
  width: number;
  height: number;
}

interface CalculationReportData {
  fileName: string;
  title: string;
  generatedAtDisplay: string;
  metadata: MetadataRow[];
  designSummary: string;
  inputs: KeyValueRow[];
  results: KeyValueRow[];
  passFailChecks: ResultRow[];
  equations: EquationRow[];
  intermediateCalculations: string[];
  methodology: string[];
  assumptions: string[];
  disclaimer: string;
  savedResults: SavedResultRow[];
}

interface BuildCalculationReportDataOptions {
  boltSpec: BoltSpec;
  derivedMetrics: BoltDerivedMetrics;
  savedResults: SavedResultRow[];
}

const REPORT_ACCENT = '1570EF';
const REPORT_BORDER = '9DB3C1';
const REPORT_HEADER_FILL = 'E9F1F8';
const REPORT_LIGHT_FILL = 'F7FAFC';
const REPORT_PASS_FILL = 'EAF7F1';
const REPORT_FAIL_FILL = 'FDECEC';

const createBorderSet = (color = REPORT_BORDER) => ({
  top: { style: BorderStyle.SINGLE, size: 1, color },
  right: { style: BorderStyle.SINGLE, size: 1, color },
  bottom: { style: BorderStyle.SINGLE, size: 1, color },
  left: { style: BorderStyle.SINGLE, size: 1, color },
});

const createSectionHeading = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 120 },
    children: [
      new TextRun({
        text,
        color: '1B2A38',
        bold: true,
      }),
    ],
  });

const createBodyParagraph = (text: string) =>
  new Paragraph({
    spacing: { after: 90, line: 276 },
    children: [
      new TextRun({
        text,
        size: 21,
        color: '304554',
      }),
    ],
  });

const createBulletParagraph = (text: string) =>
  new Paragraph({
    spacing: { after: 70, line: 260 },
    indent: { left: 240, hanging: 120 },
    children: [
      new TextRun({
        text: '• ',
        color: REPORT_ACCENT,
        bold: true,
      }),
      new TextRun({
        text,
        size: 21,
        color: '304554',
      }),
    ],
  });

const createTableCell = (
  text: string,
  options?: {
    bold?: boolean;
    shadingFill?: string;
    alignment?: keyof typeof AlignmentType;
    color?: string;
    width?: number;
  },
) =>
  new TableCell({
    width: options?.width ? { size: options.width, type: WidthType.DXA } : undefined,
    verticalAlign: AlignmentType.CENTER,
    shading: options?.shadingFill
      ? {
          type: ShadingType.CLEAR,
          fill: options.shadingFill,
          color: 'auto',
        }
      : undefined,
    borders: createBorderSet(),
    margins: {
      top: 90,
      bottom: 90,
      left: 100,
      right: 100,
    },
    children: [
      new Paragraph({
        alignment: options?.alignment ? AlignmentType[options.alignment] : AlignmentType.LEFT,
        spacing: { after: 0, before: 0 },
        children: [
          new TextRun({
            text,
            bold: options?.bold ?? false,
            color: options?.color ?? '223545',
            size: 20,
          }),
        ],
      }),
    ],
  });

const createKeyValueTable = (
  headers: string[],
  rows: string[][],
  columnWidths: number[],
  numericColumns: number[] = [],
) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    columnWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((header, index) =>
          createTableCell(header, {
            bold: true,
            shadingFill: REPORT_HEADER_FILL,
            alignment: numericColumns.includes(index) ? 'CENTER' : 'LEFT',
          }),
        ),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map((value, index) =>
              createTableCell(value, {
                shadingFill: REPORT_LIGHT_FILL,
                alignment: numericColumns.includes(index) ? 'CENTER' : 'LEFT',
              }),
            ),
          }),
      ),
    ],
  });

const createResultStatusTable = (rows: ResultRow[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    columnWidths: [6200, 2200, 2200],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          createTableCell('Check', { bold: true, shadingFill: REPORT_HEADER_FILL }),
          createTableCell('Value', { bold: true, shadingFill: REPORT_HEADER_FILL, alignment: 'CENTER' }),
          createTableCell('Status', { bold: true, shadingFill: REPORT_HEADER_FILL, alignment: 'CENTER' }),
        ],
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: [
              createTableCell(row.check, { shadingFill: REPORT_LIGHT_FILL }),
              createTableCell(row.value, { shadingFill: REPORT_LIGHT_FILL, alignment: 'CENTER' }),
              createTableCell(row.status, {
                shadingFill: row.status === 'PASS' ? REPORT_PASS_FILL : REPORT_FAIL_FILL,
                alignment: 'CENTER',
                bold: true,
                color: row.status === 'PASS' ? '1D7A46' : 'C33434',
              }),
            ],
          }),
      ),
    ],
  });

const createSavedResultsTable = (rows: SavedResultRow[]) =>
  createKeyValueTable(
    ['Timestamp', 'Grade', 'Size', 'ϕVf (kN)', 'ϕNtf (kN)', 'Pitch (mm)', 'Edge Distance (mm)'],
    rows.map((row) => [
      row.timestamp,
      row.boltGrade,
      row.boltSize,
      row.phiVf.toFixed(1),
      row.phiNtf.toFixed(1),
      row.minimumPitch.toFixed(1),
      row.minEdgeDistanceShear.toFixed(1),
    ]),
    [2600, 1600, 1000, 1300, 1300, 1200, 1400],
    [2, 3, 4, 5, 6],
  );

const formatDateForFileName = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `bolt-capacity-suite_${year}-${month}-${day}_${hours}${minutes}.docx`;
};

const dataUrlToUint8Array = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  return new Uint8Array(await response.arrayBuffer());
};

const loadImage = async (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load generated visualisation image.'));
    image.src = source;
  });

const inlineSvgStyles = (sourceElement: SVGElement, targetElement: SVGElement) => {
  const sourceNodes = [sourceElement, ...Array.from(sourceElement.querySelectorAll('*'))];
  const targetNodes = [targetElement, ...Array.from(targetElement.querySelectorAll('*'))];
  const styleProperties = [
    'fill',
    'stroke',
    'stroke-width',
    'stroke-dasharray',
    'stroke-linecap',
    'stroke-linejoin',
    'opacity',
    'font-family',
    'font-size',
    'font-weight',
    'letter-spacing',
    'text-anchor',
    'dominant-baseline',
    'paint-order',
    'stop-color',
    'stop-opacity',
  ];

  sourceNodes.forEach((sourceNode, index) => {
    const targetNode = targetNodes[index];

    if (!(sourceNode instanceof Element) || !(targetNode instanceof Element)) {
      return;
    }

    const computedStyle = window.getComputedStyle(sourceNode);
    const inlineStyle = styleProperties
      .map((property) => `${property}:${computedStyle.getPropertyValue(property)};`)
      .join('');

    targetNode.setAttribute('style', inlineStyle);
  });
};

export const extractSvgAsPng = async (svgElement: SVGSVGElement, scale = 2) => {
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  inlineSvgStyles(svgElement, clonedSvg);

  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  const bounds = svgElement.getBoundingClientRect();
  const viewBox = svgElement.viewBox.baseVal;
  const width = Math.max(bounds.width || 0, viewBox?.width || 520);
  const height = Math.max(bounds.height || 0, viewBox?.height || 360);

  clonedSvg.setAttribute('width', `${width}`);
  clonedSvg.setAttribute('height', `${height}`);

  const serializedSvg = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(objectUrl);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to create a canvas context for SVG export.');
    }

    context.scale(scale, scale);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    return {
      imageData: await dataUrlToUint8Array(canvas.toDataURL('image/png')),
      width: Math.round(width),
      height: Math.round(height),
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const extractCanvasAsPng = async (canvasElement: HTMLCanvasElement, scale = 2) => {
  const width = canvasElement.width || Math.round(canvasElement.getBoundingClientRect().width) || 520;
  const height = canvasElement.height || Math.round(canvasElement.getBoundingClientRect().height) || 360;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = Math.round(width * scale);
  exportCanvas.height = Math.round(height * scale);

  const context = exportCanvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to create a canvas context for chart export.');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  context.scale(scale, scale);
  context.drawImage(canvasElement, 0, 0, width, height);

  return {
    imageData: await dataUrlToUint8Array(exportCanvas.toDataURL('image/png')),
    width,
    height,
  };
};

export const addImageToDoc = (
  imageData: Uint8Array,
  caption: string,
  width: number,
  height: number,
): Paragraph[] => {
  const maxWidth = 520;
  const scaledWidth = Math.min(width, maxWidth);
  const scaledHeight = Math.round((height / width) * scaledWidth);

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 80 },
      children: [
        new ImageRun({
          data: imageData,
          transformation: {
            width: scaledWidth,
            height: scaledHeight,
          },
          type: 'png',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: caption,
          italics: true,
          color: '4D6373',
          size: 18,
        }),
      ],
    }),
  ];
};

export const buildCalculationReportData = ({
  boltSpec,
  derivedMetrics,
  savedResults,
}: BuildCalculationReportDataOptions): CalculationReportData => {
  const generatedAt = new Date();
  const nominalShear = derivedMetrics.nominalShearCapacity;
  const nominalTension = derivedMetrics.nominalTensionCapacity;
  const fileName = formatDateForFileName(generatedAt);
  const generatedAtDisplay = generatedAt.toLocaleString('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return {
    fileName,
    title: 'Bolt Capacity Engineering Calculation Sheet',
    generatedAtDisplay,
    metadata: [
      { label: 'Company', value: 'Not specified' },
      { label: 'Project', value: 'Bolt selection verification' },
      { label: 'Report type', value: 'Structural engineering calculation sheet' },
      { label: 'Tool', value: 'Bolt Capacity Suite' },
      { label: 'Selected bolt', value: `${boltSpec.boltGrade} / ${boltSpec.boltSize}` },
      { label: 'Generated', value: generatedAtDisplay },
    ],
    designSummary: `This report summarises the selected structural bolt catalogue entry, including reduced shear capacity, reduced tension capacity, detailing minima, and the exported bolt visualisation for issue or review purposes.`,
    inputs: [
      { parameter: 'Bolt grade', value: boltSpec.boltGrade },
      { parameter: 'Bolt size', value: boltSpec.boltSize },
      { parameter: 'Nominal diameter', value: derivedMetrics.diameter.toFixed(0), units: 'mm' },
      { parameter: 'Ultimate tensile strength, fuf', value: boltSpec.fuf.toFixed(0), units: 'MPa' },
      { parameter: 'Tensile area, At', value: boltSpec.tensileArea.toFixed(1), units: 'mm²' },
      { parameter: 'Minimum pitch', value: boltSpec.minimumPitch.toFixed(1), units: 'mm' },
      { parameter: 'Minimum edge distance', value: boltSpec.minEdgeDistanceShear.toFixed(1), units: 'mm' },
      { parameter: 'Washer outside diameter', value: boltSpec.washerMaxOutsideDiameter.toFixed(1), units: 'mm' },
    ],
    results: [
      { parameter: 'Reduced shear capacity, ϕVf', value: boltSpec.phiVf.toFixed(1), units: 'kN' },
      { parameter: 'Reduced tension capacity, ϕNtf', value: boltSpec.phiNtf.toFixed(1), units: 'kN' },
      { parameter: 'Nominal shear capacity, Vf', value: nominalShear.toFixed(1), units: 'kN' },
      { parameter: 'Nominal tension capacity, Ntf', value: nominalTension.toFixed(1), units: 'kN' },
      { parameter: 'Reduction factor, ϕ', value: derivedMetrics.reductionFactor.toFixed(2) },
      { parameter: 'Shear factor', value: derivedMetrics.shearFactor.toFixed(2) },
      { parameter: 'Shear/tension ratio', value: derivedMetrics.shearToTensionRatio.toFixed(2) },
    ],
    passFailChecks: [
      { check: 'Selected catalogue row available', value: `${boltSpec.boltGrade} / ${boltSpec.boltSize}`, status: 'PASS' },
      { check: 'Reduced design capacities populated', value: `${boltSpec.phiVf.toFixed(1)} kN / ${boltSpec.phiNtf.toFixed(1)} kN`, status: 'PASS' },
      { check: 'Minimum pitch and edge distance available', value: `${boltSpec.minimumPitch.toFixed(1)} mm / ${boltSpec.minEdgeDistanceShear.toFixed(1)} mm`, status: 'PASS' },
    ],
    equations: [
      {
        label: 'Reduced shear capacity',
        equation: 'ϕVf = ϕ × 0.62 × fuf × At × 10^-3',
        description: 'Reduced single-bolt shear capacity implied by the catalogue dataset.',
      },
      {
        label: 'Reduced tension capacity',
        equation: 'ϕNtf = ϕ × fuf × At × 10^-3',
        description: 'Reduced single-bolt tension capacity implied by the catalogue dataset.',
      },
      {
        label: 'Capacity relationship',
        equation: 'ϕVf ≤ ϕNtf',
        description: 'For the selected entry, the reduced shear capacity is lower than the reduced tension capacity.',
      },
    ],
    intermediateCalculations: [
      `Nominal tension capacity: Ntf = fuf × At × 10^-3 = ${boltSpec.fuf.toFixed(0)} × ${boltSpec.tensileArea.toFixed(1)} × 10^-3 = ${nominalTension.toFixed(1)} kN`,
      `Reduced tension capacity: ϕNtf = ϕ × Ntf = ${derivedMetrics.reductionFactor.toFixed(2)} × ${nominalTension.toFixed(1)} = ${boltSpec.phiNtf.toFixed(1)} kN`,
      `Nominal shear capacity: Vf = 0.62 × fuf × At × 10^-3 = 0.62 × ${boltSpec.fuf.toFixed(0)} × ${boltSpec.tensileArea.toFixed(1)} × 10^-3 = ${nominalShear.toFixed(1)} kN`,
      `Reduced shear capacity: ϕVf = ϕ × Vf = ${derivedMetrics.reductionFactor.toFixed(2)} × ${nominalShear.toFixed(1)} = ${boltSpec.phiVf.toFixed(1)} kN`,
      `Detailing minima carried into the report image: minimum pitch = ${boltSpec.minimumPitch.toFixed(1)} mm, minimum edge distance = ${boltSpec.minEdgeDistanceShear.toFixed(1)} mm, washer diameter = ${boltSpec.washerMaxOutsideDiameter.toFixed(1)} mm`,
    ],
    methodology: [
      'Select the bolt grade and bolt size from the application catalogue.',
      'Read the stored tensile area, ultimate tensile strength, and detailing dimensions from the current catalogue row.',
      'Calculate nominal tension and nominal shear capacities from the selected row using the equations listed in this report.',
      'Apply the reduction factor ϕ = 0.80 to produce the reduced design capacities displayed in the application and exported here.',
      'Export the live engineering visualisation as a high-resolution image and embed it in the Word document for issue, print, or PDF conversion.',
    ],
    assumptions: [
      'The repository catalogue values are treated as the governing source data for this report.',
      'The selected bolt entry is assumed to be valid for the intended structural design standard and connection configuration.',
      'No connection demand loads are entered in the current tool, so adequacy against applied design actions is outside this exported report scope.',
      'The visualisation is a detailing aid derived from the selected catalogue dimensions and is not a full fabrication drawing.',
    ],
    disclaimer:
      'This exported calculation sheet is a software-generated engineering summary and must be reviewed by a qualified engineer before issue for construction, procurement, or final design certification.',
    savedResults,
  };
};

export const createMetadataSection = (reportData: CalculationReportData): FileChild[] => [
  new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: reportData.title,
        bold: true,
        color: '19344A',
        size: 30,
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 180 },
    children: [
      new TextRun({
        text: 'Professional engineering calculation sheet export',
        color: REPORT_ACCENT,
        size: 22,
      }),
    ],
  }),
  createKeyValueTable(
    ['Metadata', 'Value'],
    reportData.metadata.map((row) => [row.label, row.value]),
    [2600, 7000],
  ),
  createSectionHeading('Design Summary'),
  createBodyParagraph(reportData.designSummary),
];

export const createInputsTable = (reportData: CalculationReportData) =>
  createKeyValueTable(
    ['Input', 'Value', 'Units'],
    reportData.inputs.map((row) => [row.parameter, row.value, row.units ?? '—']),
    [5200, 2600, 1800],
    [1, 2],
  );

export const createResultsTable = (reportData: CalculationReportData) =>
  createKeyValueTable(
    ['Result', 'Value', 'Units'],
    reportData.results.map((row) => [row.parameter, row.value, row.units ?? '—']),
    [5200, 2600, 1800],
    [1, 2],
  );

export const createEquationParagraph = (label: string, equation: string, note?: string) =>
  new Paragraph({
    spacing: { after: 90, line: 276 },
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        color: '1B2A38',
      }),
      new TextRun({
        text: equation,
        color: REPORT_ACCENT,
      }),
      ...(note
        ? [
            new TextRun({
              text: ` — ${note}`,
              color: '4D6373',
            }),
          ]
        : []),
    ],
  });

export const createCalculationSection = (reportData: CalculationReportData): FileChild[] => {
  const children: FileChild[] = [
    createSectionHeading('Methodology'),
    ...reportData.methodology.map((line) => createBulletParagraph(line)),
    createSectionHeading('Governing Equations'),
    ...reportData.equations.map((equation) =>
      createEquationParagraph(equation.label, equation.equation, equation.description),
    ),
    createSectionHeading('Intermediate Calculations'),
    ...reportData.intermediateCalculations.map((line) => createBodyParagraph(line)),
  ];

  if (reportData.savedResults.length > 0) {
    children.push(createSectionHeading('Saved Results History'));
    children.push(createSavedResultsTable(reportData.savedResults));
  }

  return children;
};

const buildFigureCaption = (element: Element, index: number) => {
  const source = element.getAttribute('aria-label') || element.getAttribute('data-report-caption');
  const readable = source ? source.charAt(0).toUpperCase() + source.slice(1) : 'Engineering visualisation';
  return `Figure ${index} – ${readable}`;
};

export const createVisualisationSection = async (): Promise<FileChild[]> => {
  const figureElements = Array.from(
    document.querySelectorAll<SVGSVGElement | HTMLCanvasElement>(
      '.visualisation-card svg, .visualisation-card canvas, .saved-results-card canvas, .saved-results-card svg',
    ),
  );

  const figures: FigureData[] = [];

  for (const [index, element] of figureElements.entries()) {
    if (element instanceof SVGSVGElement) {
      const exported = await extractSvgAsPng(element, 3);
      figures.push({
        caption: buildFigureCaption(element, index + 1),
        imageData: exported.imageData,
        width: exported.width,
        height: exported.height,
      });
    } else if (element instanceof HTMLCanvasElement) {
      const exported = await extractCanvasAsPng(element, 3);
      figures.push({
        caption: buildFigureCaption(element, index + 1),
        imageData: exported.imageData,
        width: exported.width,
        height: exported.height,
      });
    }
  }

  const children: FileChild[] = [createSectionHeading('Visualisation Section')];

  if (figures.length === 0) {
    children.push(createBodyParagraph('No visualisation elements were available at export time.'));
    return children;
  }

  children.push(
    createBodyParagraph(
      'The following figures were captured directly from the live engineering visualisation layer and embedded as high-resolution PNG images.',
    ),
  );

  figures.forEach((figure) => {
    children.push(...addImageToDoc(figure.imageData, figure.caption, figure.width, figure.height));
  });

  return children;
};

export const createAssumptionsSection = (reportData: CalculationReportData): FileChild[] => [
  createSectionHeading('Assumptions'),
  ...reportData.assumptions.map((line) => createBulletParagraph(line)),
  createSectionHeading('Disclaimer'),
  createBodyParagraph(reportData.disclaimer),
];

export const exportWordReport = async (reportData: CalculationReportData) => {
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'Page ', color: '4D6373', size: 18 }),
          new TextRun({ children: [PageNumber.CURRENT], color: '4D6373', size: 18 }),
          new TextRun({ text: ' of ', color: '4D6373', size: 18 }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: '4D6373', size: 18 }),
        ],
      }),
    ],
  });

  const visualisationChildren = await createVisualisationSection();

  const wordDocument = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
            },
            margin: {
              top: 720,
              right: 720,
              bottom: 900,
              left: 720,
              header: 450,
              footer: 450,
            },
          },
        },
        footers: { default: footer },
        children: [
          ...createMetadataSection(reportData),
          createSectionHeading('Key Results'),
          createResultsTable(reportData),
          createSectionHeading('PASS / FAIL Checks'),
          createResultStatusTable(reportData.passFailChecks),
          new Paragraph({ children: [new PageBreak()] }),
          createSectionHeading('Inputs'),
          createInputsTable(reportData),
          ...createCalculationSection(reportData),
          new Paragraph({ children: [new PageBreak()] }),
          ...visualisationChildren,
          new Paragraph({ children: [new PageBreak()] }),
          ...createAssumptionsSection(reportData),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(wordDocument);
  const downloadUrl = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = downloadUrl;
  link.download = reportData.fileName;
  link.click();
  URL.revokeObjectURL(downloadUrl);
};
