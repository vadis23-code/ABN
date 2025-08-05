
import React, { useState, useCallback, useMemo } from 'react';
import { MOCK_ABN_DATA } from './constants';
import type { MockAbnDataType, RedFlag, RiskLevel } from './types';

// SVG Icons defined as components
const ClipboardIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5v1.5a1.5 1.5 0 01-3 0V5m3 0V3.5a1.5 1.5 0 013 0V5"></path></svg>
);
const PrintIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
);
const TrashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);
const LinkIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
);
const ChevronDownIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
);
const InfoIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
);

const App: React.FC = () => {
  const [abnInput, setAbnInput] = useState<string>('');
  const [employerNameInput, setEmployerNameInput] = useState<string>('');
  const [statedIndustryInput, setStatedIndustryInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MockAbnDataType | null>(null);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(null);
  const [showPolicy, setShowPolicy] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState<boolean>(true);
  const [copyNotification, setCopyNotification] = useState<string>('');
  
  const POLICY_TEXT = "As per ASIC and APRA guidance, all PAYG income must be supported by verifiable employer and income details. This lookup helps assess compliance.";

  const formatAbnForDisplay = (abn: string): string => {
    return abn.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  };

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    setSearchResults(null);
    setRedFlags([]);
    setRiskLevel(null);
    setTimestamp(null);
    setCaseId(null);
    
    const cleanedAbn = abnInput.replace(/\s/g, '');

    setTimeout(() => {
        let flags: RedFlag[] = [];

        if (cleanedAbn.length !== 11 || !/^\d+$/.test(cleanedAbn)) {
            flags.push({ severity: 'Critical', message: 'ABN format is invalid. It must be 11 digits.' });
        } else if (cleanedAbn !== MOCK_ABN_DATA.abn) {
             flags.push({ severity: 'Critical', message: `ABN "${formatAbnForDisplay(cleanedAbn)}" not found or is invalid.` });
        } else {
            setSearchResults(MOCK_ABN_DATA);
            setCaseId(`ABN-${cleanedAbn}`);
            setTimestamp(new Date().toLocaleString());

            // Red Flag Analysis
            if (employerNameInput.trim().toUpperCase() !== MOCK_ABN_DATA.entityName.toUpperCase() && employerNameInput.trim() !== '') {
                flags.push({ severity: 'Critical', message: `Employer Name mismatch: "${employerNameInput}" vs. "${MOCK_ABN_DATA.entityName}".` });
            }

            if (statedIndustryInput && !MOCK_ABN_DATA.industry.toLowerCase().includes(statedIndustryInput.toLowerCase()) && !statedIndustryInput.toLowerCase().includes('financ')) {
                flags.push({ severity: 'Caution', message: `Stated Industry "${statedIndustryInput}" appears inconsistent with ABN holder's industry (${MOCK_ABN_DATA.industry}).` });
            }

            const regDate = new Date(MOCK_ABN_DATA.registrationDate);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (regDate > oneYearAgo) {
                flags.push({ severity: 'Caution', message: 'ABN was registered within the last 12 months. Additional verification may be required.' });
            }
        }
        
        setRedFlags(flags);

        // Determine Risk Level
        const criticalCount = flags.filter(f => f.severity === 'Critical').length;
        const cautionCount = flags.filter(f => f.severity === 'Caution').length;

        if (criticalCount > 0) {
            setRiskLevel('High');
        } else if (cautionCount > 0) {
            setRiskLevel('Moderate');
        } else if (flags.length === 0 && cleanedAbn === MOCK_ABN_DATA.abn) {
            setRiskLevel('Low');
        } else {
            setRiskLevel(null);
        }

        setIsLoading(false);
    }, 1000);
  }, [abnInput, employerNameInput, statedIndustryInput]);
  
  const handleClear = useCallback(() => {
    setAbnInput('');
    setEmployerNameInput('');
    setStatedIndustryInput('');
    setSearchResults(null);
    setRedFlags([]);
    setRiskLevel(null);
    setShowPolicy(false);
    setTimestamp(null);
    setCaseId(null);
    setIsDetailsCollapsed(true);
  }, []);
  
  const showCopyNotification = (message: string) => {
    setCopyNotification(message);
    setTimeout(() => setCopyNotification(''), 2000);
  };
  
  const handleCopyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
        showCopyNotification(message);
    });
  };

  const abrLink = useMemo(() => {
    const cleanedAbn = abnInput.replace(/\s/g, '');
    return `https://abr.business.gov.au/ABN/View?id=${cleanedAbn}`;
  }, [abnInput]);

  const handleCopyResults = useCallback(() => {
    if (!searchResults) return;

    const flagText = redFlags.length > 0
      ? redFlags.map(flag => `• [${flag.severity}] ${flag.message}`).join('\n')
      : 'No red flags detected.';

    const summary = `
ABN RED FLAG CHECK SUMMARY
================================
Case ID: ${caseId || 'N/A'}
Timestamp: ${timestamp || 'N/A'}
Overall Risk Level: ${riskLevel || 'N/A'}

--------------------------------
APPLICANT-PROVIDED INFORMATION
--------------------------------
ABN Searched: ${formatAbnForDisplay(abnInput)}
Employer Name (from payslip): ${employerNameInput || 'Not provided'}
Stated Industry/Occupation: ${statedIndustryInput || 'Not provided'}

--------------------------------
RED FLAGS DETECTED
--------------------------------
${flagText}

--------------------------------
OFFICIAL ABN RECORD DETAILS
--------------------------------
Entity Name: ${searchResults.entityName}
ABN: ${formatAbnForDisplay(searchResults.abn)}
ABN Status: ${searchResults.status}
Entity Type: ${searchResults.entityType}
GST Registered: ${searchResults.gstRegistered ? 'Yes' : 'No'}
Registration Date: ${new Date(searchResults.registrationDate).toLocaleDateString()}
Business Location: ${searchResults.businessLocation}
ANZSIC Industry: ${searchResults.industry}

--------------------------------
Verify on ABR Website: ${abrLink}
    `.trim();

    handleCopyToClipboard(summary, 'Results copied to clipboard!');
  }, [searchResults, redFlags, riskLevel, caseId, timestamp, abnInput, employerNameInput, statedIndustryInput, abrLink]);

  const riskLevelClasses = {
    Low: 'bg-green-600 text-white',
    Moderate: 'bg-orange-500 text-white',
    High: 'bg-red-700 text-white',
  };

  return (
    <div className="font-sans antialiased">
      {copyNotification && (
        <div className="fixed top-5 right-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">
          {copyNotification}
        </div>
      )}
      <header className="bg-white shadow-sm no-print">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-slate-900">ABN Red Flag Checker</h1>
            <p className="text-sm text-slate-500">For PAYG employer verification and risk assessment.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Column */}
            <div className="flex flex-col gap-6 no-print">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">1. Enter Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="abn" className="block text-sm font-medium text-slate-700">Employer ABN</label>
                            <input
                                type="text"
                                id="abn"
                                value={abnInput}
                                onChange={(e) => setAbnInput(e.target.value)}
                                placeholder="Enter 11 digit ABN"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="border border-slate-200 rounded-lg">
                            <button onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)} className="w-full flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-t-lg">
                                <span className="font-medium text-slate-700">Employer & Industry Comparison</span>
                                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transform transition-transform ${isDetailsCollapsed ? '' : 'rotate-180'}`} />
                            </button>
                            {!isDetailsCollapsed && (
                                <div className="p-4 space-y-4 border-t border-slate-200">
                                     <div>
                                        <label htmlFor="employerName" className="flex items-center space-x-1.5 text-sm font-medium text-slate-700">
                                          <span>Employer Name (from payslip)</span>
                                          <div className="group relative">
                                            <InfoIcon className="text-slate-400" />
                                            <div className="absolute bottom-full left-1/2 z-10 mb-2 w-60 -translate-x-1/2 transform rounded-lg bg-slate-800 px-3 py-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                                              Enter the employer name exactly as it appears on the applicant's payslip for accurate matching.
                                              <div className="absolute left-1/2 top-full -ml-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-800"></div>
                                            </div>
                                          </div>
                                        </label>
                                        <input
                                            type="text"
                                            id="employerName"
                                            value={employerNameInput}
                                            onChange={(e) => setEmployerNameInput(e.target.value)}
                                            placeholder="e.g., CBA"
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="statedIndustry" className="flex items-center space-x-1.5 text-sm font-medium text-slate-700">
                                            <span>Applicant's Stated Industry/Occupation</span>
                                            <div className="group relative">
                                                <InfoIcon className="text-slate-400" />
                                                <div className="absolute bottom-full left-1/2 z-10 mb-2 w-60 -translate-x-1/2 transform rounded-lg bg-slate-800 px-3 py-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                    Enter the industry or occupation provided by the applicant to check for consistency with the ABN record.
                                                    <div className="absolute left-1/2 top-full -ml-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-800"></div>
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            id="statedIndustry"
                                            value={statedIndustryInput}
                                            onChange={(e) => setStatedIndustryInput(e.target.value)}
                                            placeholder="e.g., Banking"
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex items-center space-x-3">
                         <button onClick={handleSearch} disabled={isLoading} className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Searching...' : 'Search'}
                         </button>
                         <button onClick={handleClear} className="p-2 text-slate-500 hover:bg-slate-100 rounded-md" title="Clear All">
                            <TrashIcon />
                         </button>
                    </div>
                </div>
            </div>

            {/* Results Column */}
            <div className="flex flex-col gap-6">
                <div id="printable-area" className="bg-white p-6 rounded-xl shadow-md">
                   <h2 className="text-xl font-semibold mb-2 border-b pb-2">2. Analysis & Results</h2>
                   {isLoading && <div className="text-center p-8 text-slate-500">Loading analysis...</div>}
                   {!isLoading && !searchResults && redFlags.length === 0 && (
                     <div className="text-center p-8 text-slate-400">Enter an ABN and click Search to see results.</div>
                   )}

                   {(searchResults || redFlags.length > 0) && (
                     <div className="space-y-6">
                        <div className="flex justify-between items-start text-sm">
                            <div>
                                {caseId && <p><span className="font-bold">Case ID:</span> {caseId}</p>}
                                {timestamp && <p><span className="font-bold">Timestamp:</span> {timestamp}</p>}
                            </div>
                            {riskLevel && (
                              <div className={`px-3 py-1 text-sm font-bold rounded-full ${riskLevelClasses[riskLevel]}`}>{riskLevel} Risk</div>
                            )}
                        </div>
                        
                        {/* Red Flags */}
                        {redFlags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Red Flags</h3>
                                <div className="space-y-3">
                                    {redFlags.map((flag, index) => (
                                        <div key={index} className={`p-3 rounded-lg border-l-4 ${flag.severity === 'Critical' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-amber-50 border-amber-500 text-amber-800'}`}>
                                            <span className="font-bold">{flag.severity === 'Critical' ? '❗ Critical:' : '⚠️ Caution:'}</span> {flag.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ABN Details */}
                        {searchResults && (
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">ABN Entity Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                                    <p><span className="font-semibold text-slate-600">ABN:</span> {formatAbnForDisplay(searchResults.abn)}</p>
                                    <p><span className="font-semibold text-slate-600">Status:</span> <span className="font-bold text-green-600">{searchResults.status}</span></p>
                                    <p className="md:col-span-2"><span className="font-semibold text-slate-600">Entity Name:</span> {searchResults.entityName}</p>
                                    <p><span className="font-semibold text-slate-600">Entity Type:</span> {searchResults.entityType}</p>
                                    <p><span className="font-semibold text-slate-600">GST Registered:</span> {searchResults.gstRegistered ? 'Yes' : 'No'}</p>
                                    <p><span className="font-semibold text-slate-600">Registered:</span> {new Date(searchResults.registrationDate).toLocaleDateString()}</p>
                                    <p><span className="font-semibold text-slate-600">Location:</span> {searchResults.businessLocation}</p>
                                </div>
                                <a href={abrLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center space-x-1 text-sm text-blue-600 hover:underline">
                                    <span>Verify on ABR Website</span>
                                    <LinkIcon />
                                </a>
                            </div>
                        )}

                        {/* Policy Section */}
                        <div className="no-print">
                            <label htmlFor="showPolicy" className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" id="showPolicy" checked={showPolicy} onChange={() => setShowPolicy(!showPolicy)} className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                                <span className="text-sm font-medium text-slate-700">Show Policy Guidance</span>
                            </label>
                            {showPolicy && (
                                <div className="mt-2 bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800 relative">
                                    <button
                                        onClick={() => handleCopyToClipboard(POLICY_TEXT, 'Policy text copied!')}
                                        className="absolute top-2 right-2 p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"
                                        title="Copy Policy Text"
                                    >
                                        <ClipboardIcon className="w-4 h-4" />
                                    </button>
                                    <p>{POLICY_TEXT}</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-slate-200 no-print">
                            <button
                                onClick={handleCopyResults}
                                disabled={!searchResults}
                                className="inline-flex items-center space-x-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                <ClipboardIcon />
                                <span>Copy Results</span>
                            </button>
                            <button
                                onClick={() => window.print()}
                                disabled={!searchResults}
                                className="inline-flex items-center space-x-2 py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                            >
                                <PrintIcon />
                                <span>Print</span>
                            </button>
                             <button
                                onClick={handleClear}
                                disabled={!timestamp}
                                className="inline-flex items-center space-x-2 py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                                title="Clear Results"
                            >
                                <TrashIcon />
                                <span>Clear</span>
                            </button>
                        </div>
                     </div>
                   )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
