import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import { generateCertificatePDF } from './CertificateModal';
import {
  Award,
  X,
  Download,
  Calendar,
  Trophy,
  FileText,
  Loader2
} from 'lucide-react';
import nebuloidLogo from '../assets/nebuloid-logo.png';

const CertificateHistoryModal = ({
  isOpen,
  onClose,
  certificates = [],
  onOpenCertificatePreview,
}) => {
  const [downloadingId, setDownloadingId] = useState(null);

  if (!isOpen) return null;

  const handleDownloadSinglePDF = async (cert) => {
    try {
      setDownloadingId(cert.id);
      soundFx.playClick();

      await generateCertificatePDF({
        userName: cert.userName || 'Candidate',
        difficulty: cert.difficulty || 'Easy',
        levelNumber: cert.levelNumber || 1,
        score: cert.score || 200,
        stars: cert.stars || 3,
        date: cert.date || new Date().toLocaleDateString('en-US'),
        certificateId: cert.certificateId || `NT-EP-${Math.floor(100000 + Math.random() * 900000)}`,
        logoSrc: nebuloidLogo,
      });

      soundFx.playLevelComplete();
    } catch (e) {
      console.error('Error downloading certificate from history', e);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-neutral-900 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Award className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wider uppercase text-neutral-900 leading-none">
                Generated Certificates History
              </h3>
              <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-1">
                Official Nebuloid Tech Studio LLP Verifications ({certificates.length})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-black cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificates List Area */}
        <div className="p-5 overflow-y-auto flex-1 bg-neutral-100/70 space-y-3">
          {certificates.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center my-4">
              <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black uppercase tracking-tight text-neutral-900">
                No Certificates Generated Yet
              </h4>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                Play any difficulty, clear both stages in a level, enter your name, and generate your official certificate!
              </p>
            </div>
          ) : (
            certificates.map((cert, index) => (
              <div
                key={cert.id || index}
                className="bg-white border-2 border-neutral-900 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-neutral-950 text-white flex flex-col items-center justify-center shrink-0 border border-neutral-900">
                    <Trophy className="w-5 h-5 text-amber-400 mb-0.5" />
                    <span className="text-[8px] font-black tracking-widest text-neutral-300">
                      L-{cert.levelNumber || 1}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-black tracking-wide">
                        {cert.userName || 'Candidate'}
                      </span>
                      <span className="bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-neutral-700">
                        {(cert.difficulty || 'EASY').toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-neutral-600 mt-1 flex items-center gap-3">
                      <span>Score: <strong className="text-black">+{cert.score || 200} PTS</strong></span>
                      <span>Rating: <strong className="text-amber-500">{'★'.repeat(cert.stars || 3)}</strong></span>
                    </div>

                    <div className="text-[10px] text-neutral-400 font-semibold mt-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{cert.date || 'Recent'}</span>
                      <span>•</span>
                      <span className="font-mono text-neutral-500">ID: {cert.certificateId || 'NT-EP-OFFICIAL'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenCertificatePreview(cert);
                    }}
                    className="px-3 py-2 border-2 border-neutral-900 rounded-xl text-xs font-extrabold uppercase tracking-wider text-neutral-900 hover:bg-neutral-100 transition-all cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDownloadSinglePDF(cert)}
                    disabled={downloadingId === cert.id}
                    className="bg-black text-white px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-all cursor-pointer border-2 border-black disabled:opacity-50"
                  >
                    {downloadingId === cert.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-neutral-200 flex justify-between items-center text-xs">
          <span className="text-neutral-500 font-medium text-[11px]">
            Verified Nebuloid Tech Studio LLP Certificates
          </span>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-1.5 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateHistoryModal;
