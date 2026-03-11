"""
Data Exploration & Visualization for Nepal Used Mobile Phone Dataset.
Generates plots saved to the 'plots/' directory.
"""

import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import os

DATASET_PATH = "nepal_used_phones.csv"
PLOTS_DIR = "plots"


def setup():
    os.makedirs(PLOTS_DIR, exist_ok=True)
    plt.style.use("seaborn-v0_8-darkgrid")
    sns.set_palette("husl")
    plt.rcParams.update({
        "figure.figsize": (12, 8),
        "font.size": 12,
        "axes.titlesize": 14,
        "axes.labelsize": 12,
    })


def basic_info(df: pd.DataFrame):
    print("=" * 60)
    print("  DATASET OVERVIEW")
    print("=" * 60)

    print(f"\n📊 Shape: {df.shape[0]} rows × {df.shape[1]} columns")
    print(f"\n📋 Columns & Data Types:")
    print(df.dtypes.to_string())

    print(f"\n📈 Statistical Summary:")
    print(df.describe().round(2).to_string())

    print(f"\n❓ Missing Values:")
    missing = df.isnull().sum()
    if missing.sum() == 0:
        print("   None — dataset is complete!")
    else:
        print(missing[missing > 0].to_string())

    print(f"\n📱 Brand Distribution:")
    print(df["device_brand"].value_counts().to_string())


def plot_price_distribution(df: pd.DataFrame):
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))

    # New price distribution
    axes[0].hist(df["new_price_npr"], bins=30, color="#4A90D9", edgecolor="white", alpha=0.85)
    axes[0].set_title("New Phone Price Distribution (NPR)", fontweight="bold")
    axes[0].set_xlabel("Price (NPR)")
    axes[0].set_ylabel("Count")
    axes[0].axvline(df["new_price_npr"].mean(), color="#E74C3C", linestyle="--", label=f'Mean: NPR {df["new_price_npr"].mean():,.0f}')
    axes[0].legend()

    # Used price distribution
    axes[1].hist(df["used_price_npr"], bins=30, color="#2ECC71", edgecolor="white", alpha=0.85)
    axes[1].set_title("Used Phone Price Distribution (NPR)", fontweight="bold")
    axes[1].set_xlabel("Price (NPR)")
    axes[1].set_ylabel("Count")
    axes[1].axvline(df["used_price_npr"].mean(), color="#E74C3C", linestyle="--", label=f'Mean: NPR {df["used_price_npr"].mean():,.0f}')
    axes[1].legend()

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "price_distribution.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("✅ Saved: price_distribution.png")


def plot_brand_analysis(df: pd.DataFrame):
    fig, axes = plt.subplots(1, 2, figsize=(18, 7))

    # Brand count
    brand_counts = df["device_brand"].value_counts()
    colors = sns.color_palette("husl", len(brand_counts))
    axes[0].barh(brand_counts.index, brand_counts.values, color=colors, edgecolor="white")
    axes[0].set_title("Number of Phones per Brand", fontweight="bold")
    axes[0].set_xlabel("Count")
    axes[0].invert_yaxis()

    # Average used price by brand
    brand_avg = df.groupby("device_brand")["used_price_npr"].mean().sort_values(ascending=True)
    colors2 = sns.color_palette("coolwarm", len(brand_avg))
    axes[1].barh(brand_avg.index, brand_avg.values, color=colors2, edgecolor="white")
    axes[1].set_title("Average Used Price by Brand (NPR)", fontweight="bold")
    axes[1].set_xlabel("Average Price (NPR)")
    for i, v in enumerate(brand_avg.values):
        axes[1].text(v + 500, i, f"NPR {v:,.0f}", va="center", fontsize=9)
    axes[1].invert_yaxis()

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "brand_analysis.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("✅ Saved: brand_analysis.png")


def plot_correlation_heatmap(df: pd.DataFrame):
    numerical_cols = df.select_dtypes(include=[np.number]).columns
    corr = df[numerical_cols].corr()

    fig, ax = plt.subplots(figsize=(10, 8))
    mask = np.triu(np.ones_like(corr, dtype=bool))
    sns.heatmap(
        corr, mask=mask, annot=True, fmt=".2f", cmap="RdYlBu_r",
        center=0, square=True, linewidths=1,
        cbar_kws={"shrink": 0.8}, ax=ax
    )
    ax.set_title("Feature Correlation Heatmap", fontweight="bold", pad=20)

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "correlation_heatmap.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("✅ Saved: correlation_heatmap.png")


