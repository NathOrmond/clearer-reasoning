"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import { NumericFormat } from "react-number-format";

interface Hypothesis {
  name: string;
  prior: number;
  color: string;
}

interface Likelihood {
  [hypothesisName: string]: number;
}

interface Evidence {
  name: string;
  marginal: number;
  likelihoods: Likelihood;
}

interface Posteriors {
  [hypothesisName: string]: number;
}

interface UpdateStep {
  step: number;
  evidence: string;
  posteriors: Posteriors;
}

interface ValidationState {
  priorsSum: number;
  marginalsMissing: boolean;
  likelihoodsValid: boolean;
  message: string;
}

const BayesianUpdater: React.FC = (): JSX.Element => {
  // State for hypotheses and their priors
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([
    { name: "", prior: 0, color: "#1976d2" },
  ]);

  // State for evidence
  const [evidence, setEvidence] = useState<Evidence[]>([
    {
      name: "",
      marginal: 0,
      likelihoods: {},
    },
  ]);

  // Marginal Helper Component
  const MarginalHelper: React.FC<{ evidence: Evidence }> = ({
    evidence,
  }): JSX.Element => {
    const expected = hypotheses.reduce((sum, h) => {
      return sum + (evidence.likelihoods[h.name] || 0) * h.prior;
    }, 0);

    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Given current likelihoods and priors:
        <br />
        Expected P(E) = {expected.toFixed(3)} from total probability theorem
        <br />
        {expected !== evidence.marginal &&
          evidence.marginal !== 0 &&
          `Warning: Current value ${evidence.marginal} differs from expected ${expected.toFixed(3)}`}
      </Typography>
    );
  };

  // State for tracking update steps
  const [updateSteps, setUpdateSteps] = useState<UpdateStep[]>([]);

  // Validation state
  const [validation, setValidation] = useState<ValidationState>({
    priorsSum: 0,
    marginalsMissing: true,
    likelihoodsValid: true,
    message: "",
  });

  // Validation effect
  useEffect(() => {
    validateAll();
  }, [hypotheses, evidence]);

  // Generate a random color for new hypotheses
  const generateColor = (): string => {
    const colors = [
      "#1976d2",
      "#dc004e",
      "#388e3c",
      "#f57c00",
      "#7b1fa2",
      "#1565c0",
    ];
    return colors[hypotheses.length % colors.length];
  };

  // Comprehensive validation
  const validateAll = (): void => {
    const priorsSum = hypotheses.reduce((acc, h) => acc + Number(h.prior), 0);

    const marginalsMissing = evidence.some((e) => !e.marginal);

    // Check Kolmogorov's axioms and collect detailed validation messages
    const validationMessages: string[] = [];
    let likelihoodsValid = true;

    evidence.forEach((e, idx) => {
      if (!e.name) return; // Skip validation for empty evidence entries

      // 1. Non-negativity
      const negativeValues = Object.entries(e.likelihoods).filter(
        ([_, val]) => val < 0
      );
      if (negativeValues.length > 0) {
        validationMessages.push(
          `Evidence "${e.name}": Probabilities cannot be negative`
        );
        likelihoodsValid = false;
      }

      // 2. Bounded by 1
      const outOfBoundValues = Object.entries(e.likelihoods).filter(
        ([_, val]) => val > 1
      );
      if (outOfBoundValues.length > 0) {
        validationMessages.push(
          `Evidence "${e.name}": Probabilities cannot be greater than 1`
        );
        likelihoodsValid = false;
      }

      // 3. Marginal probability consistency
      if (e.marginal <= 0 || e.marginal > 1) {
        validationMessages.push(
          `Evidence "${e.name}": Marginal probability must be between 0 and 1`
        );
        likelihoodsValid = false;
      }

      // 4. Total probability theorem check
      const totalProbability = hypotheses.reduce((sum, h) => {
        return sum + (e.likelihoods[h.name] || 0) * h.prior;
      }, 0);

      if (Math.abs(totalProbability - e.marginal) > 0.0001) {
        validationMessages.push(
          `Evidence "${e.name}": Marginal P(E)=${e.marginal} doesn't match ∑P(E|H)P(H)=${totalProbability.toFixed(3)}`
        );
        likelihoodsValid = false;
      }
    });

    let message = "";
    if (Math.abs(priorsSum - 1) > 0.0001) {
      message = `Priors sum to ${priorsSum.toFixed(3)}, must sum to 1`;
    } else if (marginalsMissing) {
      message = "Please fill in all marginal probabilities";
    } else if (!likelihoodsValid) {
      message = validationMessages.join("\n");
    }

    setValidation({
      priorsSum,
      marginalsMissing,
      likelihoodsValid,
      message,
    });
  };

  // Add/remove hypothesis handlers
  const addHypothesis = (): void => {
    setHypotheses([
      ...hypotheses,
      { name: "", prior: 0, color: generateColor() },
    ]);
  };

  const removeHypothesis = (index: number): void => {
    const newHypotheses = hypotheses.filter((_, i) => i !== index);
    setHypotheses(newHypotheses);
  };

  // Add/remove evidence handlers
  const addEvidence = (): void => {
    setEvidence([
      ...evidence,
      {
        name: "",
        marginal: 0,
        likelihoods: hypotheses.reduce<Likelihood>(
          (acc, h) => ({
            ...acc,
            [h.name]: 0,
          }),
          {}
        ),
      },
    ]);
  };

  const removeEvidence = (index: number): void => {
    const newEvidence = evidence.filter((_, i) => i !== index);
    setEvidence(newEvidence);
  };

  // Update handlers
  const updateHypothesis = (
    index: number,
    field: keyof Hypothesis,
    value: string | number
  ): void => {
    const newHypotheses = [...hypotheses];
    if (field === "prior") {
      newHypotheses[index].prior =
        typeof value === "string"
          ? value === ""
            ? 0
            : value === "0."
              ? 0
              : Number(value)
          : value;
    } else if (field === "name") {
      newHypotheses[index].name = String(value);
    }
    setHypotheses(newHypotheses);
  };

  const updateEvidence = (
    index: number,
    field: keyof Evidence,
    value: string | number,
    hypothesisName?: string
  ): void => {
    const newEvidence = [...evidence];
    if (hypothesisName) {
      newEvidence[index].likelihoods[hypothesisName] = Number(value);
    } else if (field === "marginal") {
      newEvidence[index].marginal = Number(value);
    } else if (field === "name") {
      newEvidence[index].name = String(value);
    }
    setEvidence(newEvidence);
  };

  // Compute Bayesian updates
  const computeUpdates = (): void => {
    let currentPosteriors = hypotheses.reduce<Posteriors>(
      (acc, h) => ({
        ...acc,
        [h.name]: h.prior,
      }),
      {}
    );

    const steps = evidence.map((e, idx) => {
      const posteriors: Posteriors = {};

      // Compute posterior for each hypothesis
      for (const h of hypotheses) {
        const prior = currentPosteriors[h.name];
        const likelihood = e.likelihoods[h.name];
        const posterior = (likelihood * prior) / e.marginal;
        posteriors[h.name] = posterior;
      }

      currentPosteriors = posteriors;

      return {
        step: idx + 1,
        evidence: e.name,
        posteriors,
      };
    });

    setUpdateSteps([
      {
        step: 0,
        evidence: "Prior",
        posteriors: hypotheses.reduce<Posteriors>(
          (acc, h) => ({
            ...acc,
            [h.name]: h.prior,
          }),
          {}
        ),
      },
      ...steps,
    ]);
  };

  // Render geometric visualization
  const renderVisualization = (): JSX.Element => {
    return (
      <Stack spacing={2}>
        {updateSteps.map((step, idx) => (
          <Paper key={idx} elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Step {step.step}: {step.evidence}
            </Typography>
            <Stack spacing={1}>
              {hypotheses.map((h) => (
                <Box key={h.name}>
                  <Typography variant="body2">{h.name}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        height: 24,
                        width: `${step.posteriors[h.name] * 100}%`,
                        bgcolor: h.color,
                        transition: "width 0.5s ease-in-out",
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="body2">
                      {(step.posteriors[h.name] * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bayesian Updater
      </Typography>

      {/* Validation Status */}
      <Box sx={{ mb: 2 }}>
        {validation.message ? (
          <Alert severity="warning">
            <AlertTitle>Validation Warning</AlertTitle>
            {validation.message}
          </Alert>
        ) : (
          <Alert severity="success">
            <AlertTitle>All Probability Constraints Satisfied</AlertTitle>
            Priors sum to 1 and all probability axioms are satisfied
          </Alert>
        )}
      </Box>

      {/* Hypotheses Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Hypotheses and Priors
          <Typography variant="body2" color="text.secondary">
            Sum of priors: {validation.priorsSum.toFixed(3)}
          </Typography>
        </Typography>
        {hypotheses.map((h, idx) => (
          <Grid container spacing={2} key={idx} sx={{ mb: 2 }}>
            <Grid item xs={5}>
              <TextField
                label="Hypothesis Name"
                value={h.name}
                onChange={(e) => updateHypothesis(idx, "name", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={5}>
              <NumericFormat
                customInput={TextField}
                label="Prior Probability"
                value={h.prior}
                decimalScale={4}
                allowNegative={false}
                allowLeadingZeros
                onFocus={(e) => e.target.select()} // Select all text on focus
                onValueChange={(values) => {
                  updateHypothesis(idx, "prior", values.floatValue || 0);
                }}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return (
                    floatValue === undefined ||
                    (floatValue >= 0 && floatValue <= 1)
                  );
                }}
                fullWidth
                error={Math.abs(validation.priorsSum - 1) > 0.0001}
                helperText={
                  Math.abs(validation.priorsSum - 1) > 0.0001
                    ? "Priors must sum to 1"
                    : ""
                }
                required
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={() => removeHypothesis(idx)}
                color="error"
                variant="outlined"
                disabled={hypotheses.length <= 2}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button onClick={addHypothesis} variant="contained">
          Add Hypothesis
        </Button>
      </Paper>

      {/* Evidence Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Evidence
        </Typography>
        {evidence.map((e, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 4,
              p: 4,
              border: 1,
              borderColor: "grey.300",
              borderRadius: 1,
            }}
          >
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  label="Evidence Name"
                  value={e.name}
                  onChange={(evt) =>
                    updateEvidence(idx, "name", evt.target.value)
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <NumericFormat
                  customInput={TextField}
                  label="Marginal Probability"
                  value={e.marginal}
                  decimalScale={4}
                  allowNegative={true} // Allow negative numbers
                  allowLeadingZeros
                  onFocus={(e) => e.target.select()} // Select all text on focus
                  onValueChange={(values) => {
                    updateEvidence(idx, "marginal", values.floatValue || 0);
                  }}
                  fullWidth
                  error={!validation.likelihoodsValid}
                  helperText={
                    !validation.likelihoodsValid
                      ? "Check probability consistency"
                      : ""
                  }
                  required
                />
                <MarginalHelper evidence={e} />
              </Grid>
              <Grid item xs={2}>
                <Button
                  onClick={() => removeEvidence(idx)}
                  color="error"
                  variant="outlined"
                >
                  Remove
                </Button>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom>
              Likelihoods P(E|H)
            </Typography>
            <Grid container spacing={2}>
              {hypotheses.map((h, hidx) => (
                <Grid item xs={4} key={hidx}>
                  <NumericFormat
                    customInput={TextField}
                    label={`P(${e.name}|${h.name})`}
                    value={e.likelihoods[h.name] || 0}
                    decimalScale={4}
                    allowNegative={true} // Allow negative numbers
                    allowLeadingZeros
                    onFocus={(e) => e.target.select()} // Select all text on focus
                    onValueChange={(values) => {
                      updateEvidence(
                        idx,
                        "likelihoods",
                        values.floatValue || 0,
                        h.name
                      );
                    }}
                    fullWidth
                    error={!validation.likelihoodsValid}
                    required
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        <Button onClick={addEvidence} variant="contained">
          Add Evidence
        </Button>
      </Paper>

      {/* Validation and Computation */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={computeUpdates}
          disabled={!!validation.message}
        >
          Compute Updates
        </Button>
      </Box>

      {/* Visualization */}
      {updateSteps.length > 0 && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Update Visualization
          </Typography>
          {renderVisualization()}
        </Paper>
      )}
    </Box>
  );
};

export default BayesianUpdater;
