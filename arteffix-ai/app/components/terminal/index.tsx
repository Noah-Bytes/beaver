'use client';
import { Terminal as XTerminal } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import { socket } from '../../socket';
import { initAddon } from './addon';

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      const terminal = new XTerminal({
        allowProposedApi: true,
      });
      initAddon(terminal);
      terminal.open(terminalRef.current);

      terminal.onData((key) => {
        socket.emit('cmd', key);
      });

      socket.on('cmd-resp', (msg) => {
        terminal.write(msg);
      });
    }
  }, []);
  return <div ref={terminalRef} />;
}
