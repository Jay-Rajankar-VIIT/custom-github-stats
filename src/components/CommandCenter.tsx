'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CommandCenterProps {
  developerName: string;
  location?: string;
  bio?: string;
}

export function CommandCenter({ developerName, location = 'Earth', bio = 'Building awesome things' }: CommandCenterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);

  const commands = [
    { cmd: '$ whoami', output: developerName },
    { cmd: '$ location --current', output: location },
    { cmd: '$ status --describe', output: bio },
    { cmd: '$ cat skills.txt', output: 'TypeScript • React • Next.js • Web3' },
    { cmd: '$ git log --oneline | head -1', output: 'Building the future, one commit at a time' },
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentCommand = commands[currentCommandIndex];
    const fullText = currentCommand.cmd + '\n' + currentCommand.output;

    if (displayedText.length < fullText.length) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 30);
    } else if (currentCommandIndex < commands.length - 1) {
      timeout = setTimeout(() => {
        setCurrentCommandIndex(currentCommandIndex + 1);
        setDisplayedText('');
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, currentCommandIndex, commands]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/30 rounded-lg overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-green-500/20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-green-400 text-sm font-mono ml-4">developer@universe:~</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-sm">
          <div className="space-y-4 min-h-48">
            {displayedText.split('\n').map((line, idx) => (
              <div key={idx} className={line.startsWith('$') ? 'text-green-400' : 'text-slate-300'}>
                {line}
                {idx === displayedText.split('\n').length - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="ml-1 text-green-400"
                  >
                    ▋
                  </motion.span>
                )}
              </div>
            ))}
          </div>

          {/* Prompt */}
          <div className="mt-6 text-green-400">
            <span>$ </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            >
              ▋
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
