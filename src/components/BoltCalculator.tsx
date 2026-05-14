import { startTransition, useDeferredValue, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { BookmarkPlus, FileDown, Gauge, Ruler, ShieldCheck } from 'lucide-react';
import {
  getBoltDerivedMetrics,
  getBoltGrades,
  getBoltSizes,
  getBoltSpec,
  type BoltDerivedMetrics,
  type BoltSpec,
} from '../data/bolts';
import type { SavedResultRow } from '../utils/reportExport';

interface ValidationState {
  grade?: string;
  size?: string;
}

interface EquationBlockProps {
  label: string;
  latex: string;
  caption: string;
}

interface MetricCardProps {
  eyebrow: string;
  value: string;
  unit: string;
  tone: 'primary' | 'secondary';
}

interface DetailRowProps {
  label: string;
  value: string;
}

interface VisualizationProps {
  boltSpec?: BoltSpec;
  metrics?: BoltDerivedMetrics;
}

const emptyStateNote = 'Select a bolt grade and size from the project dataset to inspect capacities and detailing guidance.';

const renderLatex = (expression: string) =>
  katex.renderToString(expression, {
    displayMode: true,
    throwOnError: false,
    strict: 'ignore',
  });

const formatNumber = (value: number, digits = 1): string =>
  new Intl.NumberFormat('en-AU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);

const EquationBlock = ({ label, latex, caption }: EquationBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`equation-block ${isOpen ? 'equation-block--open' : ''}`}>
      <button
        type="button"
        className="equation-toggle"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
      >
        <span className="equation-label">{label}</span>
        <span className="equation-toggle-icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen ? (
        <>
          <div
            className="equation-formula"
            dangerouslySetInnerHTML={{ __html: renderLatex(latex) }}
          />
          <p className="equation-caption">{caption}</p>
        </>
      ) : (
        <p className="equation-collapsed-note">Expand to view the full engineering equation.</p>
      )}
    </div>
  );
};

const MetricCard = ({ eyebrow, value, unit, tone }: MetricCardProps) => (
  <article className={`metric-card metric-card--${tone}`}>
    <span className="metric-eyebrow">{eyebrow}</span>
    <div className="metric-value-row">
      <strong className="metric-value">{value}</strong>
      <span className="metric-unit">{unit}</span>
    </div>
  </article>
);

