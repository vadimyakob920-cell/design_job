import { postJson } from './client';

export async function submitDesignApplication(name, email, hadRun) {
  await postJson('/design-application', { name, email, hadRun });
}
