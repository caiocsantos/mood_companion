import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContextualLocalFallback } from '../src/services/aiCompanion.js';

test('creates an empathetic, contextual reply for work stress', () => {
  const reply = buildContextualLocalFallback('Tive uma reunião horrível no trabalho', -3, -1);
  assert.match(reply, /trabalho|reunião|pressão|aqui/i);
  assert.ok(reply.length > 25);
});

test('uses a warmer tone for strong sadness', () => {
  const reply = buildContextualLocalFallback('Estou muito triste e chorei hoje', -4, -1);
  assert.match(reply, /triste|coração|aqui|sentimento/i);
  assert.ok(reply.length > 25);
});
