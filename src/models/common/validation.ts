/**
 * Validation result interfaces and utilities
 */

export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Common validation rules
 */
export class ValidationRules {
  static readonly TASK_TITLE_MIN_LENGTH = 3;
  static readonly TASK_TITLE_MAX_LENGTH = 200;
  
  static isValidTaskTitle(title: string): ValidationError | null {
    if (!title || typeof title !== 'string') {
      return {
        field: 'title',
        message: 'Title is required and must be a string',
        code: 'TITLE_REQUIRED'
      };
    }

    const trimmed = title.trim();
    
    if (trimmed.length < this.TASK_TITLE_MIN_LENGTH) {
      return {
        field: 'title',
        message: `Title must be at least ${this.TASK_TITLE_MIN_LENGTH} characters`,
        code: 'TITLE_TOO_SHORT'
      };
    }

    if (trimmed.length > this.TASK_TITLE_MAX_LENGTH) {
      return {
        field: 'title',
        message: `Title must be less than ${this.TASK_TITLE_MAX_LENGTH} characters`,
        code: 'TITLE_TOO_LONG'
      };
    }

    return null;
  }

  static isValidBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  static isValidPositiveInteger(value: any): boolean {
    return Number.isInteger(value) && value > 0;
  }

  static sanitizeString(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }
}