const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className="detail-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const BoltVisualisation = ({ boltSpec, metrics }: VisualizationProps) => {
  const diameter = metrics?.diameter ?? 24;
  const washerRadius = boltSpec ? Math.min(54, boltSpec.washerMaxOutsideDiameter * 0.9) : 44;
  const holeRadius = Math.max(10, diameter * 0.9);
  const edgeDistance = boltSpec ? Math.min(120, boltSpec.minEdgeDistanceShear * 2.2) : 88;
  const pitchDistance = boltSpec ? Math.min(180, boltSpec.minimumPitch * 2.15) : 128;
  const shearArrow = boltSpec ? 28 + Math.min(80, boltSpec.phiVf / 4.5) : 48;
  const tensionArrow = boltSpec ? 28 + Math.min(86, boltSpec.phiNtf / 6.5) : 60;
  const plateStartX = 78;
  const boltCenterX = plateStartX + edgeDistance;
  const boltCenterY = 193;
  const pitchLabelX = Math.max(170, boltCenterX + pitchDistance * 0.22);
  const edgeLabelY = 336;
  const washerLabelX = boltCenterX + washerRadius + 44;
  const washerLabelY = boltCenterY + 6;

  return (
    <svg
      className="visualisation-svg"
      viewBox="0 0 520 360"
      role="img"
      aria-label="Bolt detailing diagram with edge distance, pitch, washer diameter, and capacity directions."
    >
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(109, 140, 161, 0.16)" strokeWidth="1" />
        </pattern>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#1570ef" />
        </marker>
        <marker id="arrow-soft" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#2f8f83" />
        </marker>
      </defs>

      <rect x="0" y="0" width="520" height="360" fill="url(#grid)" rx="24" />
      <rect x="58" y="86" width="404" height="214" rx="26" fill="rgba(255,255,255,0.72)" stroke="rgba(112, 140, 157, 0.22)" />
      <rect x="78" y="106" width="364" height="174" rx="20" fill="rgba(228, 239, 244, 0.62)" stroke="rgba(112, 140, 157, 0.2)" />

      <line x1={boltCenterX - 6} y1={boltCenterY} x2="350" y2={boltCenterY} stroke="rgba(47, 143, 131, 0.18)" strokeWidth="1.5" strokeDasharray="6 6" />
      <line x1={boltCenterX} y1="118" x2={boltCenterX} y2="268" stroke="rgba(47, 143, 131, 0.18)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={boltCenterX + 32} y="130" className="svg-axis-label">y-y</text>
      <text x={boltCenterX + pitchDistance * 0.48} y="186" className="svg-axis-label">x-x</text>

      <circle cx={boltCenterX} cy={boltCenterY} r={washerRadius} fill="rgba(21, 112, 239, 0.08)" stroke="#1570ef" strokeWidth="2.5" />
      <circle cx={boltCenterX} cy={boltCenterY} r={holeRadius} fill="#f5f7f6" stroke="#0f5bd3" strokeWidth="2.5" />

      <polygon
        points={`${boltCenterX - washerRadius * 0.7},${boltCenterY} ${boltCenterX - washerRadius * 0.35},${boltCenterY - washerRadius * 0.62} ${boltCenterX + washerRadius * 0.35},${boltCenterY - washerRadius * 0.62} ${boltCenterX + washerRadius * 0.7},${boltCenterY} ${boltCenterX + washerRadius * 0.35},${boltCenterY + washerRadius * 0.62} ${boltCenterX - washerRadius * 0.35},${boltCenterY + washerRadius * 0.62}`}
        fill="rgba(47, 143, 131, 0.1)"
        stroke="#2f8f83"
        strokeWidth="2"
      />

      <circle cx={boltCenterX + pitchDistance} cy={boltCenterY} r={holeRadius} fill="transparent" stroke="rgba(15, 91, 211, 0.4)" strokeWidth="2" strokeDasharray="8 8" />

      <line x1={plateStartX} y1="308" x2={boltCenterX} y2="308" stroke="#1570ef" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
      <line x1={boltCenterX} y1="58" x2={boltCenterX + pitchDistance} y2="58" stroke="#1570ef" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
      <line x1={boltCenterX + washerRadius + 30} y1={boltCenterY - washerRadius} x2={boltCenterX + washerRadius + 30} y2={boltCenterY + washerRadius} stroke="#2f8f83" strokeWidth="2" markerStart="url(#arrow-soft)" markerEnd="url(#arrow-soft)" />

      <line x1={boltCenterX - washerRadius} y1={boltCenterY} x2={boltCenterX - washerRadius - shearArrow} y2={boltCenterY} stroke="#1570ef" strokeWidth="3" markerEnd="url(#arrow)" />
      <line x1={boltCenterX} y1={boltCenterY - washerRadius + 8} x2={boltCenterX} y2={boltCenterY - washerRadius + 8 - tensionArrow} stroke="#2f8f83" strokeWidth="3" markerEnd="url(#arrow-soft)" />

      <text x="96" y={edgeLabelY} className="svg-dimension-text">Minimum edge distance = {formatNumber(boltSpec?.minEdgeDistanceShear ?? 0)} mm</text>
      <text x={pitchLabelX} y="48" className="svg-dimension-text">Minimum pitch = {formatNumber(boltSpec?.minimumPitch ?? 0)} mm</text>
      <text x={washerLabelX} y={washerLabelY} className="svg-dimension-text">Washer diameter = {formatNumber(boltSpec?.washerMaxOutsideDiameter ?? 0)} mm</text>
      <text x="48" y="186" className="svg-force-text">φVᶠ</text>
      <text x={boltCenterX - 14} y="54" className="svg-force-text svg-force-text--teal">φNₜᶠ</text>

      <text x="82" y="96" className="svg-note-heading">Plate face</text>
      {boltSpec ? (
        <>
          <text x="300" y="260" className="svg-badge">{boltSpec.boltGrade}</text>
          <text x="300" y="288" className="svg-badge svg-badge--secondary">{boltSpec.boltSize}</text>
        </>
      ) : (
        <text x="110" y="342" className="svg-placeholder">Choose a bolt to activate the live detailing diagram</text>
      )}
    </svg>
  );
};

