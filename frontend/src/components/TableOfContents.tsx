'use client';

import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse HTML string for h2 and h3
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const nodes = doc.querySelectorAll('h2, h3');

    const items: TOCItem[] = Array.from(nodes).map((node, index) => {
      const text = node.textContent || `Heading ${index + 1}`;
      const id = node.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        id,
        text,
        level: node.tagName.toLowerCase() === 'h2' ? 2 : 3,
      };
    });

    setHeadings(items);

    // Add dynamic IDs to article elements in DOM after mount
    setTimeout(() => {
      const articleHeadings = document.querySelectorAll('.article-body h2, .article-body h3');
      articleHeadings.forEach((el, index) => {
        if (items[index]) {
          el.id = items[index].id;
        }
      });
    }, 100);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slateDark-800 bg-slateDark-950/80 p-5 backdrop-blur-md sticky top-24 shadow-lg">
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-4 pb-2 border-b border-slateDark-800">
        <List className="w-4 h-4" />
        <span>Table of Contents</span>
      </div>

      <nav className="space-y-2 text-sm max-h-[70vh] overflow-y-auto pr-1">
        {headings.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={e => {
              e.preventDefault();
              setActiveId(item.id);
              const target = document.getElementById(item.id);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`block transition-all ${
              item.level === 3 ? 'pl-4 text-xs' : 'font-medium'
            } ${
              activeId === item.id
                ? 'text-brand-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
};
