import React, { useState } from "react";
import * as Icons from "lucide-react";
import { CollectionSchema } from "../../../config/cms-schemas";
import { formatDate } from "../../../lib/firebase-utils";

interface SchemaDrivenListProps {
  schema: CollectionSchema;
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string, collectionName: string) => void;
  onCreateNew: () => void;
  onSpecialAction?: {
    label: string;
    icon: string;
    handler: (item?: any) => void;
  };
  onRowAction?: {
    label: string;
    icon: string;
    handler: (item: any) => void;
    condition?: (item: any) => boolean;
  };
}

export const LucideIcon = ({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
};

export const SchemaDrivenList = ({
  schema,
  items,
  onEdit,
  onDelete,
  onCreateNew,
  onSpecialAction,
  onRowAction,
}: SchemaDrivenListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // 1. Determine which fields we can filter by (select type fields)
  const filterableFields = schema.fields.filter((f) => f.type === "select");

  // 2. Filter items
  const filteredItems = items.filter((item) => {
    // Search query match on primary field
    const primaryVal = item[schema.primaryField];
    const searchMatch =
      !searchQuery ||
      (typeof primaryVal === "string" && primaryVal.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.email && typeof item.email === "string" && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.displayName && typeof item.displayName === "string" && item.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter selects matches
    const filterMatches = Object.entries(filters).every(([key, val]) => {
      if (!val) return true;
      return String(item[key]) === val;
    });

    return searchMatch && filterMatches;
  });

  // Helper formatter for list view
  const isImageField = (name: string) =>
    /thumbnail|image|photo|logo|thumb|img|cover|picture/i.test(name) && !name.includes('Count') && !name.includes('Url');

  const isImageUrl = (val: any) =>
    typeof val === 'string' && (val.startsWith('http') || val.startsWith('https')) && /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?.*)?$/i.test(val);

  const formatListValue = (item: any, fieldName: string, fieldType: string) => {
    const val = item[fieldName];
    if (val === undefined || val === null) return "";

    if (fieldType === "boolean") {
      return val ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 border border-green-500/20 text-green-400">
          <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white/40">
          Draft
        </span>
      );
    }

    if (fieldType === "date") {
      return formatDate(val);
    }

    if (fieldName === "amountTotal") {
      const amount = val / 100;
      const currency = item.currency || "inr";
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency,
      }).format(amount);
    }

    if (isImageField(fieldName) && isImageUrl(val)) {
      return (
        <div className="relative w-10 h-7 rounded-lg overflow-hidden bg-white/5 border border-white/10 group/img">
          <img
            src={val}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.classList.add('bg-red-500/10');
            }}
          />
        </div>
      );
    }

    if (Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1">
          {val.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/40 px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
          {val.length > 3 && <span className="text-[10px] text-white/20 font-bold">+{val.length - 3}</span>}
        </div>
      );
    }

    return String(val);
  };

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <LucideIcon name={schema.iconName} size={24} className="text-brand-primary" />
            {schema.pluralName}
          </h3>
          <p className="text-white/40 text-xs">
            Manage {filteredItems.length} of {items.length} total entries.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {onSpecialAction && (
            <button
              onClick={onSpecialAction.handler}
              className="px-6 py-3.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold rounded-2xl hover:bg-brand-primary hover:text-black transition-all flex items-center gap-2 text-sm"
            >
              <LucideIcon name={onSpecialAction.icon} size={16} />
              {onSpecialAction.label}
            </button>
          )}

          {schema.allowCreate && (
            <button
              onClick={onCreateNew}
              className="px-6 py-3.5 bg-brand-primary text-black font-bold rounded-2xl hover:bg-white transition-all flex items-center gap-2 text-sm"
            >
              <Icons.Plus size={16} /> Add {schema.displayName}
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Icons.Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder={`Search ${schema.pluralName.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 outline-none focus:border-brand-primary/50 text-white text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <Icons.X size={16} />
            </button>
          )}
        </div>

        {/* Filter select menus */}
        {filterableFields.map((field) => (
          <div key={field.name} className="min-w-[160px]">
            <select
              value={filters[field.name] || ""}
              onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 outline-none focus:border-brand-primary/50 text-white text-sm"
            >
              <option value="">All {field.label}s</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Dynamic Grid / List display */}
      {filteredItems.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] border border-white/10 p-16 text-center">
          <Icons.Inbox className="mx-auto mb-4 text-white/20 animate-pulse" size={48} />
          <h4 className="text-lg font-bold text-white mb-1">No Entries Found</h4>
          <p className="text-white/40 text-xs">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-[2.5rem] border border-white/10 p-6 flex flex-col justify-between group hover:border-brand-primary/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Card Body */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  {/* Primary field and Subtitle */}
                  <div>
                    <h4 className="font-bold text-white text-lg group-hover:text-brand-primary transition-colors line-clamp-1">
                      {item[schema.primaryField] || "Untitled"}
                    </h4>
                    {schema.primaryField !== "email" && item.email && (
                      <span className="text-xs text-white/40 block mt-0.5">{item.email}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onRowAction && (!onRowAction.condition || onRowAction.condition(item)) && (
                      <button
                        onClick={() => onRowAction.handler(item)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-green-500/10 hover:text-green-500 text-white/40 transition-colors"
                        title={onRowAction.label}
                      >
                        <LucideIcon name={onRowAction.icon} size={14} />
                      </button>
                    )}
                    {schema.allowEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary text-white/40 transition-colors"
                      >
                        <Icons.Edit size={14} />
                      </button>
                    )}
                    {schema.allowDelete && (
                      <button
                        onClick={() => onDelete(item.id, schema.collectionName)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-white/40 transition-colors"
                      >
                        <Icons.Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Display grid of selected fields */}
                <div className="space-y-2.5 pt-2 border-t border-white/5">
                  {schema.fields
                    .filter((f) => !f.hiddenInList && f.name !== schema.primaryField && f.name !== "email")
                    .slice(0, 4)
                    .map((field) => (
                      <div key={field.name} className="flex justify-between text-xs items-center gap-4">
                        <span className="text-white/40 font-medium">{field.label}</span>
                        <span className="text-white/80 font-bold truncate max-w-[180px]">
                          {formatListValue(item, field.name, field.type)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
