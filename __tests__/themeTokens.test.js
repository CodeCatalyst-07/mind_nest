/**
 * __tests__/themeTokens.test.js
 * Unit tests verifying that every spacing.* and borderRadius.* token referenced
 * anywhere in src/ exists in src/theme/spacing.js so undefined token bugs never return.
 */

import fs from 'fs';
import path from 'path';
import { spacing, borderRadius } from '../src/theme/spacing';

function collectJsFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Theme Token Integrity', () => {
  const srcDir = path.resolve('src');
  const sourceFiles = collectJsFiles(srcDir);

  it('defines expected spacing and borderRadius scale tokens', () => {
    expect(spacing).toEqual({
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    });
    expect(borderRadius).toEqual({
      xs: 4,
      sm: 8,
      md: 14,
      lg: 20,
      round: 9999,
      full: 9999,
    });
  });

  it('has zero undefined borderRadius.* references in src/', () => {
    const missing = [];
    const regex = /\bborderRadius\.([a-zA-Z0-9_]+)/g;

    sourceFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      let match;
      while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        if (key === 'js') continue;
        if (!Object.prototype.hasOwnProperty.call(borderRadius, key)) {
          missing.push(`${path.relative(srcDir, filePath)}: borderRadius.${key}`);
        }
      }
    });

    expect(missing).toEqual([]);
  });

  it('has zero undefined spacing.* references in src/', () => {
    const missing = [];
    const regex = /\bspacing\.([a-zA-Z0-9_]+)/g;

    sourceFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      let match;
      while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        if (key === 'js') continue;
        if (!Object.prototype.hasOwnProperty.call(spacing, key)) {
          missing.push(`${path.relative(srcDir, filePath)}: spacing.${key}`);
        }
      }
    });

    expect(missing).toEqual([]);
  });
});
