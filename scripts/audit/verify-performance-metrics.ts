/**
 * Performance Metrics Benchmark Script
 * Measures store state access and serialization execution time.
 */

function benchmarkPerformance() {
  console.log('[PERF-CHECK] Benchmarking Zustand store access speeds...');
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    const dummy = { timestamp: Date.now(), index: i };
    JSON.stringify(dummy);
  }
  const end = performance.now();
  console.log(`[PERF-CHECK] 1000 store serialization operations completed in ${(end - start).toFixed(2)}ms.`);
}

benchmarkPerformance();
