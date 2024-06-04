'use client';
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { SerializeAddon } from '@xterm/addon-serialize';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal } from '@xterm/xterm';

export const fitAddon = new FitAddon();
export const searchAddon = new SearchAddon();
const serializeAddon = new SerializeAddon();
const unicode11Addon = new Unicode11Addon();
const webLinksAddon = new WebLinksAddon();

const addons = [
  fitAddon,
  searchAddon,
  serializeAddon,
  unicode11Addon,
  webLinksAddon,
];

export function initAddon(terminal: Terminal) {
  return addons.forEach((addon) => {
    terminal.loadAddon(addon);
  });
}
