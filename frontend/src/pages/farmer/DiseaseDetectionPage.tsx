import React, { useState } from 'react';
import { DharaNav } from '../../components/common/DharaNav';
import { 
  Scan, 
  Upload, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Sparkles, 
  Leaf, 
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const DiseaseDetectionPage: React.FC = () => {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [customFileUploaded, setCustomFileUploaded] = useState<string | null>(null);

  const diseaseSamples = [
    {
      crop: 'Wheat (Triticum aestivum)',
      condition: 'Yellow Stripe Rust',
      pathogen: 'Puccinia striiformis f. sp. tritici',
      confidence: 96.4,
      severity: 'High (Canopy Infection ~40%)',
      symptoms: 'Linear yellow-orange pustules aligned parallel to leaf veins. Premature drying of flag leaf.',
      organicRemedy: 'Foliar spray of 5% Neem Seed Kernel Extract (NSKE) or Trichoderma viride @ 5g/L.',
      chemicalRemedy: 'Spray Propiconazole 25% EC (Tilt) @ 1 ml/L or Tebuconazole 25.9% EC @ 1.25 ml/L during morning hours.',
      urgency: 'Immediate (Within 48 Hours)',
      urgencyColor: 'text-[#8B5F4D] bg-[#F5EFE6] border-[#CAB4AA]',
      leafGradient: 'from-amber-600 via-yellow-600 to-emerald-800'
    },
    {
      crop: 'Soybean (Glycine max)',
      condition: 'Cercospora Leaf Blight & Purple Seed Stain',
      pathogen: 'Cercospora kikuchii',
      confidence: 93.1,
      severity: 'Moderate (Early Blight Stage)',
      symptoms: 'Reddish-purple to bronze discoloration on upper leaf surface, progressing to necrotic leathery lesions.',
      organicRemedy: 'Apply copper hydroxide spray @ 2g/L; prune lower water-soaked leaves to improve air circulation.',
      chemicalRemedy: 'Foliar application of Pyraclostrobin 20% WG @ 1g/L or Carbendazim 12% + Mancozeb 63% WP @ 2g/L.',
      urgency: 'Moderate (Within 5-7 Days)',
      urgencyColor: 'text-[#8B5F4D] bg-[#F5EFE6] border-[#CAB4AA]',
      leafGradient: 'from-purple-900 via-amber-800 to-emerald-700'
    },
    {
      crop: 'Cotton (Gossypium hirsutum)',
      condition: 'Bacterial Blight / Angular Leaf Spot',
      pathogen: 'Xanthomonas citri pv. malvacearum',
      confidence: 89.5,
      severity: 'Severe (Systemic Vein Blight)',
      symptoms: 'Angular water-soaked lesions bounded by veinlets, turning dark brown/black. Stem cankers visible.',
      organicRemedy: 'Seed treatment with Pseudomonas fluorescens @ 10g/kg; spray cow dung slurry supernatant (5%).',
      chemicalRemedy: 'Streptocycline @ 0.1g/L combined with Copper Oxychloride 50% WP @ 2.5g/L at 12-day intervals.',
      urgency: 'Immediate Intervention',
      urgencyColor: 'text-rose-800 bg-rose-50 border-rose-200',
      leafGradient: 'from-stone-900 via-amber-900 to-green-800'
    },
    {
      crop: 'Paddy / Rice (Oryza sativa)',
      condition: 'Healthy Vigorous Canopy',
      pathogen: 'No pathogenic infection detected',
      confidence: 98.7,
      severity: 'Normal (Optimum Physiological State)',
      symptoms: 'Uniform dark green pigmentation, strong turgidity, zero pustules or necrotic margins.',
      organicRemedy: 'Maintain regular bio-fertilizer application (Azospirillum & Phosphobacteria).',
      chemicalRemedy: 'No chemical fungicide required. Maintain optimum field water stagnation (2-3 cm).',
      urgency: 'Optimal Health',
      urgencyColor: 'text-[#5B7553] bg-emerald-50 border-emerald-200',
      leafGradient: 'from-emerald-600 via-green-600 to-teal-800'
    }
  ];

  const currentSample = diseaseSamples[activeSampleIndex];

  const triggerScan = (index: number) => {
    setActiveSampleIndex(index);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFileUploaded(file.name);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
            <Scan className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>Foliar Pathogen Diagnostic Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
            AI Crop Disease Detection
          </h1>
          <p className="text-[#68625B] text-base font-sans font-normal leading-relaxed">
            Identify fungal, bacterial, and viral crop diseases from leaf photographs in seconds. 
            Receive immediate, actionable treatment recommendations calibrated for central Indian crops.
          </p>
        </div>

        {/* Preset Sample Picker Buttons */}
        <div className="space-y-3">
          <div className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#8B5F4D]">
            Select benchmark foliar specimen to run live inference:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {diseaseSamples.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => triggerScan(idx)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  activeSampleIndex === idx
                    ? 'bg-[#1B1D1C] text-[#FBF9F5] border-[#1B1D1C] shadow-md'
                    : 'bg-[#F5EFE6] border-[#EAE3D9] text-[#68625B] hover:text-[#1B1D1C] hover:bg-[#EAE3D9]'
                }`}
              >
                <div className="text-sm font-serif font-medium truncate">{sample.crop.split(' ')[0]}</div>
                <div className={`text-xs font-sans truncate mt-0.5 ${activeSampleIndex === idx ? 'text-[#CAB4AA]' : 'text-[#8B5F4D]'}`}>
                  {sample.condition.split(' ')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Diagnostic Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Leaf Viewport */}
          <div className="lg:col-span-7 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] relative overflow-hidden shadow-[0_4px_24px_rgba(27,29,28,0.03)] flex flex-col justify-between">
            
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4 mb-6">
              <div className="flex items-center gap-2 font-sans font-medium text-xs text-[#8B5F4D] uppercase tracking-wider">
                <Leaf className="w-4 h-4" />
                <span>Specimen Viewport · 1080p Optical Input</span>
              </div>
              <div className="text-xs font-mono text-[#68625B]">
                SENSOR: SMARTPHONE RGB
              </div>
            </div>

            {/* Neural Canvas Area */}
            <div className="relative rounded-2xl bg-[#141716] border border-[#EAE3D9] h-[360px] flex items-center justify-center overflow-hidden p-6 group shadow-inner">
              
              {/* Graphic Representation of Leaf */}
              <div className={`w-52 h-72 rounded-full bg-gradient-to-br ${currentSample.leafGradient} opacity-90 transform -rotate-6 flex items-center justify-center relative shadow-2xl transition-all duration-700`}>
                {/* Simulated Leaf Vein Architecture */}
                <div className="absolute inset-0 border-r-2 border-emerald-400/40 rounded-full"></div>
                <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-emerald-300/30 -rotate-12"></div>
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-300/30 -rotate-12"></div>
                <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-emerald-300/30 -rotate-12"></div>

                {/* Neural Bounding Box */}
                {activeSampleIndex !== 3 ? (
                  <div className="absolute top-1/3 left-1/4 w-32 h-32 border-2 border-dashed border-amber-400 bg-amber-400/20 rounded-xl flex items-start justify-end p-1.5 animate-pulse">
                    <span className="text-[9px] font-mono font-bold bg-amber-400 text-black px-1.5 py-0.5 rounded shadow">
                      {currentSample.condition.split(' ')[0]} ({currentSample.confidence}%)
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-6 border border-[#C5E86C]/50 rounded-full flex items-center justify-center bg-[#C5E86C]/10">
                    <span className="text-xs font-mono font-bold text-[#C5E86C] bg-black/80 px-3 py-1 rounded-full border border-[#C5E86C]/30">
                      Canopy Healthy (98.7%)
                    </span>
                  </div>
                )}
              </div>

              {/* Scanning Laser HUD */}
              {isScanning && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#C5E86C] to-transparent shadow-[0_0_20px_#C5E86C] animate-scan"></div>
                  <span className="mt-4 font-mono text-xs text-[#C5E86C] tracking-widest uppercase animate-pulse">
                    [ CONVOLUTIONAL FEATURE EXTRACTION IN PROGRESS ]
                  </span>
                </div>
              )}

              {/* Viewport Corner HUD */}
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-300 bg-black/70 px-2.5 py-1 rounded border border-white/10">
                MODEL: AGRI-VISION-RESNET50 • FOV: 24MM
              </div>
            </div>

            {/* Custom File Upload Simulation */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EAE3D9] hover:bg-[#CAB4AA] text-xs font-sans font-medium text-[#1B1D1C] transition-all">
                <Upload className="w-4 h-4 text-[#8B5F4D]" />
                <span>Upload Your Own Leaf Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {customFileUploaded && (
                <div className="text-xs font-mono text-[#5B7553] flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Analyzed: {customFileUploaded}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right: Pathological Diagnostic Report */}
          <div className="lg:col-span-5 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-sans font-medium border ${currentSample.urgencyColor}`}>
                  {currentSample.urgency}
                </span>
                <span className="text-xs font-sans font-medium text-[#8B5F4D]">
                  {currentSample.confidence}% AI Certainty
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1B1D1C] mb-1">
                {currentSample.condition}
              </h2>
              <div className="text-xs font-sans text-[#68625B] italic">
                Pathogen: {currentSample.pathogen}
              </div>
            </div>

            {/* Severity Card */}
            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] space-y-2 text-xs">
              <div className="flex justify-between font-sans">
                <span className="text-[#68625B]">Pathology Severity:</span>
                <span className="font-semibold text-[#1B1D1C]">{currentSample.severity}</span>
              </div>
              <p className="text-[#68625B] leading-relaxed pt-1 border-t border-[#EAE3D9]">
                {currentSample.symptoms}
              </p>
            </div>

            {/* Organic Remedy */}
            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#CAB4AA] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-sans font-semibold text-[#5B7553]">
                <Sparkles className="w-4 h-4" />
                <span>RECOMMENDED ORGANIC PROTOCOL</span>
              </div>
              <p className="text-[#1B1D1C] leading-relaxed font-normal">
                {currentSample.organicRemedy}
              </p>
            </div>

            {/* Chemical Treatment */}
            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#CAB4AA] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-sans font-semibold text-[#8B5F4D]">
                <ShieldAlert className="w-4 h-4" />
                <span>RECOMMENDED FOLIAR REMEDY</span>
              </div>
              <p className="text-[#1B1D1C] leading-relaxed font-normal">
                {currentSample.chemicalRemedy}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl bg-[#EAE3D9]/60 border border-[#EAE3D9] flex items-start gap-2.5 text-xs text-[#68625B] leading-relaxed">
              <Info className="w-4 h-4 text-[#8B5F4D] shrink-0 mt-0.5" />
              <span>
                Demonstration model calibrated on central Indian agricultural datasets. 
                Always consult your local Krishi Vigyan Kendra (KVK) extension officer prior to chemical application.
              </span>
            </div>

          </div>

        </div>

      </main>

      {/* Clean Workspace Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1B1D1C]">DHARA FARMER</span>
          <span>·</span>
          <span>AI Pathogen Diagnostic Engine</span>
        </div>
        <div className="text-xs font-mono text-[#8B5F4D]">
          <span>© 2026 DHARA</span>
        </div>
      </footer>
    </div>
  );
};
export default DiseaseDetectionPage;
