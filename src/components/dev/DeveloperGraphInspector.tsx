import React, { useState, useEffect } from 'react';
import { generateInitialGraph } from '../../lib/knowledge-graph/seed/initial-seed';
import { GraphValidator, ValidationError } from '../../lib/knowledge-graph/services/validator';
import { GraphQueryApi } from '../../lib/knowledge-graph/services/query';
import { BaseNode, BaseEdge } from '../../lib/knowledge-graph/core/types';

export const DeveloperGraphInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'explorer' | 'detail' | 'validator' | 'playground'>('overview');
  const [nodes, setNodes] = useState<BaseNode[]>([]);
  const [edges, setEdges] = useState<BaseEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  
  // Validation State
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Query Playground State
  const [playgroundQueryType, setPlaygroundQueryType] = useState<string>('getLearningPath');
  const [playgroundInputId, setPlaygroundInputId] = useState<string>('prod_first_3_clients');
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);

  const { repository } = generateInitialGraph();
  const queryApi = new GraphQueryApi(repository);
  const validator = new GraphValidator(repository);

  useEffect(() => {
    repository.getAllNodes().then(setNodes);
    repository.getAllEdges().then(setEdges);
  }, []);

  const handleRunValidation = async () => {
    setIsValidating(true);
    const errs = await validator.validateGraph();
    setValidationErrors(errs);
    setIsValidated(true);
    setIsValidating(false);
  };

  const handleExecutePlaygroundQuery = async () => {
    let res: any = null;
    try {
      if (playgroundQueryType === 'getNode') res = await queryApi.getNode(playgroundInputId);
      else if (playgroundQueryType === 'getChildren') res = await queryApi.getChildren(playgroundInputId);
      else if (playgroundQueryType === 'getParents') res = await queryApi.getParents(playgroundInputId);
      else if (playgroundQueryType === 'getBreadcrumbs') res = await queryApi.getBreadcrumbs(playgroundInputId);
      else if (playgroundQueryType === 'getLearningPath') res = await queryApi.getLearningPath(playgroundInputId);
      else if (playgroundQueryType === 'getAssets') res = await queryApi.getAssets(playgroundInputId);
      else if (playgroundQueryType === 'searchNodes') res = await queryApi.searchNodes(playgroundInputId);
    } catch (e: any) {
      res = { error: e.message };
    }
    setPlaygroundResult(res);
  };

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.title.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.nodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.slug.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === 'ALL' || node.nodeType === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const selectedNode = nodes.find(n => n.nodeId === selectedNodeId);
  const outgoingEdges = edges.filter(e => e.sourceId === selectedNodeId);
  const incomingEdges = edges.filter(e => e.targetId === selectedNodeId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono text-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">Developer Graph Inspector</h1>
          <p className="text-slate-400 text-xs mt-1">ThePaulX Product Knowledge Graph Runtime Visualizer</p>
        </div>
        <div className="flex space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['overview', 'explorer', 'validator', 'playground'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-slate-400 text-xs font-semibold">TOTAL NODES</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">{nodes.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-slate-400 text-xs font-semibold">TOTAL EDGES</span>
            <div className="text-3xl font-extrabold text-cyan-400 mt-2">{edges.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-slate-400 text-xs font-semibold">GRAPH VERSION</span>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2">v1.0.0</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-slate-400 text-xs font-semibold">VALIDATOR STATUS</span>
            <div className="mt-2">
              {isValidated ? (
                validationErrors.length === 0 ? (
                  <span className="text-emerald-400 font-bold">✓ 0 Errors (PASS)</span>
                ) : (
                  <span className="text-rose-400 font-bold">✕ {validationErrors.length} Errors</span>
                )
              ) : (
                <span className="text-amber-400 font-bold">UNCHECKED</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Explorer Tab */}
      {activeTab === 'explorer' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Filter & List */}
          <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Search nodes by title, ID, or slug..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={selectedTypeFilter}
                onChange={e => setSelectedTypeFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Node Types</option>
                {Array.from(new Set(nodes.map(n => n.nodeType))).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {filteredNodes.map(node => (
                <div
                  key={node.nodeId}
                  onClick={() => { setSelectedNodeId(node.nodeId); setActiveTab('detail'); }}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedNodeId === node.nodeId
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate">{node.title.en}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {node.nodeType}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                    <span>{node.nodeId}</span>
                    <span>v{node.version}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Node Detail Preview */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-emerald-400">{selectedNode.title.en}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedNode.description?.en}</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs rounded font-bold">
                    {selectedNode.nodeType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-500">Node ID:</span> {selectedNode.nodeId}</div>
                  <div><span className="text-slate-500">Revision ID:</span> {selectedNode.revisionId}</div>
                  <div><span className="text-slate-500">Status:</span> {selectedNode.status}</div>
                  <div><span className="text-slate-500">Slug:</span> {selectedNode.slug.en}</div>
                </div>

                {/* Edges */}
                <div>
                  <h3 className="text-xs font-bold text-slate-300 mb-2">Outgoing Edges ({outgoingEdges.length})</h3>
                  <div className="space-y-1">
                    {outgoingEdges.map(edge => (
                      <div key={edge.edgeId} className="p-2 bg-slate-950 rounded border border-slate-800 text-xs flex justify-between">
                        <span className="text-cyan-400 font-bold">{edge.relationType}</span>
                        <span className="text-slate-400">→ {edge.targetId}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-300 mb-2">Raw JSON Payload</h3>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] overflow-x-auto text-emerald-300">
                    {JSON.stringify(selectedNode, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">Select a node from the explorer list to inspect details</div>
            )}
          </div>
        </div>
      )}

      {/* Detail Tab */}
      {activeTab === 'detail' && selectedNode && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-emerald-400">{selectedNode.title.en}</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedNode.nodeId} | {selectedNode.revisionId}</p>
            </div>
            <button
              onClick={() => setActiveTab('explorer')}
              className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs rounded hover:bg-slate-700"
            >
              Back to Explorer
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 mb-3 uppercase">Outgoing Relationships</h3>
              <div className="space-y-2">
                {outgoingEdges.map(edge => (
                  <div key={edge.edgeId} className="p-2 bg-slate-900 rounded border border-slate-800 text-xs flex justify-between">
                    <span className="text-emerald-400 font-bold">{edge.relationType}</span>
                    <span className="text-slate-400">→ {edge.targetId}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 mb-3 uppercase">Incoming Relationships</h3>
              <div className="space-y-2">
                {incomingEdges.map(edge => (
                  <div key={edge.edgeId} className="p-2 bg-slate-900 rounded border border-slate-800 text-xs flex justify-between">
                    <span className="text-cyan-400 font-bold">{edge.relationType}</span>
                    <span className="text-slate-400">← {edge.sourceId}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validator Tab */}
      {activeTab === 'validator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-200">Pre-Build Graph Validator Panel</h2>
              <p className="text-xs text-slate-400 mt-0.5">Executes topological and constraint validation against active memory store.</p>
            </div>
            <button
              onClick={handleRunValidation}
              disabled={isValidating}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
            >
              {isValidating ? 'Validating...' : 'Run GraphValidator'}
            </button>
          </div>

          {/* Validation Checklist Panel */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Orphan Node Check', status: isValidated && !validationErrors.some(e => e.type === 'ORPHAN_NODE') },
              { label: 'Duplicate Slug Audit', status: isValidated && !validationErrors.some(e => e.type === 'DUPLICATE_SLUG') },
              { label: 'Circular Dependency Check', status: isValidated && !validationErrors.some(e => e.type === 'CIRCULAR_DEPENDENCY') },
              { label: 'Edge Constraint Matrix', status: isValidated && !validationErrors.some(e => e.type === 'INVALID_EDGE_CONSTRAINT') },
              { label: 'Localization Verification', status: isValidated && !validationErrors.some(e => e.type === 'MISSING_LOCALIZATION') },
              { label: 'Broken Reference Audit', status: isValidated && !validationErrors.some(e => e.type === 'BROKEN_REFERENCE') },
            ].map((check, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">{check.label}</span>
                {isValidated ? (
                  check.status ? (
                    <span className="text-xs font-bold text-emerald-400">✓ PASS</span>
                  ) : (
                    <span className="text-xs font-bold text-rose-400">✕ FAIL</span>
                  )
                ) : (
                  <span className="text-xs text-slate-500">-</span>
                )}
              </div>
            ))}
          </div>

          {/* Error Feed */}
          {isValidated && validationErrors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-rose-400 uppercase">Detected Errors ({validationErrors.length})</h3>
              {validationErrors.map((err, i) => (
                <div key={i} className="p-3 bg-rose-950/30 border border-rose-800/80 text-rose-300 rounded-lg text-xs">
                  <span className="font-bold">[{err.type}]</span> {err.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Query Playground Tab */}
      {activeTab === 'playground' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-200">Interactive Query Playground</h2>
            <p className="text-xs text-slate-400 mt-0.5">Test GraphQueryApi methods directly against the memory database.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Query API Method</label>
              <select
                value={playgroundQueryType}
                onChange={e => setPlaygroundQueryType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="getNode">getNode(id)</option>
                <option value="getChildren">getChildren(id)</option>
                <option value="getParents">getParents(id)</option>
                <option value="getBreadcrumbs">getBreadcrumbs(id)</option>
                <option value="getLearningPath">getLearningPath(productId)</option>
                <option value="getAssets">getAssets(stepId)</option>
                <option value="searchNodes">searchNodes(query)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Input Argument (ID or Query)</label>
              <input
                type="text"
                value={playgroundInputId}
                onChange={e => setPlaygroundInputId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleExecutePlaygroundQuery}
                className="w-full py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Execute Query
              </button>
            </div>
          </div>

          {playgroundResult !== null && (
            <div>
              <h3 className="text-xs font-bold text-slate-300 mb-2">Query Output Result</h3>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-emerald-400 overflow-x-auto max-h-[400px]">
                {JSON.stringify(playgroundResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