const BoltCalculator = () => {
  const [selectedGrade, setSelectedGrade] = useState('Grade 8.8');
  const [selectedSize, setSelectedSize] = useState('M20');
  const [savedResults, setSavedResults] = useState<SavedResultRow[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const boltGrades = getBoltGrades();
  const boltSizes = selectedGrade ? getBoltSizes(selectedGrade) : [];
  const validation: ValidationState = {};

  if (!selectedGrade) {
    validation.grade = 'Select a bolt grade from the project dataset.';
  }

  if (selectedGrade && !selectedSize) {
    validation.size = 'Select a bolt size available for the chosen grade.';
  }

  const selectedBolt = selectedGrade && selectedSize ? getBoltSpec(selectedGrade, selectedSize) : undefined;
  const deferredBolt = useDeferredValue(selectedBolt);
  const derivedMetrics = deferredBolt ? getBoltDerivedMetrics(deferredBolt) : undefined;
  const isValidSelection = Boolean(deferredBolt);

  const handleSaveResult = () => {
    if (!deferredBolt) {
      return;
    }

    const entry: SavedResultRow = {
      id: Date.now(),
      boltGrade: deferredBolt.boltGrade,
      boltSize: deferredBolt.boltSize,
      phiVf: deferredBolt.phiVf,
      phiNtf: deferredBolt.phiNtf,
      minimumPitch: deferredBolt.minimumPitch,
      minEdgeDistanceShear: deferredBolt.minEdgeDistanceShear,
      timestamp: new Date().toLocaleString('en-AU', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    startTransition(() => {
      setSavedResults((currentRows) => [entry, ...currentRows]);
    });
  };

  const handleExportReport = async () => {
    if (!deferredBolt || !derivedMetrics || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const reportModule = await import('../utils/reportExport');
      const reportData = reportModule.buildCalculationReportData({
        boltSpec: deferredBolt,
        derivedMetrics,
        savedResults,
      });

      await reportModule.exportWordReport(reportData);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="calculator-page">
      <header className="page-header">
        <div>
          <p className="page-kicker">Bolt Capacity Suite</p>
          <h1>Structural bolt capacities and detailing</h1>
        </div>
      </header>

      <section className="main-grid">
        <div className="left-column">
          <article className="card visualisation-card">
            <div className="card-heading">
              <div>
                <span className="section-tag">Live visualisation</span>
                <h2>Detailing diagram</h2>
              </div>
              <div className="status-chip">
                <Ruler size={16} />
                <span>{isValidSelection ? 'Diagram active' : 'Awaiting selection'}</span>
              </div>
            </div>
            <p className="card-intro">
              The diagram maps the selected bolt’s washer envelope, hole size reference, minimum pitch, and minimum edge distance for quick detailing checks.
            </p>
            <BoltVisualisation boltSpec={deferredBolt} metrics={derivedMetrics} />
          </article>

          <article className={`card result-card ${isValidSelection ? 'result-card--active' : 'result-card--disabled'}`}>
            <div className="card-heading">
              <div>
                <span className="section-tag">Result</span>
                <h2>Reduced design capacities</h2>
              </div>
              <div className="status-chip status-chip--blue">
                <Gauge size={16} />
                <span>φ = 0.80</span>
              </div>
            </div>

            {deferredBolt && derivedMetrics ? (
              <>
                <div className="metrics-grid">
                  <MetricCard
                    eyebrow="Shear capacity"
                    value={formatNumber(deferredBolt.phiVf)}
                    unit="kN"
                    tone="primary"
                  />
                  <MetricCard
                    eyebrow="Tension capacity"
                    value={formatNumber(deferredBolt.phiNtf)}
                    unit="kN"
                    tone="secondary"
                  />
                </div>

                <div className="support-grid">
                  <div className="support-block">
                    <span className="support-label">Nominal shear</span>
                    <strong>{formatNumber(derivedMetrics.nominalShearCapacity)} kN</strong>
                  </div>
                  <div className="support-block">
                    <span className="support-label">Nominal tension</span>
                    <strong>{formatNumber(derivedMetrics.nominalTensionCapacity)} kN</strong>
                  </div>
                  <div className="support-block">
                    <span className="support-label">fᵤf</span>
                    <strong>{formatNumber(deferredBolt.fuf, 0)} MPa</strong>
                  </div>
                  <div className="support-block">
                    <span className="support-label">Aₜ</span>
                    <strong>{formatNumber(deferredBolt.tensileArea)} mm²</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-result">
                <ShieldCheck size={20} />
                <p>{emptyStateNote}</p>
              </div>
            )}
          </article>
        </div>

        <div className="right-column">
          <article className="card input-card">
            <div className="card-heading">
              <div>
                <span className="section-tag">Inputs</span>
                <h2>Catalogue selection</h2>
              </div>
            </div>

            <div className="field-grid">
              <label className="field-group">
                <span className="field-label">Bolt grade</span>
                <div className={`field-shell ${validation.grade ? 'field-shell--error' : ''}`}>
                  <select
                    value={selectedGrade}
                    onChange={(event) => {
                      setSelectedGrade(event.target.value);
                      setSelectedSize('');
                    }}
                    aria-invalid={Boolean(validation.grade)}
                  >
                    <option value="">Select grade</option>
                    {boltGrades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  <span className="unit-chip">Class</span>
                </div>
                <span className="field-error">{validation.grade ?? ' '}</span>
              </label>

              <label className="field-group">
                <span className="field-label">Bolt size</span>
                <div className={`field-shell ${validation.size ? 'field-shell--error' : ''}`}>
                  <select
                    value={selectedSize}
                    onChange={(event) => setSelectedSize(event.target.value)}
                    disabled={!selectedGrade}
                    aria-invalid={Boolean(validation.size)}
                  >
                    <option value="">Select size</option>
                    {boltSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span className="unit-chip">mm</span>
                </div>
                <span className="field-error">{validation.size ?? ' '}</span>
              </label>
            </div>

            <div className="equation-panel">
              <EquationBlock
                label="Shear equation"
                latex={'\\phi V_f = \\phi \\times 0.62 \\times f_{uf} \\times A_t \\times 10^{-3}'}
                caption="Reduced shear capacity implied by the catalogue values."
              />
              <EquationBlock
                label="Tension equation"
                latex={'\\phi N_{tf} = \\phi \\times f_{uf} \\times A_t \\times 10^{-3}'}
                caption="Reduced tension capacity implied by the catalogue values."
              />
            </div>

            <div className="action-button-group">
              <button
                type="button"
                className="save-button"
                onClick={handleSaveResult}
                disabled={!isValidSelection}
              >
                <BookmarkPlus size={18} />
                <span>Save Result</span>
              </button>
              <button
                type="button"
                className="export-button"
                onClick={handleExportReport}
                disabled={!isValidSelection || isExporting}
              >
                <FileDown size={18} />
                <span>{isExporting ? 'Exporting Report...' : 'Export Word Report'}</span>
              </button>
            </div>
          </article>

          <article className="card properties-card">
            <div className="card-heading">
              <div>
                <span className="section-tag">Secondary properties</span>
                <h2>Detailing and hardware data</h2>
              </div>
            </div>

            {deferredBolt && derivedMetrics ? (
              <div className="properties-grid">
                <section className="property-panel">
                  <h3>Bolt geometry</h3>
                  <DetailRow label="Nominal diameter" value={`${formatNumber(derivedMetrics.diameter, 0)} mm`} />
                  <DetailRow label="Tensile area" value={`${formatNumber(deferredBolt.tensileArea)} mm²`} />
                  <DetailRow label="Minimum pitch" value={`${formatNumber(deferredBolt.minimumPitch)} mm`} />
                  <DetailRow label="Min edge distance" value={`${formatNumber(deferredBolt.minEdgeDistanceShear)} mm`} />
                </section>

                <section className="property-panel">
                  <h3>Nut dimensions</h3>
                  <DetailRow label="Max nut height" value={`${formatNumber(deferredBolt.maxNutHeight)} mm`} />
                  <DetailRow label="Across flats" value={`${formatNumber(deferredBolt.nutWidthAcrossFlats)} mm`} />
                  <DetailRow label="Across corners" value={`${formatNumber(deferredBolt.nutWidthAcrossCorners)} mm`} />
                  <DetailRow label="Rolled plate edge" value={`${formatNumber(deferredBolt.minEdgeDistanceRolledPlate)} mm`} />
                </section>

                <section className="property-panel">
                  <h3>Washer envelope</h3>
                  <DetailRow label="Max inside diameter" value={`${formatNumber(deferredBolt.washerMaxInsideDiameter)} mm`} />
                  <DetailRow label="Max outside diameter" value={`${formatNumber(deferredBolt.washerMaxOutsideDiameter)} mm`} />
                  <DetailRow label="Min thickness" value={`${formatNumber(deferredBolt.washerMinThickness)} mm`} />
                  <DetailRow label="Max thickness" value={`${formatNumber(deferredBolt.washerMaxThickness)} mm`} />
                </section>

                <section className="property-panel">
                  <h3>Derived checks</h3>
                  <DetailRow label="Shear factor" value={`${formatNumber(derivedMetrics.shearFactor, 2)}`} />
                  <DetailRow label="Reduction factor" value={`${formatNumber(derivedMetrics.reductionFactor, 2)}`} />
                  <DetailRow label="Vf / Ntf ratio" value={`${formatNumber(derivedMetrics.shearToTensionRatio, 2)}`} />
                  <DetailRow label="Rolled section edge" value={`${formatNumber(deferredBolt.minEdgeDistanceRolledSection)} mm`} />
                </section>
              </div>
            ) : (
              <div className="empty-properties">
                <p>Secondary hardware properties will appear after you select a bolt grade and size.</p>
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="card saved-results-card">
        <div className="card-heading">
          <div>
            <span className="section-tag">Saved results</span>
            <h2>Selection history</h2>
          </div>
        </div>
        <p className="card-intro">
          Save capacity checks to build a quick comparison log of the catalogue entries you have reviewed.
        </p>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Grade</th>
                <th>Size</th>
                <th>φVf</th>
                <th>φNtf</th>
                <th>Pitch</th>
                <th>Edge distance</th>
              </tr>
            </thead>
            <tbody>
              {savedResults.length > 0 ? (
                savedResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.timestamp}</td>
                    <td>{result.boltGrade}</td>
                    <td>{result.boltSize}</td>
                    <td>{formatNumber(result.phiVf)} kN</td>
                    <td>{formatNumber(result.phiNtf)} kN</td>
                    <td>{formatNumber(result.minimumPitch)} mm</td>
                    <td>{formatNumber(result.minEdgeDistanceShear)} mm</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-empty">
                    No saved results yet. Choose a bolt and save it to build your comparison table.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default BoltCalculator;
