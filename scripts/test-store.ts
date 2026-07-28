// Mock localStorage for Node environment
const storage: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, val: string) => { storage[key] = val; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => {
    Object.keys(storage).forEach(k => delete storage[k]);
  }
};

async function runTest() {
  const { useAuthorityPackStore } = await import('../src/features/authority-pack/store/useAuthorityPackStore');
  const store = useAuthorityPackStore;

  console.log("--- Initial Store Population ---");
  store.getState().updateNotes([{ id: 'n1', packId: 'p1', sectionId: 's1', content: 'hello', createdAt: '', updatedAt: '' }]);
  store.getState().updateBookmarks([{ id: 'b1', packId: 'p1', sectionId: 's1', createdAt: '', updatedAt: '' }]);
  store.getState().updateProgress(['action-1', 'action-2']);
  
  // Set transient state
  store.getState().updateWorkspace({ 
    pack: { id: 'test', version: '1', status: 'draft', createdAt: '', updatedAt: '', executiveSummary: null, strategicPillars: [], actionPlan: [] } as any
  });
  store.getState().updateSession({ activeSectionId: 's1' });
  store.getState().updateGeneration({ isGenerating: true });

  console.log("State populated.");
  console.log("- notes:", store.getState().notes.length);
  console.log("- bookmarks:", store.getState().bookmarks.length);
  console.log("- activeSection:", store.getState().activeSectionId);
  console.log("- isGenerating:", store.getState().isGenerating);
  console.log("- pack (transient):", store.getState().pack ? 'exists' : 'null');

  // Wait a tick for Zustand to write to localStorage
  await new Promise(r => setTimeout(r, 100));

  console.log("\n--- Simulating Page Refresh ---");
  const storedDataStr = storage['authority-pack-storage'];
  const storedData = JSON.parse(storedDataStr || '{}');
  console.log("LocalStorage keys persisted:", Object.keys(storedData.state || {}));

  // Reset memory to simulate fresh load
  store.getState().reset();
  
  // reset() overwrites the localStorage because of Zustand persist, so restore it for our rehydrate test
  storage['authority-pack-storage'] = storedDataStr;

  console.log("\nAfter in-memory reset():");
  console.log("- notes:", store.getState().notes.length);
  console.log("- pack:", store.getState().pack ? 'exists' : 'null');
  console.log("- activeSection:", store.getState().activeSectionId);

  // Rehydrate from localStorage
  await store.persist.rehydrate();

  console.log("\nAfter rehydrate():");
  const state = store.getState();
  console.log("- notes:", state.notes.length, state.notes.length === 1 ? '✅' : '❌');
  console.log("- bookmarks:", state.bookmarks.length, state.bookmarks.length === 1 ? '✅' : '❌');
  console.log("- progress:", state.completedActions.length, state.completedActions.length === 2 ? '✅' : '❌');
  console.log("- activeSection:", state.activeSectionId, state.activeSectionId === null ? '✅' : '❌');
  console.log("- isGenerating:", state.isGenerating, state.isGenerating === false ? '✅' : '❌');
  console.log("- pack:", state.pack ? 'exists' : 'null', state.pack === null ? '✅' : '❌');

  if (
    state.notes.length === 1 &&
    state.bookmarks.length === 1 &&
    state.completedActions.length === 2 &&
    state.activeSectionId === null &&
    state.isGenerating === false &&
    state.pack === null
  ) {
    console.log("\n✅ ALL REGRESSION TESTS PASSED!");
  } else {
    console.log("\n❌ REGRESSION TEST FAILED!");
    process.exit(1);
  }
}

runTest().catch(console.error);
