import React, { useEffect, useState } from "react";

const CurriculumModal = ({ onClose, onLoadExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState(() => {
    return JSON.parse(localStorage.getItem("completedExercises")) || [];
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetch("/exercises/curriculum.json")
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch((err) => console.error("Error loading curriculum:", err));

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const startExercise = async (exercise) => {
    try {
      const response = await fetch(`/exercises/${exercise.filename}`);
      const data = await response.json();
      onLoadExercise(data);
    } catch (error) {
      console.error("Error loading exercise:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-[1000]">
      <div className="bg-darkGray p-6 rounded-lg min-w-[400px] max-w-[90vw] h-[80vh] flex flex-col text-white shadow-lg relative">
        <h2 className="text-xl font-bold">📚 Course Curriculum</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg hover:text-red-400"
        >
          ✖
        </button>

        <div className="flex-grow mt-4 overflow-y-scroll scrollbar-hidden">
          <div className="grid grid-cols-1 gap-2">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => startExercise(exercise)}
                className={`p-3 rounded text-left w-full text-lg font-medium flex items-center transition ${
                  completedExercises.includes(exercise.id)
                    ? "bg-green-600 text-white" // Mark completed exercises as green
                    : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                }`}
              >
                <span className="mr-3">{exercise.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumModal;
