import React, { useEffect, useState } from 'react';

interface Template {
  id: string;
  name: string;
  role: string;
  rounds: any[];
  pass_thresholds: any;
  is_active: boolean;
}

export const AdminTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    rounds: any[];
    passThresholds: { [key: number]: number };
  }>({
    name: '',
    role: '',
    rounds: [
      { round: 1, questions: 12, time: 30 },
      { round: 2, questions: 5, time: 120 },
      { round: 3, questions: 3, time: 300 }
    ],
    passThresholds: { 1: 70, 2: 60, 3: 70 }
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch('/api/admin/templates');
    const data = await res.json();
    setTemplates(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/templates/${editingId}` : '/api/admin/templates';
    const method = editingId ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setShowForm(false);
    setEditingId(null);
    fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
    fetchTemplates();
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      role: template.role,
      rounds: typeof template.rounds === 'string' ? JSON.parse(template.rounds) : template.rounds,
      passThresholds: typeof template.pass_thresholds === 'string' ? JSON.parse(template.pass_thresholds) : template.pass_thresholds
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Interview Templates</h1>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
          >
            + New Template
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingId ? 'Edit Template' : 'New Template'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rounds Configuration</label>
                  {formData.rounds.map((round, idx) => (
                    <div key={idx} className="flex gap-3 mb-2">
                      <input
                        type="number"
                        placeholder="Questions"
                        value={round.questions}
                        onChange={e => {
                          const newRounds = [...formData.rounds];
                          newRounds[idx].questions = parseInt(e.target.value);
                          setFormData({ ...formData, rounds: newRounds });
                        }}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                      />
                      <input
                        type="number"
                        placeholder="Time (sec)"
                        value={round.time}
                        onChange={e => {
                          const newRounds = [...formData.rounds];
                          newRounds[idx].time = parseInt(e.target.value);
                          setFormData({ ...formData, rounds: newRounds });
                        }}
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pass Thresholds (%)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(round => (
                      <input
                        key={round}
                        type="number"
                        placeholder={`Round ${round}`}
                        value={formData.passThresholds[round]}
                        onChange={e => setFormData({
                          ...formData,
                          passThresholds: { ...formData.passThresholds, [round]: parseInt(e.target.value) }
                        })}
                        className="px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingId(null); }}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {templates.map(template => (
            <div key={template.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{template.name}</h3>
                  <p className="text-gray-400 text-sm">{template.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="px-3 py-1 text-sm text-emerald-400 hover:text-emerald-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="px-3 py-1 text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {(typeof template.rounds === 'string' ? JSON.parse(template.rounds) : template.rounds).map((r: any) => (
                  <div key={r.round} className="bg-gray-900 rounded p-3">
                    <div className="text-gray-400 mb-1">Round {r.round}</div>
                    <div className="text-white">{r.questions} questions</div>
                    <div className="text-gray-400">{r.time}s each</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
