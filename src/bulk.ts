import { extractOpenGraphAsync } from "./index";
import type { IExtractOpenGraphOptions as IAsyncExtractOptions, IBulkOptions, IExtractionResult } from "./types";

/**
 * Result for a single URL extraction in bulk processing
 */
export interface IBulkResult {
  url: string;
  success: boolean;
  data?: IExtractionResult;
  error?: Error;
  timestamp: Date;
  duration: number; // milliseconds
}

/**
 * Result for bulk extraction
 */
export interface IBulkExtractionResult {
  results: IBulkResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    totalDuration: number;
    averageDuration: number;
  };
}

/**
 * Simple concurrency limiter state
 */
interface ConcurrencyState {
  running: number;
  queue: Array<() => void>;
  concurrency: number;
}

/**
 * Create a new concurrency limiter state
 */
function createConcurrencyLimiter(concurrency: number): ConcurrencyState {
  return {
    running: 0,
    queue: [],
    concurrency,
  };
}

/**
 * Run a function with concurrency control
 */
async function runWithConcurrency<T>(state: ConcurrencyState, fn: () => Promise<T>): Promise<T> {
  while (state.running >= state.concurrency) {
    await new Promise<void>((resolve) => state.queue.push(resolve));
  }

  state.running++;
  try {
    return await fn();
  } finally {
    state.running--;
    const next = state.queue.shift();
    if (next) next();
  }
}

/**
 * Extract Open Graph data from multiple URLs with concurrency control
 */
export async function extractOpenGraphBulk(
  options: IBulkOptions,
  extractOptions?: IAsyncExtractOptions,
): Promise<IBulkExtractionResult> {
  const { urls, concurrency = 5, rateLimit, onProgress, onError, continueOnError = true } = options;

  // Create concurrency limiter
  const limiter = createConcurrencyLimiter(concurrency);

  // Rate limiting setup
  let requestCount = 0;
  let windowStart = Date.now();
  const checkRateLimit = async () => {
    if (rateLimit) {
      requestCount++;
      const elapsed = Date.now() - windowStart;

      if (requestCount >= rateLimit.requests) {
        if (elapsed < rateLimit.window) {
          // Wait for the remaining time in the window
          const waitTime = rateLimit.window - elapsed;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
        // Reset the window
        requestCount = 0;
        windowStart = Date.now();
      }
    }
  };

  const results: IBulkResult[] = [];
  let completed = 0;

  // Process URLs
  const promises = urls.map((url) =>
    runWithConcurrency(limiter, async () => {
      const startTime = Date.now();
      const result: IBulkResult = {
        url,
        success: false,
        timestamp: new Date(),
        duration: 0,
      };

      try {
        // Check rate limit before making request
        await checkRateLimit();

        // Extract Open Graph data
        const data = await extractOpenGraphAsync(url, extractOptions);
        result.success = true;
        result.data = data;
      } catch (error) {
        result.success = false;
        result.error = error instanceof Error ? error : new Error(String(error));

        if (onError) {
          onError(url, result.error);
        }

        if (!continueOnError) {
          throw result.error;
        }
      } finally {
        result.duration = Date.now() - startTime;
        results.push(result);
        completed++;

        if (onProgress) {
          onProgress(completed, urls.length, url);
        }
      }

      return result;
    }),
  );

  try {
    await Promise.all(promises);
  } catch (error) {
    // If continueOnError is false, we'll get here
    // Results array will contain partial results
  }

  // Calculate summary statistics
  const successful = results.filter((r) => r.success).length;
  const failed = results.length - successful;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const averageDuration = results.length > 0 ? totalDuration / results.length : 0;

  return {
    results,
    summary: {
      total: results.length,
      successful,
      failed,
      totalDuration,
      averageDuration,
    },
  };
}
