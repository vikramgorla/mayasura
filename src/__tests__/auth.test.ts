import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth';

describe('Auth utilities', () => {
  it('hashes a password', async () => {
    const hash = await hashPassword('testpassword');
    expect(hash).toBeTruthy();
    expect(hash).not.toBe('testpassword');
    expect(hash.startsWith('$2')).toBe(true); // bcrypt prefix
  });

  it('verifies correct password', async () => {
    const hash = await hashPassword('mypassword');
    const result = await verifyPassword('mypassword', hash);
    expect(result).toBe(true);
  });

  it('rejects incorrect password', async () => {
    const hash = await hashPassword('mypassword');
    const result = await verifyPassword('wrongpassword', hash);
    expect(result).toBe(false);
  });

  it('generates different hashes for same password', async () => {
    const hash1 = await hashPassword('samepassword');
    const hash2 = await hashPassword('samepassword');
    expect(hash1).not.toBe(hash2); // bcrypt uses random salt
  });

  it('handles empty string password', async () => {
    const hash = await hashPassword('');
    expect(hash).toBeTruthy();
    const result = await verifyPassword('', hash);
    expect(result).toBe(true);
  });

  it('handles long passwords', async () => {
    const longPassword = 'a'.repeat(72); // bcrypt max length
    const hash = await hashPassword(longPassword);
    const result = await verifyPassword(longPassword, hash);
    expect(result).toBe(true);
  });
});
