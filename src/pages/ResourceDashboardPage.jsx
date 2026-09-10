import React, { useState } from 'react';
import {
  Sparkles, Gauge, TrendingUp, Users, FolderKanban, CheckCircle2,
  Clock, AlertTriangle, ArrowRight, ShieldCheck, Target, Zap,
  Layers, Filter, ChevronRight, UserPlus, Star, Award, Check, Search,
  SlidersHorizontal, Bookmark, UserCheck
} from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_EMPLOYEES, INITIAL_RESOURCE_REQUESTS } from '../data/mockData';
import { calculateTalentFit } from '../utils/matchingEngine';
import ApproveAllocateModal from '../components/matching/ApproveAllocateModal';
import { useAuth } from '../context/AuthContext';

export default function ResourceDashboardPage({ initialDemandId = 'DEM-01', onNavigateToRequests, onNavigateToAddResource }) {
  const { currentUser } = useAuth();
  const [selectedDemandId, setSelectedDemandId] = useState(initialDemandId);
  const [searchTerm, setSearchTerm] = useState('');
  const [benchOnlyFilter, setBenchOnlyFilter] = useState(false);
  const [minMatchFilter, setMinMatchFilter] = useState(0); // 0, 70, 85, 90
  const [shortlistedMap, setShortlistedMap] = useState({}); // { [demandId]: [candId1, candId2] }
  const [toastMessage, setToastMessage] = useState('');

  // Modal State for Approve & Allocate
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedCandidateToAllocate, setSelectedCandidateToAllocate] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Open Project Demands Matrix
  const [demands, setDemands] = useState([
    {
      id: 'DEM-01',
      projectId: 'PRJ001',
      project: 'Phoenix Digital Platform (PRJ001)',
      role: 'Senior Frontend Developer',
      requiredSkills: ['REACT', 'ANGULAR', 'NODEJS'],
      exp: '5.0+ yrs',
      allocation: '100%',
      priority: 'High',
      urgency: 'Sprint 24',
      status: 'Open Demand'
    },
    {
      id: 'DEM-02',
      projectId: 'PRJ002',
      project: 'Atlas Commerce (PRJ002)',
      role: 'Cloud Solutions Architect / .NET',
      requiredSkills: ['DOTNET', 'AZURE', 'K8S'],
      exp: '8.0+ yrs',
      allocation: '50%',
      priority: 'Critical',
      urgency: 'Immediate',
      status: 'Open Demand'
    },
    {
      id: 'DEM-03',
      projectId: 'PRJ003',
      project: 'Orion Analytics (PRJ003)',
      role: 'Full Stack Node / Nest Developer',
      requiredSkills: ['REACT', 'NESTJS', 'MYSQL'],
      exp: '4.0+ yrs',
      allocation: '100%',
      priority: 'Medium',
      urgency: 'Next Month',
      status: 'Open Demand'
    },
    {
      id: 'DEM-04',
      projectId: 'PRJ004',
      project: 'Nova CRM & Healthcare (PRJ004)',
      role: 'Senior QA Automation Specialist',
      requiredSkills: ['SELENIUM', 'DOCKER', 'AGILE'],
      exp: '6.0+ yrs',
      allocation: '50%',
      priority: 'Medium',
      urgency: 'Sprint 25',
      status: 'Open Demand'
    }
  ]);

  // Candidates database with current allocation / bench status
  const [candidates, setCandidates] = useState([
    {
      id: 'EMP006',
      name: 'Sneha Shinde',
      designation: 'Senior Software Engineer',
      location: 'Pune',
      experience: '5.5 yrs',
      currentAllocation: '0%',
      status: 'Bench',
      skills: ['ANGULAR', 'REACT', 'NODEJS'],
      certifications: ['Azure Fundamentals', 'React Certified Pro'],
    },
    {
      id: 'EMP002',
      name: 'Priya Patil',
      designation: 'Senior Software Engineer',
      location: 'Pune',
      experience: '6.0 yrs',
      currentAllocation: '0%',
      status: 'Bench',
      skills: ['ANGULAR', 'REACT', 'NODEJS'],
      certifications: ['AWS Solutions Architect Associate'],
    },
    {
      id: 'EMP003',
      name: 'Rahul Joshi',
      designation: 'Software Engineer',
      location: 'Mumbai',
      experience: '4.0 yrs',
      currentAllocation: '60%',
      status: 'Available (40%)',
      skills: ['REACT', 'NESTJS', 'MYSQL'],
      certifications: ['React Certified Developer'],
    },
    {
      id: 'EMP005',
      name: 'Vikram Deshmukh',
      designation: 'Technical Architect',
      location: 'Bangalore',
      experience: '10.0 yrs',
      currentAllocation: '50%',
      status: 'Available (50%)',
      skills: ['DOTNET', 'AZURE', 'K8S', 'RAG'],
      certifications: ['Azure Solutions Architect Expert', 'CKA Kubernetes'],
    },
    {
      id: 'EMP004',
      name: 'Neha Kulkarni',
      designation: 'Senior QA Engineer',
      location: 'Pune',
      experience: '7.0 yrs',
      currentAllocation: '50%',
      status: 'Available (50%)',
      skills: ['SELENIUM', 'DOCKER', 'AGILE'],
      certifications: ['ISTQB Advanced', 'Agile Scrum Master'],
    },
    {
      id: 'EMP001',
      name: 'Amit Sharma',
      designation: 'Technical Lead',
      location: 'Pune',
      experience: '8.0 yrs',
      currentAllocation: '50%',
      status: 'Available (50%)',
      skills: ['DOTNET', 'AZURE', 'DOCKER', 'AGILE'],
      certifications: ['Microsoft Certified DevOps Engineer'],
    },
    {
      id: 'EMP007',
      name: 'Karan Mehta',
      designation: 'Software Engineer',
      location: 'Hyderabad',
      experience: '3.5 yrs',
      currentAllocation: '0%',
      status: 'Bench',
      skills: ['ANGULAR', 'NODEJS', 'MYSQL'],
      certifications: ['Oracle Certified Associate'],
    }
  ]);

  const activeDemand = demands.find(d => d.id === selectedDemandId) || demands[0];

  // Calculate scores for all candidates on the active demand
  const rankedCandidates = candidates
    .map(cand => {
      const matchResult = calculateTalentFit(cand, activeDemand);
      return {
        ...cand,
        matchResult
      };
    })
    .filter(cand => {
      // Search filter
      const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        cand.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Bench filter
      const matchesBench = !benchOnlyFilter || cand.status === 'Bench';

      // Min Match threshold filter
      const matchesMin = cand.matchResult.overall >= minMatchFilter;

      return matchesSearch && matchesBench && matchesMin;
    })
    .sort((a, b) => b.matchResult.overall - a.matchResult.overall);

  // Shortlist action handler
  const handleToggleShortlist = (cand) => {
    const currentList = shortlistedMap[activeDemand.id] || [];
    const isAlreadyShortlisted = currentList.includes(cand.id);

    let updatedList;
    if (isAlreadyShortlisted) {
      updatedList = currentList.filter(id => id !== cand.id);
      showToast(`Removed ${cand.name} (${cand.id}) from shortlist for ${activeDemand.project}.`);
    } else {
      updatedList = [...currentList, cand.id];
      showToast(`⭐ Shortlisted ${cand.name} (${cand.id}) with ${cand.matchResult.overall}% match for ${activeDemand.project}!`);
    }

    setShortlistedMap({
      ...shortlistedMap,
      [activeDemand.id]: updatedList
    });
  };

  // Open Approve & Allocate modal
  const handleOpenAllocateModal = (cand) => {
    setSelectedCandidateToAllocate(cand);
    setIsAllocateModalOpen(true);
  };

  // Confirm Allocation Handler
  const handleConfirmAllocation = ({ candidate, demand, allocationPct, startDate, endDate }) => {
    // 1. Update Candidate status
    setCandidates(candidates.map(c => {
      if (c.id === candidate.id) {
        const newAlloc = (parseFloat(c.currentAllocation) || 0) + Number(allocationPct);
        return {
          ...c,
          currentAllocation: `${newAlloc}%`,
          status: newAlloc >= 100 ? 'Fully Allocated' : `Available (${100 - newAlloc}%)`
        };
      }
      return c;
    }));

    // 2. Mark Demand as Fulfilled
    setDemands(demands.map(d => {
      if (d.id === demand.id) {
        return { ...d, status: 'Fulfilled' };
      }
      return d;
    }));

    showToast(`🎉 Success: Approved and allocated ${candidate.name} (${allocationPct}%) to ${demand.project}! Demand marked as Fulfilled.`);
  };

  // Top candidate
  const topCandidate = rankedCandidates.length > 0 ? rankedCandidates[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
              Talent Matching Engine
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 15 HR Intelligence UI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Talent Matching &amp; Fit Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated 3-Factor Scoring Formula: <strong className="text-slate-700">Skills (40%)</strong> + <strong className="text-slate-700">Experience (30%)</strong> + <strong className="text-slate-700">Availability (30%)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToRequests && (
            <button
              onClick={onNavigateToRequests}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>View Demand Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#4056d6] flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Open Demands</span>
            <strong className="text-xl font-bold text-slate-900">{demands.length} Positions</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Bench Talent Pool</span>
            <strong className="text-xl font-bold text-slate-900">
              {candidates.filter(c => c.status === 'Bench').length} Engineers
            </strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">High Match (&gt;80%)</span>
            <strong className="text-xl font-bold text-purple-700">
              {rankedCandidates.filter(c => c.matchResult.overall >= 80).length} Candidates
            </strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Top Match Score</span>
            <strong className="text-xl font-bold text-slate-900">
              {topCandidate ? `${topCandidate.matchResult.overall}%` : '96.5%'}
            </strong>
          </div>
        </div>

      </div>

      {/* Main Matching Layout: Left Column (Open Positions) & Right Column (Ranked Candidates) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left Column: Select Open Position Demand */}
        <div className="space-y-4">

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#4056d6]" />
                <span>Select Target Demand</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                {demands.length} Demands
              </span>
            </div>

            <div className="space-y-2.5">
              {demands.map((dem) => {
                const isSelected = selectedDemandId === dem.id;
                const shortlistedCount = (shortlistedMap[dem.id] || []).length;
                const isFulfilled = dem.status === 'Fulfilled';

                return (
                  <div
                    key={dem.id}
                    onClick={() => setSelectedDemandId(dem.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                        ? 'bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border-[#4056d6] shadow-sm'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 leading-tight block">
                        {dem.role}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isFulfilled
                          ? 'bg-emerald-100 text-emerald-800'
                          : dem.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-indigo-100 text-[#4056d6]'
                        }`}>
                        {isFulfilled ? 'Fulfilled ✓' : dem.priority}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 block mt-1">
                      {dem.project}
                    </span>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80 text-[10px] text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <span>Exp: {dem.exp}</span>
                        <span>•</span>
                        <span>Alloc: {dem.allocation}</span>
                      </div>
                      {shortlistedCount > 0 && (
                        <span className="text-purple-700 font-bold flex items-center gap-0.5">
                          ⭐ {shortlistedCount} Shortlisted
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3-Factor Formula Weight Explainer Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-card space-y-3">
            <div className="flex items-center gap-2 text-purple-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Scoring Formula</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Match fit is calculated through a multi-dimensional weighted model:
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Technical Skills Match</span>
                <strong className="text-purple-300 font-mono font-bold">40% Weight</strong>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '40%' }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-300">Experience &amp; Seniority</span>
                <strong className="text-indigo-300 font-mono font-bold">30% Weight</strong>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: '30%' }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-300">Availability &amp; Bandwidth</span>
                <strong className="text-emerald-300 font-mono font-bold">30% Weight</strong>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '30%' }} />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Ranked Candidate Match Scorecards */}
        <div className="lg:col-span-2 space-y-4">

          {/* Active Demand Information Banner & Filter Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demand Profile:</span>
                  <h2 className="text-base font-bold text-slate-900">
                    {activeDemand.role}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target: <strong>{activeDemand.project}</strong> • Min Experience: <strong>{activeDemand.exp}</strong> • Allocation: <strong>{activeDemand.allocation}</strong>
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Required:</span>
                {activeDemand.requiredSkills.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4056d6] font-mono text-[10px] font-bold border border-indigo-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Sourcing Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter candidate name, skill, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#4056d6]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setBenchOnlyFilter(!benchOnlyFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${benchOnlyFilter
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {benchOnlyFilter ? '✓ Bench Only' : 'Bench Only'}
                </button>

                <select
                  value={minMatchFilter}
                  onChange={(e) => setMinMatchFilter(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="0">All Match Scores</option>
                  <option value="70">&gt; 70% Match</option>
                  <option value="85">&gt; 85% Match</option>
                  <option value="90">&gt; 90% High Fit</option>
                </select>
              </div>

            </div>

          </div>

          {/* Candidate Match Scorecards List */}
          <div className="space-y-4">
            {rankedCandidates.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-card">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No matching candidates found</h3>
                <p className="text-xs text-slate-500 mt-1">Try adjusting search criteria or match threshold filters.</p>
              </div>
            ) : (
              rankedCandidates.map((cand, idx) => {
                const { overall, skillsScore, expScore, availScore, skillsPoints, expPoints, availPoints, matchedSkills, missingSkills } = cand.matchResult;
                const isTopPick = idx === 0 && overall >= 90;
                const isShortlisted = (shortlistedMap[activeDemand.id] || []).includes(cand.id);

                return (
                  <div
                    key={cand.id}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden ${isTopPick
                        ? 'border-purple-300 shadow-md shadow-purple-500/5 ring-1 ring-purple-200'
                        : isShortlisted
                          ? 'border-indigo-300 shadow-sm bg-indigo-50/10'
                          : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
                      }`}
                  >

                    {/* Top Banner on #1 Best Match */}
                    {isTopPick && (
                      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white px-5 py-1.5 flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Top Candidate Match Recommendation: {cand.name} ({overall}% Match)</span>
                        </div>
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-mono">
                          #1 Fit
                        </span>
                      </div>
                    )}

                    <div className="p-5 sm:p-6 space-y-4">

                      {/* Top Row: Candidate Identity & Total Match Score Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                        {/* Left: Avatar & Details */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                            {cand.name.split(' ').map(n => n[0]).join('')}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900">{cand.name}</h3>
                              <span className="font-mono text-xs text-slate-400 font-semibold">({cand.id})</span>
                              {isShortlisted && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold flex items-center gap-1">
                                  <Bookmark className="w-2.5 h-2.5 fill-purple-600 text-purple-600" /> Shortlisted
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                              <span>{cand.designation}</span>
                              <span>•</span>
                              <span>{cand.experience} Exp</span>
                              <span>•</span>
                              <span>📍 {cand.location}</span>
                              <span>•</span>
                              <span className={`font-bold ${cand.status === 'Bench' ? 'text-emerald-600' : 'text-blue-600'
                                }`}>
                                {cand.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Total Match Score Card */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Automated Match
                          </span>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-xl font-bold font-mono text-lg ${overall >= 90
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : overall >= 75
                                  ? 'bg-indigo-100 text-[#4056d6] border border-indigo-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                              {overall}%
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {overall >= 90 ? '⭐⭐⭐ Strong Fit' : overall >= 75 ? '⭐⭐ High Match' : '⭐ Moderate Match'}
                          </span>
                        </div>

                      </div>

                      {/* Middle: 3-Factor Score Breakdown Bar Meters */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">

                        {/* 1. Skills (40%) */}
                        <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">Skills (40% Wt)</span>
                            <strong className="text-slate-900 font-mono font-bold">{skillsScore}%</strong>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-purple-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${skillsScore}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Contribution: {skillsPoints} / 40.0 pts
                          </span>
                        </div>

                        {/* 2. Experience (30%) */}
                        <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">Exp (30% Wt)</span>
                            <strong className="text-slate-900 font-mono font-bold">{expScore}%</strong>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${expScore}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Contribution: {expPoints} / 30.0 pts
                          </span>
                        </div>

                        {/* 3. Availability (30%) */}
                        <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">Avail (30% Wt)</span>
                            <strong className="text-slate-900 font-mono font-bold">{availScore}%</strong>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${availScore}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Contribution: {availPoints} / 30.0 pts
                          </span>
                        </div>

                      </div>

                      {/* Bottom Row: Skills Badges, Certifications & Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">

                        {/* Skills Chips */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {cand.skills.map(sk => {
                              const isRequired = activeDemand.requiredSkills.includes(sk);
                              return (
                                <span
                                  key={sk}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 ${isRequired
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                  {isRequired && <Check className="w-2.5 h-2.5" />}
                                  <span>{sk}</span>
                                </span>
                              );
                            })}
                          </div>

                          {cand.certifications && cand.certifications.length > 0 && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-500" />
                              <span>{cand.certifications.join(' • ')}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions: Shortlist & Approve and Allocate */}
                        <div className="flex items-center gap-2.5 shrink-0">

                          {/* HR Shortlist Button */}
                          <button
                            onClick={() => handleToggleShortlist(cand)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isShortlisted
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                              }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-purple-600 text-purple-600' : ''}`} />
                            <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                          </button>

                          {/* HR Approve & Allocate Button */}
                          <button
                            onClick={() => handleOpenAllocateModal(cand)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Approve &amp; Allocate</span>
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* Approve and Allocate Confirmation Modal */}
      {selectedCandidateToAllocate && (
        <ApproveAllocateModal
          isOpen={isAllocateModalOpen}
          onClose={() => setIsAllocateModalOpen(false)}
          candidate={selectedCandidateToAllocate}
          demand={activeDemand}
          matchScore={selectedCandidateToAllocate.matchResult}
          onConfirmAllocation={handleConfirmAllocation}
        />
      )}

    </div>
  );
}
