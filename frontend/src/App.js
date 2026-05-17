import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Load symptoms from backend
  useEffect(() => {
    axios
      .get("https://medpredict-ai-ggcd.onrender.com/symptoms")
      .then((response) => {
        setSymptoms(response.data.symptoms);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Handle symptom selection
  const handleCheckbox = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(
        selectedSymptoms.filter((s) => s !== symptom)
      );
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Clear symptoms
  const clearSymptoms = () => {
    setSelectedSymptoms([]);
    setPredictions([]);
  };

  // Predict disease
  const predictDisease = async () => {

    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://medpredict-ai-ggcd.onrender.com/predict",
        {
          symptoms: selectedSymptoms,
        }
      );

      setPredictions(response.data.predictions);

    } catch (error) {
      console.error(error);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // Filter symptoms
  const filteredSymptoms = symptoms.filter((symptom) =>
    symptom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #020617, #0f172a)",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              marginBottom: "10px",
              color: "#38bdf8",
              textShadow: "0 0 20px rgba(56,189,248,0.7)",
            }}
          >
            MedPredict AI
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "18px",
            }}
          >
            AI Powered Disease Prediction System
          </p>
        </div>

        {/* Main Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "30px",
          }}
        >

          {/* Symptoms Card */}
          <div
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Select Symptoms
            </h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search symptoms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                marginBottom: "20px",
                fontSize: "16px",
              }}
            />

            {/* Symptoms Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {filteredSymptoms.map((symptom) => (
                <label
                  key={symptom}
                  style={{
                    background: selectedSymptoms.includes(symptom)
                      ? "#0284c7"
                      : "#334155",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleCheckbox(symptom)}
                    style={{
                      marginRight: "10px",
                    }}
                  />

                  {symptom}
                </label>
              ))}
            </div>

            {/* Buttons Row */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "30px",
              }}
            >

              {/* Predict Button */}
              <button
                onClick={predictDisease}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#38bdf8",
                  color: "black",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s",
                  boxShadow: "0 4px 15px rgba(56,189,248,0.4)",
                }}
              >
                {loading ? "Predicting..." : "Predict Disease"}
              </button>

              {/* Clear Button */}
              <button
                onClick={clearSymptoms}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s",
                  boxShadow: "0 4px 15px rgba(239,68,68,0.4)",
                }}
              >
                Clear Symptoms
              </button>

            </div>
          </div>

          {/* Result Card */}
          <div
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              height: "fit-content",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Prediction Result
            </h2>

            {predictions.length > 0 ? (

              <div>
                {predictions.map((item, index) => (

                  <div
                    key={index}
                    style={{
                      background: "linear-gradient(135deg, #0f172a, #1e293b)",
                      padding: "20px",
                      borderRadius: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#38bdf8",
                        marginBottom: "10px",
                      }}
                    >
                      Prediction #{index + 1}
                    </h3>

                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.disease}
                    </p>

                    <div
  style={{
    marginTop: "15px",
  }}
>
  <p
    style={{
      marginBottom: "8px",
      color: "#cbd5e1",
      fontWeight: "bold",
    }}
  >
    Confidence: {item.confidence}
  </p>

  {/* Confidence Bar */}
  <div
    style={{
      width: "100%",
      height: "12px",
      background: "#334155",
      borderRadius: "20px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: item.confidence,
        height: "100%",
        background: "linear-gradient(to right, #38bdf8, #0ea5e9)",
        borderRadius: "20px",
        transition: "1s ease-in-out",
      }}
    />
  </div>
</div>
                  </div>

                ))}
              </div>

            ) : (
              <p
                style={{
                  color: "#cbd5e1",
                }}
              >
                Select symptoms and click predict.
              </p>
            )}

            {/* Selected Symptoms */}
            <div
              style={{
                marginTop: "30px",
              }}
            >
              <h3
                style={{
                  marginBottom: "10px",
                }}
              >
                Selected Symptoms
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    style={{
                      background: "#0284c7",
                      padding: "8px 12px",
                      borderRadius: "20px",
                      fontSize: "14px",
                    }}
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
