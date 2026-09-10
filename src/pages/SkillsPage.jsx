import React, { useState } from 'react';
import { Boxes, CheckCircle2 } from 'lucide-react';
import { INITIAL_SKILLS } from '../data/mockData';
import DataTable from '../components/common/DataTable';
import SkillModal from '../components/skills/SkillModal';

export default function SkillsPage() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingSkill, setEditingSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredSkills = selectedCategory === 'ALL'
    ? skills
    : skills.filter(s => s.category.toUpperCase() === selectedCategory.toUpperCase());

  const columns = [
    {
      key: 'code', label: 'Skill Code', render: (val) => (
        <span className="font-mono font-bold text-[#4056d6] bg-indigo-50 px-2 py-0.5 rounded-md text-xs border border-indigo-100">
          {val}
        </span>
      )
    },
    { key: 'name', label: 'Skill / Framework Name', render: (val) => <strong className="text-slate-900 font-bold">{val}</strong> },
    {
      key: 'category', label: 'Category', render: (val) => (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
          {val}
        </span>
      )
    },
    { key: 'experience', label: 'Typical Experience', render: (val) => `${val} yrs` }
  ];

  const handleSave = (skillData) => {
    if (editingSkill) {
      setSkills(skills.map(s => s.code === skillData.code ? skillData : s));
      showToast(`Updated skill ${skillData.name}`);
    } else {
      setSkills([skillData, ...skills]);
      showToast(`Added skill ${skillData.name}`);
    }
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to remove skill ${row.name}?`)) {
      setSkills(skills.filter(s => s.code !== row.code));
      showToast(`Removed skill ${row.code}`);
    }
  };

  const categories = ['ALL', 'FRONTEND', 'BACKEND', 'CLOUD', 'DEVOPS', 'DATABASE', 'TESTING', 'AI', 'PROJECT'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main DataTable */}
      <DataTable
        title="Technical Skills & Competency Catalog"
        subtitle="Standard technical skill ontology, categorization, and benchmark experience metrics."
        columns={columns}
        data={filteredSkills}
        searchPlaceholder="Search skills by code, name, category..."
        addButtonLabel="+ Add Skill"
        onAdd={() => { setEditingSkill(null); setIsModalOpen(true); }}
        onEdit={(row) => { setEditingSkill(row); setIsModalOpen(true); }}
        onDelete={handleDelete}
      // filterComponent={
      //   <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-md">
      //     {categories.map((cat) => (
      //       <button
      //         key={cat}
      //         onClick={() => setSelectedCategory(cat)}
      //         className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
      //           selectedCategory === cat ? 'bg-[#4056d6] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
      //         }`}
      //       >
      //         {cat}
      //       </button>
      //     ))}
      //   </div>
      // }
      />

      <SkillModal
        isOpen={isModalOpen}
        skill={editingSkill}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
