(function attachPublicScoreEngine(global) {
  const engine = {
    flags: {
      dlShadowMode: false,
      dlPrimaryMode: false,
    },
    evaluateLegacyMetrics(metrics, legacyEvaluator) {
      return legacyEvaluator(metrics);
    },
    evaluatePhotoScores(metrics, options = {}) {
      const legacyEvaluator = options.legacyEvaluator;
      if (typeof legacyEvaluator !== "function") {
        throw new Error("legacyEvaluator is required");
      }

      const legacyScores = engine.evaluateLegacyMetrics(metrics, legacyEvaluator);
      return {
        activeEngine: "legacy",
        scores: legacyScores,
        shadowScores: null,
      };
    },
  };

  global.PhotoEvalScoreEngine = engine;
})(window);
