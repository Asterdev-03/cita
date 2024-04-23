import {
  Annoyed,
  Meh,
  SpellCheck,
  HeartHandshake,
  Brain,
  PackageOpen,
} from "lucide-react";

export default function SkillCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <div className="p-4 flex flex-col justify-around space-y-3 rounded-2xl shadow-sm bg-white">
        <SpellCheck size={50} />
        <h2 className="text-4xl font-bold text-purple-900">
          <span>90</span>
        </h2>
        <p className="font-sans text-lg font-medium text-gray-500">
          Sentence Correction
        </p>
      </div>

      <div className="p-4 flex flex-col justify-around space-y-3 rounded-2xl shadow-sm bg-white">
        <Annoyed size={50} />
        <h2 className="text-4xl font-bold text-purple-900">
          <span>20</span>
        </h2>
        <p className="font-sans text-lg font-medium text-gray-500">
          Extroversion
        </p>
      </div>

      <div className="p-4 flex flex-col justify-around space-y-3 rounded-2xl shadow-sm bg-white">
        <Meh size={50} />
        <h2 className="text-4xl font-bold text-purple-900">
          <span>2680</span>
        </h2>
        <p className="font-sans text-lg font-medium text-gray-500">
          Neuroticism
        </p>
      </div>

      <div className="p-4 flex flex-col justify-around space-y-3 rounded-2xl shadow-sm bg-white">
        <HeartHandshake size={50} />
        <h2 className="text-4xl font-bold text-purple-900">
          <span>2680</span>
        </h2>
        <p className="font-sans text-lg font-medium text-gray-500">
          Agreebleness
        </p>
      </div>

      <div className="p-4 flex flex-col justify-around space-y-3 rounded-2xl shadow-sm bg-white">
        <Brain size={50} />
        <h2 className="text-4xl font-bold text-purple-900">
          <span>2680</span>
        </h2>
        <p className="font-sans text-lg font-medium text-gray-500">
          Conscientiousness
        </p>
      </div>

      <div className="p-4 flex flex-col justify-around space-y-3 rounded-2xl shadow-sm bg-white">
        <PackageOpen size={50} />
        <h2 className="text-4xl font-bold text-purple-900">
          <span>2680</span>
        </h2>
        <p className="font-sans text-lg font-medium text-gray-500">Openness</p>
      </div>
    </div>
  );
}
