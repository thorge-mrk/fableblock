/**
 * Chat overlay: transcript, input line with history recall and Tab
 * completion. Opens on T (or / for a command), closes on Escape/Enter.
 */
import React from 'react';
import { useGameStore } from '../state/store';
import { bridge } from '../state/bridge';
import { completions } from '../core/commands';

const KIND_CLASS: Record<string, string> = {
  info: 'text-slate-200',
  ok: 'text-emerald-300',
  error: 'text-rose-300',
  echo: 'text-sky-200',
};

export function ChatOverlay(): React.ReactElement | null {
  const open = useGameStore((s) => s.chatOpen);
  const log = useGameStore((s) => s.chatLog);
  const history = useGameStore((s) => s.chatHistory);
  const prefill = useGameStore((s) => s.chatPrefill);
  const [text, setText] = React.useState('');
  const [histIdx, setHistIdx] = React.useState(-1);
  const [hints, setHints] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const logRef = React.useRef<HTMLDivElement>(null);

  // Focus the field whenever the overlay opens, and reset transient state.
  React.useEffect(() => {
    if (open) {
      setHistIdx(-1);
      setHints([]);
      setText(prefill);
      // Focus after the element is actually mounted and visible.
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setText('');
    }
    // Intentionally keyed on `open` only: re-running on every prefill change
    // would clobber what the player is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log, open]);

  if (!open) {
    // Closed: show only the last few lines briefly, like the original.
    const tail = log.slice(-4);
    if (tail.length === 0) return null;
    return (
      <div className="absolute left-3 bottom-28 max-w-[46rem] pointer-events-none font-game text-sm">
        {tail.map((l, i) => (
          <div key={i} className={`${KIND_CLASS[l.kind] ?? 'text-white'} drop-shadow-[1px_1px_0_rgba(0,0,0,0.9)]`}>
            {l.text}
          </div>
        ))}
      </div>
    );
  }

  const submit = (): void => {
    const line = text;
    setText('');
    setHints([]);
    setHistIdx(-1);
    bridge().setChatOpen(false);
    if (line.trim() !== '') bridge().submitChat(line);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // The chat owns the keyboard while open: never let game bindings fire.
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setText('');
      setHints([]);
      bridge().setChatOpen(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const opts = completions(text);
      if (opts.length === 1) {
        setText(opts[0]);
        setHints([]);
      } else if (opts.length > 1) {
        // Complete to the longest shared prefix, then list the choices.
        let prefix = opts[0];
        for (const o of opts) {
          let i = 0;
          while (i < prefix.length && i < o.length && prefix[i] === o[i]) i++;
          prefix = prefix.slice(0, i);
        }
        if (prefix.length > text.length) setText(prefix);
        setHints(opts.map((o) => o.trim().split(/\s+/).pop() ?? o).slice(0, 24));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(history.length - 1, histIdx + 1);
      if (next >= 0 && history[next] !== undefined) {
        setHistIdx(next);
        setText(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next);
      setText(next >= 0 ? history[next] ?? '' : '');
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-auto font-game">
      <div
        ref={logRef}
        className="mx-3 mb-1 max-h-56 overflow-y-auto rounded-t bg-black/55 px-3 py-2 text-sm leading-relaxed"
      >
        {log.length === 0 ? (
          <div className="text-slate-400">Type /help for a list of commands.</div>
        ) : (
          log.map((l, i) => (
            <div key={i} className={KIND_CLASS[l.kind] ?? 'text-white'}>
              {l.text}
            </div>
          ))
        )}
      </div>
      {hints.length > 0 && (
        <div className="mx-3 mb-1 flex flex-wrap gap-x-3 gap-y-0.5 rounded bg-black/60 px-3 py-1 text-xs text-teal-200">
          {hints.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      )}
      <div className="mx-3 mb-3 flex items-center rounded bg-black/70 px-3 py-2">
        <span className="mr-2 text-teal-300">&gt;</span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
          value={text}
          placeholder="Message or /command — Tab completes, ↑ recalls"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => inputRef.current?.focus()}
        />
      </div>
    </div>
  );
}
