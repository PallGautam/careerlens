import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score
import joblib
import json

df = pd.read_csv("placement_dataset.csv")

FEATURES = ["cgpa", "num_skills", "skill_score", "has_dsa", "has_python",
            "has_sql", "has_system_design", "alumni_count"]
X = df[FEATURES]
y = df["placed"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

results = {}

lr = LogisticRegression(max_iter=1000)
lr.fit(X_train, y_train)
lr_preds = lr.predict(X_test)
lr_probs = lr.predict_proba(X_test)[:, 1]

results["logistic_regression"] = {
    "accuracy": round(accuracy_score(y_test, lr_preds), 4),
    "precision": round(precision_score(y_test, lr_preds), 4),
    "recall": round(recall_score(y_test, lr_preds), 4),
    "f1_score": round(f1_score(y_test, lr_preds), 4),
    "roc_auc": round(roc_auc_score(y_test, lr_probs), 4),
    "confusion_matrix": confusion_matrix(y_test, lr_preds).tolist()
}

rf = RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42)
rf.fit(X_train, y_train)
rf_preds = rf.predict(X_test)
rf_probs = rf.predict_proba(X_test)[:, 1]

results["random_forest"] = {
    "accuracy": round(accuracy_score(y_test, rf_preds), 4),
    "precision": round(precision_score(y_test, rf_preds), 4),
    "recall": round(recall_score(y_test, rf_preds), 4),
    "f1_score": round(f1_score(y_test, rf_preds), 4),
    "roc_auc": round(roc_auc_score(y_test, rf_probs), 4),
    "confusion_matrix": confusion_matrix(y_test, rf_preds).tolist(),
    "feature_importances": dict(zip(FEATURES, np.round(rf.feature_importances_, 4).tolist()))
}

print(json.dumps(results, indent=2))

best_model = rf if results["random_forest"]["f1_score"] >= results["logistic_regression"]["f1_score"] else lr
best_name = "random_forest" if best_model is rf else "logistic_regression"
print(f"\nBest model selected for production: {best_name}")

joblib.dump(best_model, "placement_model.pkl")
joblib.dump(FEATURES, "model_features.pkl")

with open("model_results.json", "w") as f:
    json.dump(results, f, indent=2)

print("\nModel saved as placement_model.pkl")
print("Results saved as model_results.json")
