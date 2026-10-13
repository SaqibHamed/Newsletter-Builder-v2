import React, { useState } from 'react';
import {
  Plus,
  Type,
  Heading as HeadingIcon,
  AlignLeft,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered,
  Columns2,
  MousePointerClick,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Mail,
  Sparkles,
  Info,
  Minimize2,
} from 'lucide-react';
import { NewsletterMeta, NewsletterNode, NodeType } from '../types';
import { NodeEditorItem } from './NodeEditorItem';
import { createNewNode } from '../utils/nodeFactory';

interface NodeBuilderProps {
  nodes: NewsletterNode[];
  meta: NewsletterMeta;
  primaryColor: string;
  onUpdateNodes: (nodes: NewsletterNode[]) => void;
  onUpdateMeta: (meta: NewsletterMeta) => void;
}

export const NodeBuilder: React.FC<NodeBuilderProps> = ({
  nodes,
  meta,
  primaryColor,
  onUpdateNodes,
  onUpdateMeta,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showMetaSettings, setShowMetaSettings] = useState(true);

  const addNode = (type: NodeType) => {
    const newNode = createNewNode(type);
    onUpdateNodes([...nodes, newNode]);
    setShowAddMenu(false);
  };

  const handleUpdateNode = (updatedNode: NewsletterNode) => {
    onUpdateNodes(nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  const handleDeleteNode = (id: string) => {
    onUpdateNodes(nodes.filter((n) => n.id !== id));
  };

  const handleDuplicateNode = (id: string) => {
    const index = nodes.findIndex((n) => n.id === id);
    if (index === -1) return;
    const original = nodes[index];
    const duplicate: NewsletterNode = {
      ...JSON.parse(JSON.stringify(original)),
      id: `node-${original.type}-${Date.now()}`,
    };
    const newNodes = [...nodes];
    newNodes.splice(index + 1, 0, duplicate);
    onUpdateNodes(newNodes);
  };

  const handleMoveNode = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nodes.length) return;
    const newNodes = [...nodes];
    const [moved] = newNodes.splice(index, 1);
    newNodes.splice(targetIndex, 0, moved);
    onUpdateNodes(newNodes);
  };

  const collapseAll = () => {
    onUpdateNodes(nodes.map((n) => ({ ...n, collapsed: true })));
  };

  const expandAll = () => {
    onUpdateNodes(nodes.map((n) => ({ ...n, collapsed: false })));
  };

  return (
    <div id="node-builder-container" className="space-y-4">
      {/* Subject and Preheader Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              E-Mail Betreff & Preheader
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowMetaSettings(!showMetaSettings)}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
          >
            {showMetaSettings ? 'Einklappen' : 'Ausklappen'}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showMetaSettings ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {showMetaSettings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Betreffzeile (Wird im Posteingang angezeigt)
              </label>
              <input
                type="text"
                value={meta.subject}
                onChange={(e) => onUpdateMeta({ ...meta, subject: e.target.value })}
                placeholder="z.B. Willkommen bei autolina – Ihr Konto ist aktiv"
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Preheader-Vorschau (Snippet im Posteingang)
              </label>
              <input
                type="text"
                value={meta.preheader}
                onChange={(e) => onUpdateMeta({ ...meta, preheader: e.target.value })}
                placeholder="z.B. Entdecken Sie über 94'000 Inserate im Schweizer Fahrzeugmarkt"
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Nodes Header Controls */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Inhalts-Nodes ({nodes.length})
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Hierarchisch genormte Module aneinanderreihen
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={collapseAll}
            className="px-2 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
          >
            Alle einklappen
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={expandAll}
            className="px-2 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
          >
            Alle ausklappen
          </button>
        </div>
      </div>

      {/* Add Node Drawer/Grid */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-3.5 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            Neuen Node anreihen:
          </span>
          <span className="text-[11px] text-slate-400">Klicken zum Einfügen</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {/* 1. Titel */}
          <button
            id="add-node-title"
            type="button"
            onClick={() => addNode('title')}
            className="p-2 text-left bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-indigo-700 font-semibold text-xs mb-0.5">
              <Type className="w-3.5 h-3.5" />
              <span>Titel</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Grosse Hauptüberschrift (26px)
            </span>
          </button>

          {/* 2. Überschrift (H2) */}
          <button
            id="add-node-heading"
            type="button"
            onClick={() => addNode('heading')}
            className="p-2 text-left bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-xs mb-0.5">
              <HeadingIcon className="w-3.5 h-3.5" />
              <span>Unterüberschrift (H2)</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Zwischenüberschrift / Anrede (20px)
            </span>
          </button>

          {/* 2b. Überschrift (H3) */}
          <button
            id="add-node-subheading"
            type="button"
            onClick={() => addNode('sub_heading')}
            className="p-2 text-left bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-sky-700 font-semibold text-xs mb-0.5">
              <HeadingIcon className="w-3.5 h-3.5" />
              <span>Überschrift (H3)</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Themen-Überschrift (18px)
            </span>
          </button>

          {/* 3. Textabschnitt */}
          <button
            id="add-node-paragraph"
            type="button"
            onClick={() => addNode('paragraph')}
            className="p-2 text-left bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs mb-0.5">
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Textabschnitt</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Fliesstext & Absätze (15px)
            </span>
          </button>

          {/* 3b. Gap-Absorber */}
          <button
            id="add-node-gap-absorber"
            type="button"
            onClick={() => addNode('gap_absorber')}
            className="p-2 text-left bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-sky-700 font-semibold text-xs mb-0.5">
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Gap-Absorber</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Abstand reduzieren (1x Enter)
            </span>
          </button>

          {/* 4. Grafik */}
          <button
            id="add-node-graphic"
            type="button"
            onClick={() => addNode('graphic')}
            className="p-2 text-left bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs mb-0.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Grafik</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Einzelbild mit Alt-Text & Link
            </span>
          </button>

          {/* 5. Aufzählung Listed */}
          <button
            id="add-node-bullet-list"
            type="button"
            onClick={() => addNode('bullet_list')}
            className="p-2 text-left bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs mb-0.5">
              <ListIcon className="w-3.5 h-3.5" />
              <span>Aufzählung Listed</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Bullet-Punkte mit Akzentfarbe
            </span>
          </button>

          {/* 6. Aufzählung Nummeriert */}
          <button
            id="add-node-numbered-list"
            type="button"
            onClick={() => addNode('numbered_list')}
            className="p-2 text-left bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-teal-700 font-semibold text-xs mb-0.5">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Aufzählung Num.</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              1, 2, 3 Schritt-für-Schritt
            </span>
          </button>

          {/* 7. Links Grafik, Rechts Text */}
          <button
            id="add-node-two-col-left"
            type="button"
            onClick={() => addNode('two_col_left_graphic')}
            className="p-2 text-left bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-rose-700 font-semibold text-xs mb-0.5">
              <Columns2 className="w-3.5 h-3.5" />
              <span className="truncate">L: Grafik, R: Text</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              2 Spalten (Grafik links)
            </span>
          </button>

          {/* 8. Rechts Grafik, Links Text */}
          <button
            id="add-node-two-col-right"
            type="button"
            onClick={() => addNode('two_col_right_graphic')}
            className="p-2 text-left bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 rounded-lg transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-1.5 text-purple-700 font-semibold text-xs mb-0.5">
              <Columns2 className="w-3.5 h-3.5" />
              <span className="truncate">R: Grafik, L: Text</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              2 Spalten (Grafik rechts)
            </span>
          </button>
        </div>
      </div>

      {/* Render All Nodes */}
      <div className="space-y-3">
        {nodes.map((node, index) => (
          <NodeEditorItem
            key={node.id}
            node={node}
            index={index}
            total={nodes.length}
            primaryColor={primaryColor}
            onUpdate={handleUpdateNode}
            onDelete={handleDeleteNode}
            onDuplicate={handleDuplicateNode}
            onMove={handleMoveNode}
          />
        ))}

        {nodes.length === 0 && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-500 mb-2">Keine Inhalts-Nodes vorhanden.</p>
            <p className="text-xs text-slate-400 mb-4">
              Klicken Sie oben auf einen Node-Typ, um den Newsletter aufzubauen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
