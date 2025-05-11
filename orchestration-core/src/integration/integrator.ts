/**
 * Integrator - Merges drafts from multiple AIs into a unified output
 */

export interface IntegratorInput {
  drafts: string[];
  history?: string; // Compressed context
}

export interface IntegratorOutput {
  unified: string;
  change_log: string;
}

export class Integrator {
  /**
   * Integrate multiple drafts into a unified output
   * 
   * @param input Integrator input with drafts and optional history
   * @returns Integrated output
   */
  async integrate(input: IntegratorInput): Promise<IntegratorOutput> {
    const { drafts, history } = input;
    
    if (!drafts.length) {
      throw new Error('No drafts provided for integration');
    }
    
    if (drafts.length === 1) {
      return {
        unified: drafts[0],
        change_log: 'Single draft used, no integration needed'
      };
    }
    
    const unified = this.mergeDrafts(drafts);
    
    return {
      unified,
      change_log: `Integrated ${drafts.length} drafts`
    };
  }
  
  /**
   * Merge multiple drafts into a unified output
   * 
   * @param drafts Drafts to merge
   * @returns Merged draft
   */
  private mergeDrafts(drafts: string[]): string {
    
    let baseDraft = '';
    let maxLength = 0;
    
    for (const draft of drafts) {
      if (draft.length > maxLength) {
        maxLength = draft.length;
        baseDraft = draft;
      }
    }
    
    return baseDraft;
  }
}
