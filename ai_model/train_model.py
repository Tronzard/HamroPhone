"""
Train & Compare Multiple ML Models for Nepal Used Mobile Phone Price Prediction.

Models:
  1. Linear Regression (baseline)
  2. Ridge Regression (L2 regularized)
  3. Random Forest Regressor
  4. Gradient Boosting Regressor
  5. Support Vector Regressor (SVR)

Best model is automatically saved for use with predict.py.
"""

import pandas as pd
import numpy as np
import joblib
import os
import time
import warnings

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR

warnings.filterwarnings("ignore")

# ─── Configuration ───────────────────────────────────────────────────────────
DATASET_PATH = "nepal_used_phones.csv"
BEST_MODEL_PATH = "best_model.pkl"
SCALER_PATH = "price_scaler.pkl"
RESULTS_DIR = "results"
PLOTS_DIR = "plots"
TEST_SIZE = 0.2
RANDOM_STATE = 42

# Target column
TARGET = "used_price_npr"

# Feature columns
CATEGORICAL_COLS = ["device_brand", "model"]
NUMERICAL_COLS = ["ram", "internal_memory", "days_used", "battery_health", "screen_condition", "new_price_npr"]


def load_and_prepare(path: str):
    """Load dataset, split into features and target."""
    df = pd.read_csv(path)
    X = df.drop(TARGET, axis=1)
    y = df[TARGET]
    return X, y, df


def build_preprocessor():
    """Build the column transformer for preprocessing."""
    numerical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numerical_pipeline, NUMERICAL_COLS),
            ("cat", categorical_pipeline, CATEGORICAL_COLS),
        ]
    )
    return preprocessor


def get_models_and_params():
    """
    Return dict of:  model_name -> (Pipeline, param_grid)
    """
    preprocessor = build_preprocessor()

    models = {
        "Linear Regression": (
            Pipeline([("preprocessing", preprocessor), ("regressor", LinearRegression())]),
            {
                "regressor__fit_intercept": [True],
            }
        ),

        "Ridge Regression": (
            Pipeline([("preprocessing", preprocessor), ("regressor", Ridge())]),
            {
                "regressor__alpha": [0.1, 1.0, 10.0, 100.0],
                "regressor__fit_intercept": [True, False],
            }
        ),

        "Random Forest": (
            Pipeline([("preprocessing", preprocessor), ("regressor", RandomForestRegressor(random_state=RANDOM_STATE))]),
            {
                "regressor__n_estimators": [100, 200],
                "regressor__max_depth": [10, 20, None],
                "regressor__min_samples_split": [2, 5],
            }
        ),

        "Gradient Boosting": (
            Pipeline([("preprocessing", preprocessor), ("regressor", GradientBoostingRegressor(random_state=RANDOM_STATE))]),
            {
                "regressor__n_estimators": [100, 200],
                "regressor__learning_rate": [0.05, 0.1],
                "regressor__max_depth": [3, 5, 7],
            }
        ),

        "SVR": (
            Pipeline([("preprocessing", preprocessor), ("regressor", SVR())]),
            {
                "regressor__C": [1.0, 10.0, 100.0],
                "regressor__kernel": ["rbf"],
                "regressor__epsilon": [0.1, 0.2],
            }
        ),
    }

    return models


def evaluate_model(model, X_test, y_test):
    """Calculate evaluation metrics."""
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    return r2, mae, rmse, y_pred


def train_all_models(X_train, X_test, y_train, y_test):
    """Train all models with hyperparameter tuning and return results."""
    models = get_models_and_params()
    results = []

    print("\n" + "=" * 70)
    print("  TRAINING MODELS")
    print("=" * 70)

    best_score = -np.inf
    best_model = None
    best_model_name = ""
    best_predictions = None

    for name, (pipeline, param_grid) in models.items():
        print(f"\n🔄 Training: {name}...")
        start = time.time()

        grid = GridSearchCV(
            pipeline, param_grid, cv=5, scoring="r2",
            n_jobs=-1, verbose=0
        )
        grid.fit(X_train, y_train)

        elapsed = time.time() - start
        model = grid.best_estimator_

        r2, mae, rmse, y_pred = evaluate_model(model, X_test, y_test)

        results.append({
            "Model": name,
            "R2_Score": round(r2, 4),
            "MAE_NPR": round(mae, 0),
            "RMSE_NPR": round(rmse, 0),
            "Best_Params": str(grid.best_params_),
            "Train_Time_s": round(elapsed, 2),
        })

        print(f"   ✅ R² = {r2:.4f} | MAE = NPR {mae:,.0f} | RMSE = NPR {rmse:,.0f} | Time = {elapsed:.1f}s")
        print(f"   Best params: {grid.best_params_}")

        if r2 > best_score:
            best_score = r2
            best_model = model
            best_model_name = name
            best_predictions = y_pred

    return results, best_model, best_model_name, best_predictions


def print_comparison_table(results):
    """Print a formatted comparison table."""
    df = pd.DataFrame(results)
    df = df.sort_values("R2_Score", ascending=False).reset_index(drop=True)

    print("\n" + "=" * 70)
    print("  MODEL COMPARISON TABLE")
    print("=" * 70)
    print(df[["Model", "R2_Score", "MAE_NPR", "RMSE_NPR", "Train_Time_s"]].to_string(index=False))
    print("=" * 70)

    return df