def plot_depreciation_scatter(df: pd.DataFrame):
    fig, axes = plt.subplots(1, 3, figsize=(20, 6))

    # Price vs Days Used
    scatter = axes[0].scatter(
        df["days_used"], df["used_price_npr"],
        c=df["battery_health"], cmap="RdYlGn", alpha=0.5, s=20, edgecolors="none"
    )
    axes[0].set_title("Used Price vs Days Used", fontweight="bold")
    axes[0].set_xlabel("Days Used")
    axes[0].set_ylabel("Used Price (NPR)")
    plt.colorbar(scatter, ax=axes[0], label="Battery Health")

    # Price vs Battery Health
    axes[1].scatter(
        df["battery_health"], df["used_price_npr"],
        color="#3498DB", alpha=0.4, s=20, edgecolors="none"
    )
    axes[1].set_title("Used Price vs Battery Health", fontweight="bold")
    axes[1].set_xlabel("Battery Health")
    axes[1].set_ylabel("Used Price (NPR)")

    # New Price vs Used Price
    axes[2].scatter(
        df["new_price_npr"], df["used_price_npr"],
        color="#E67E22", alpha=0.4, s=20, edgecolors="none"
    )
    # Add diagonal reference line
    max_price = max(df["new_price_npr"].max(), df["used_price_npr"].max())
    axes[2].plot([0, max_price], [0, max_price], "k--", alpha=0.3, label="No depreciation")
    axes[2].set_title("New Price vs Used Price", fontweight="bold")
    axes[2].set_xlabel("New Price (NPR)")
    axes[2].set_ylabel("Used Price (NPR)")
    axes[2].legend()

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "depreciation_scatter.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("✅ Saved: depreciation_scatter.png")


def plot_boxplot_by_brand(df: pd.DataFrame):
    fig, ax = plt.subplots(figsize=(14, 7))

    brand_order = df.groupby("device_brand")["used_price_npr"].median().sort_values(ascending=False).index
    sns.boxplot(
        data=df, x="device_brand", y="used_price_npr",
        order=brand_order, palette="Set2", ax=ax
    )
    ax.set_title("Used Price Distribution by Brand (NPR)", fontweight="bold")
    ax.set_xlabel("Brand")
    ax.set_ylabel("Used Price (NPR)")
    ax.tick_params(axis="x", rotation=45)

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "price_boxplot_by_brand.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("✅ Saved: price_boxplot_by_brand.png")


def plot_screen_battery_impact(df: pd.DataFrame):
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    # Screen condition impact
    screen_data = df.groupby("screen_condition")["used_price_npr"].mean()
    labels = ["Damaged (0)", "Good (1)"]
    colors = ["#E74C3C", "#2ECC71"]
    axes[0].bar(labels, screen_data.values, color=colors, edgecolor="white", width=0.5)
    axes[0].set_title("Avg Price by Screen Condition", fontweight="bold")
    axes[0].set_ylabel("Average Used Price (NPR)")
    for i, v in enumerate(screen_data.values):
        axes[0].text(i, v + 500, f"NPR {v:,.0f}", ha="center", fontweight="bold")

    # Battery health bins
    df_temp = df.copy()
    df_temp["battery_bin"] = pd.cut(
        df_temp["battery_health"],
        bins=[0, 0.6, 0.7, 0.8, 0.9, 1.0],
        labels=["<60%", "60-70%", "70-80%", "80-90%", "90-100%"]
    )
    battery_avg = df_temp.groupby("battery_bin", observed=True)["used_price_npr"].mean()
    axes[1].bar(battery_avg.index.astype(str), battery_avg.values, color=sns.color_palette("YlOrRd_r", len(battery_avg)), edgecolor="white")
    axes[1].set_title("Avg Price by Battery Health Range", fontweight="bold")
    axes[1].set_ylabel("Average Used Price (NPR)")
    axes[1].tick_params(axis="x", rotation=30)

    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, "screen_battery_impact.png"), dpi=150, bbox_inches="tight")
    plt.close()
    print("✅ Saved: screen_battery_impact.png")


def main():
    print("\n🔍 Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    basic_info(df)
    setup()

    print(f"\n📊 Generating visualizations in '{PLOTS_DIR}/' ...")
    plot_price_distribution(df)
    plot_brand_analysis(df)
    plot_correlation_heatmap(df)
    plot_depreciation_scatter(df)
    plot_boxplot_by_brand(df)
    plot_screen_battery_impact(df)

    print(f"\n✅ All plots saved to '{PLOTS_DIR}/' folder!")
    print("=" * 60)


if __name__ == "__main__":
    main()
