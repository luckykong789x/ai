import { DraftIntegrator, CriticEvaluator } from '../integrator';

describe('DraftIntegrator', () => {
  let integrator: DraftIntegrator;

  beforeEach(() => {
    integrator = new DraftIntegrator();
  });

  test('should integrate drafts', async () => {
    const drafts = ['Draft 1', 'Draft 2'];
    const result = await integrator.integrate({ drafts });
    expect(result.unified).toBeDefined();
    expect(result.changeLog).toHaveLength(drafts.length);
  });
});

describe('CriticEvaluator', () => {
  let critic: CriticEvaluator;

  beforeEach(() => {
    critic = new CriticEvaluator();
  });

  test('should evaluate output', async () => {
    const output = 'Test output';
    const result = await critic.evaluate(output);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });
});
