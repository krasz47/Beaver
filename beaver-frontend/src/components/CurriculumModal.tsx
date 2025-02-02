import React, { useEffect, useState } from "react";

const achievementsData = [
  {
    id: 1,
    title: "🐣 Newbie Beaver",
    description: "Complete your first exercise.",
    xp: 10,
  },
  {
    id: 2,
    title: "🚀 Rising Star",
    description: "Complete 5 exercises.",
    xp: 25,
  },
  {
    id: 3,
    title: "🎩 Algorithm Wizard",
    description: "Finish all beginner-level exercises.",
    xp: 50,
  },
  {
    id: 4,
    title: "🔥 Persistent Beaver",
    description: "Maintain a 7-day learning streak.",
    xp: 70,
  },
  {
    id: 5,
    title: "🌟 Master of Logic",
    description: "Complete all exercises.",
    xp: 100,
  },
];

const CurriculumModal = ({ onClose, onLoadExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState(() => {
    return JSON.parse(localStorage.getItem("completedExercises")) || [];
  });

  const [streak, setStreak] = useState(() => {
    return JSON.parse(localStorage.getItem("learningStreak")) || 0;
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    return JSON.parse(localStorage.getItem("unlockedAchievements")) || [];
  });

  const [xp, setXP] = useState(() => {
    return JSON.parse(localStorage.getItem("xp")) || 0;
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    fetch("/exercises/curriculum.json")
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch((err) => console.error("Error loading curriculum:", err));

    const lastVisit = localStorage.getItem("lastVisit");
    const today = new Date().toISOString().split("T")[0];

    if (lastVisit !== today) {
      setStreak(streak + 1);
      localStorage.setItem("learningStreak", JSON.stringify(streak + 1));
      localStorage.setItem("lastVisit", today);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const newAchievements = achievementsData
      .filter(
        (achievement) =>
          !unlockedAchievements.includes(achievement.id) &&
          checkAchievementUnlock(
            achievement.id,
            completedExercises.length,
            streak
          )
      )
      .map((a) => a.id);

    if (newAchievements.length > 0) {
      setUnlockedAchievements([...unlockedAchievements, ...newAchievements]);
      localStorage.setItem(
        "unlockedAchievements",
        JSON.stringify([...unlockedAchievements, ...newAchievements])
      );

      const earnedXP = newAchievements.reduce((sum, id) => {
        const achievement = achievementsData.find((a) => a.id === id);
        return sum + (achievement?.xp || 0);
      }, 0);

      setXP(xp + earnedXP);
      localStorage.setItem("xp", JSON.stringify(xp + earnedXP));
    }
  }, [completedExercises, streak]);

  const checkAchievementUnlock = (achievementId, completedCount, streak) => {
    switch (achievementId) {
      case 1:
        return completedCount >= 1;
      case 2:
        return completedCount >= 5;
      case 3:
        return completedCount >= 10;
      case 4:
        return streak >= 7;
      case 5:
        return completedCount >= 20;
      default:
        return false;
    }
  };

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

        <div className="progress-tracker mt-4 p-3 bg-[#1a1a1a] rounded">
          <p className="font-bold text-lg">
            🌟 XP: {xp} | 🔥 Streak: {streak} Days
          </p>
          <p>Progress: {completedExercises.length}/30</p>
          <progress
            value={completedExercises.length}
            max="30"
            className="w-full h-2"
          ></progress>
        </div>

        <div className="flex-grow mt-4 overflow-y-scroll scrollbar-hidden">
          <div className="grid grid-cols-1 gap-2">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => startExercise(exercise)}
                className={`p-3 rounded text-left w-full text-lg font-medium flex items-center transition ${
                  completedExercises.includes(exercise.id)
                    ? "bg-green-600 text-white" // Completed exercises are green
                    : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                }`}
              >
                <span className="mr-3">{exercise.title}</span>
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-bold mt-4 pb-2">🏆 Achievements</h3>
        <div className="achievements grid grid-cols-2 gap-2 p-3 bg-[#1a1a1a] rounded">
          {achievementsData.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-2 rounded ${
                unlockedAchievements.includes(achievement.id)
                  ? "bg-gold text-white font-bold"
                  : "bg-darkGray"
              }`}
            >
              <span>
                {unlockedAchievements.includes(achievement.id) ? "✅" : "🔒"}
              </span>{" "}
              {achievement.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurriculumModal;