def plot_model_comparison(results_df):
    """Generate comparison bar charts."""
    os.makedirs(PLOTS_DIR, exist_ok=True)

    fig, axes = plt.subplots(1, 3, figsize=(20, 6))
    models = results_df["Model"]
    colors = sns.color_palette("viridis", len(models))

    # R² Score
    bars = axes[0].bar(models, results_df["R2_Score"], color=colors, edgecolor="white")
    axes[0].set_title("R² Score (Higher is Better)", fontweight="bold")
    axes[0].set_ylabel("R² Score")
    axes[0].set_ylim(0, 1.05)
    axes[0].tick_params(axis="x", rotation=35)
    for bar, val in zip(bars, results_df["R2_Score"]):
        axes[0].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
                     f"{val:.4f}", ha="center", fontsize=9, fontweight="bold")

    # MAE
    bars = axes[1].bar(models, results_df["MAE_NPR"], color=colors, edgecolor="white")
    axes[1].set_title("Mean Absolute Error (Lower is Better)", fontweight="bold")
    axes[1].set_ylabel("MAE (NPR)")
    axes[1].tick_params(axis="x", rotation=35)
    for bar, val in zip(bars, results_df["MAE_NPR"]):
        axes[1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 100,
                     f"NPR {val:,.0f}", ha="center", fontsize=8, fontweight="bold")

    # RMSE
    bars = axes[2].bar(models, results_df["RMSE_NPR"], color=colors, edgecolor="white")
    axes[2].set_title("Root Mean Squared Error (Lower is Better)", fontweight="bold")
    axes[2].set_ylabel("RMSE (NPR)")
    axes[2].tick_params(axis="x", rotation=35)
    for bar, val in zip(bars, results_df["RMSE_NPR"]):
        axes[2].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 100,
                     f"NPR {val:,.0f}", ha="center", fontsize=8, fontweight="bold")

    plt.suptitle("Model Performance Comparison — Nepal Used Phone Price Prediction", fontsize=14, fontweight="bold", y=1.02)
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "model_comparison.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("\n✅ Saved: plots/model_comparison.png")


def plot_actual_vs_predicted(y_test, y_pred, model_name):
    """Plot actual vs predicted scatter plot."""
    os.makedirs(PLOTS_DIR, exist_ok=True)

    fig, ax = plt.subplots(figsize=(8, 8))
    ax.scatter(y_test, y_pred, alpha=0.4, s=20, color="#3498DB", edgecolors="none")

    # Perfect prediction line
    max_val = max(y_test.max(), max(y_pred))
    ax.plot([0, max_val], [0, max_val], "r--", linewidth=2, label="Perfect Prediction")

    ax.set_title(f"Actual vs Predicted Price — {model_name}", fontweight="bold")
    ax.set_xlabel("Actual Price (NPR)")
    ax.set_ylabel("Predicted Price (NPR)")
    ax.legend()
    ax.set_aspect("equal")

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "actual_vs_predicted.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("✅ Saved: plots/actual_vs_predicted.png")


def plot_residuals(y_test, y_pred, model_name):
    """Plot residual analysis."""
    os.makedirs(PLOTS_DIR, exist_ok=True)
    residuals = y_test - y_pred

    fig, axes = plt.subplots(1, 2, figsize=(16, 6))

    # Residual scatter
    axes[0].scatter(y_pred, residuals, alpha=0.4, s=20, color="#E67E22", edgecolors="none")
    axes[0].axhline(y=0, color="red", linestyle="--", linewidth=1.5)
    axes[0].set_title(f"Residual Plot — {model_name}", fontweight="bold")
    axes[0].set_xlabel("Predicted Price (NPR)")
    axes[0].set_ylabel("Residual (Actual - Predicted)")

    # Residual distribution
    axes[1].hist(residuals, bins=40, color="#9B59B6", edgecolor="white", alpha=0.85)
    axes[1].axvline(x=0, color="red", linestyle="--", linewidth=1.5)
    axes[1].set_title(f"Residual Distribution — {model_name}", fontweight="bold")
    axes[1].set_xlabel("Residual (NPR)")
    axes[1].set_ylabel("Count")

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "residual_analysis.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("✅ Saved: plots/residual_analysis.png")


def main():
    os.makedirs(RESULTS_DIR, exist_ok=True)
    os.makedirs(PLOTS_DIR, exist_ok=True)

    # 1. Load data
    print("\n📂 Loading dataset...")
    X, y, df = load_and_prepare(DATASET_PATH)
    print(f"   Samples: {len(df)} | Features: {X.shape[1]} | Target: {TARGET}")

    # 2. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    print(f"   Train: {len(X_train)} | Test: {len(X_test)}")

    # 3. Train all models
    results, best_model, best_model_name, best_predictions = train_all_models(
        X_train, X_test, y_train, y_test
    )

    # 4. Comparison table
    results_df = print_comparison_table(results)
    results_df.to_csv(os.path.join(RESULTS_DIR, "model_comparison.csv"), index=False)
    print(f"\n💾 Saved: results/model_comparison.csv")

    # 5. Save best model
    print(f"\n🏆 Best Model: {best_model_name}")
    joblib.dump(best_model, BEST_MODEL_PATH)
    joblib.dump({"model_name": best_model_name}, SCALER_PATH)
    print(f"💾 Saved: {BEST_MODEL_PATH}")

    # 6. Generate plots
    print("\n📊 Generating plots...")
    plot_model_comparison(results_df)
    plot_actual_vs_predicted(y_test, best_predictions, best_model_name)
    plot_residuals(y_test, best_predictions, best_model_name)

    print("\n" + "=" * 70)
    print(f"  ✅ TRAINING COMPLETE!")
    print(f"  🏆 Best Model: {best_model_name}")
    print(f"  📁 Model saved to: {BEST_MODEL_PATH}")
    print(f"  📊 Plots saved to: {PLOTS_DIR}/")
    print(f"  📋 Results saved to: {RESULTS_DIR}/")
    print("=" * 70)


if __name__ == "__main__":
    main()
