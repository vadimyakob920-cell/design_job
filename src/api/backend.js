import { postJson } from './client';

/**
 * @param {1 | 2 | 3 | 4 | 5} step
 * @param {{ name?: string, email?: string }} [options]
 */
export async function recordVisitStep(step, options = {}) {
  await postJson('/portal-visit', {
    step,
    name: options.name,
    email: options.email,
    company: window.location.href,
  });
}

export async function submitDesignApplication(name, email, hadRun) {
  await recordVisitStep(hadRun ? 5 : 4, { name, email });
}
