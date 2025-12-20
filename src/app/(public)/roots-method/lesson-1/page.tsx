'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RootsLearningClient } from '@/components/roots-method/roots-learning-client';

const BRAND_COLOR = '#722F37';
const ACCENT_COLOR = '#D4AF37';

export default function Lesson1Page() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
  const [showAnswers, setShowAnswers] = useState<number[]>([]);

  const sections = [
    {
      id: 0,
      title: 'Welcome',
      type: 'content',
      content: (
        <>
          <div className="flex gap-5 mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gold-500">
              <Image src="/coaches/sarah-coach.webp" alt="Sarah" width={64} height={64} className="object-cover" />
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                I see you. You became a healthcare worker because you wanted to <strong className="text-burgundy-700">truly help people heal</strong>.
                But somewhere along the way, the system started breaking <em>you</em>. The impossible patient loads. The rushed visits.
                The feeling that you're treating charts, not humans.
              </p>
            </div>
          </div>
          <h3 className="text-xl text-gray-900 mb-4 font-semibold flex items-center gap-2">
            <span className="text-2xl">🌱</span> Welcome to R.O.O.T.S.
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">You're about to learn a proprietary method that has transformed <strong className="text-burgundy-700">thousands of burned-out healthcare professionals</strong> into thriving practitioners who:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2"><span className="text-gold-500 font-bold">✓</span> Work <strong>fewer hours</strong> than they did in clinical settings</li>
            <li className="flex items-start gap-2"><span className="text-gold-500 font-bold">✓</span> Earn <strong>more money</strong> with greater flexibility</li>
            <li className="flex items-start gap-2"><span className="text-gold-500 font-bold">✓</span> Actually see their clients <strong>get better</strong></li>
            <li className="flex items-start gap-2"><span className="text-gold-500 font-bold">✓</span> Rediscover <strong>why they went into healthcare</strong> in the first place</li>
          </ul>
        </>
      ),
    },
    {
      id: 1,
      title: 'The Burnout Epidemic',
      type: 'content',
      content: (
        <>
          <h3 className="text-xl text-gray-900 mb-4 font-semibold">You're Not Alone — This Is an Epidemic</h3>
          <div className="grid grid-cols-2 gap-3 my-6">
            {[
              { stat: '63%', label: 'of nurses report burnout' },
              { stat: '54%', label: 'of physicians are burned out' },
              { stat: '400+', label: 'physicians die by suicide yearly' },
              { stat: '500K', label: 'nurses leave profession by 2027' },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-burgundy-700">{item.stat}</div>
                <div className="text-sm text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed">Burnout isn't a personal failure. It's a <strong className="text-burgundy-700">systemic crisis</strong>. And you deserve a way out that doesn't mean abandoning everything you've worked for.</p>
        </>
      ),
    },
    {
      id: 2,
      title: 'Quick Check',
      type: 'quickcheck',
      question: 'What percentage of nurses report experiencing burnout?',
      options: ['33%', '45%', '63%', '78%'],
      correct: '63%',
      explanation: '63% of nurses report burnout. This epidemic is driving talented healthcare workers to seek new paths—like the R.O.O.T.S. Method.',
    },
    {
      id: 3,
      title: 'What R.O.O.T.S. Stands For',
      type: 'content',
      content: (
        <>
          <h3 className="text-xl text-gray-900 mb-4 font-semibold">The R.O.O.T.S. Method™</h3>
          <p className="text-gray-600 mb-6">This framework is your roadmap from burned-out clinician to thriving practitioner:</p>
          <div className="space-y-3">
            {[
              { letter: 'R', title: 'Recognize the Pattern', desc: 'See what conventional medicine misses' },
              { letter: 'O', title: 'Find the Origin', desc: 'Trace symptoms to their true source' },
              { letter: 'O', title: 'Optimize the Foundations', desc: 'The 5 pillars every client needs' },
              { letter: 'T', title: 'Transform with Coaching', desc: 'Guide lasting behavioral change' },
              { letter: 'S', title: 'Scale Your Practice', desc: 'Build a profitable, flexible business' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl items-center">
                <div className="w-12 h-12 rounded-xl bg-burgundy-700 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {item.letter}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 4,
      title: 'Your Unique Advantage',
      type: 'content',
      content: (
        <>
          <h3 className="text-xl text-gray-900 mb-4 font-semibold">Why Healthcare Workers Excel at This</h3>
          <p className="text-gray-600 mb-4">You're not starting from zero. Your clinical training gives you <strong className="text-burgundy-700">massive advantages</strong>:</p>
          <div className="space-y-3 mb-6">
            {['Clinical assessment skills (takes others years to learn)', 'Medical literacy & lab interpretation', 'Patient communication mastery', 'Crisis management under pressure', 'Instant credibility with clients'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <span className="text-gold-500 font-semibold text-lg">✓</span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-burgundy-700 text-white p-6 rounded-xl">
            <p className="italic">"I was an ICU nurse for 12 years. Within 8 months of learning the R.O.O.T.S. Method, I replaced my nursing income working 20 hours a week from home. Best decision I ever made."</p>
            <p className="mt-3 text-sm opacity-90">— Jennifer T., RN → Certified R.O.O.T.S. Practitioner</p>
          </div>
        </>
      ),
    },
    {
      id: 5,
      title: 'Quick Check',
      type: 'quickcheck',
      question: 'What does the "S" in R.O.O.T.S. stand for?',
      options: ['Symptoms', 'Science', 'Scale Your Practice', 'Support'],
      correct: 'Scale Your Practice',
      explanation: '"S" stands for Scale Your Practice—the crucial step of building a sustainable, profitable business doing what you love.',
    },
    {
      id: 6,
      title: 'What You\'ll Learn',
      type: 'content',
      content: (
        <>
          <h3 className="text-xl text-gray-900 mb-4 font-semibold">Your R.O.O.T.S. Training Journey</h3>
          <p className="text-gray-600 mb-6">Over these 9 lessons, you'll master:</p>
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            {[
              'From Burnout to Purpose',
              'Your Clinical Advantage Assessment',
              'The R.O.O.T.S. Framework Overview',
              'R — Recognize the Pattern',
              'O — Find the Origin',
              'O — Optimize the Foundations',
              'T — Transform with Coaching',
              'S — Scale Your Practice',
              'Case Study + 90-Day Roadmap',
            ].map((lesson, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-0">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${i === 0 ? 'bg-burgundy-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i + 1}
                </span>
                <span className={i === 0 ? 'text-burgundy-700 font-medium' : 'text-gray-600'}>{lesson}</span>
              </div>
            ))}
          </div>
          <div className="bg-white border-2 border-gold-500 rounded-2xl p-6 text-center">
            <div className="text-sm text-gray-500 mb-2">Upon completion, you'll receive your</div>
            <div className="text-xl font-bold text-burgundy-700">R.O.O.T.S. Method™ Foundation Certificate</div>
            <div className="text-sm text-gray-500 mt-2">Accredited training recognized by 9 professional bodies</div>
          </div>
        </>
      ),
    },
  ];

  const totalSections = sections.length;
  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === totalSections - 1;
  const isQuickCheck = currentSectionData.type === 'quickcheck';
  const canContinue = isQuickCheck ? showAnswers.includes(currentSectionData.id) : true;

  const handleContinue = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickCheck = (id: number, answer: string) => {
    setQuickCheckAnswers({ ...quickCheckAnswers, [id]: answer });
  };

  const handleCheckAnswer = (id: number) => {
    if (!showAnswers.includes(id)) {
      setShowAnswers([...showAnswers, id]);
    }
  };

  return (
    <RootsLearningClient
      lessonNumber={1}
      lessonTitle="From Burnout to Purpose: Why You're Really Here"
      onComplete={handleContinue}
      isLastSection={isLastSection}
      canContinue={canContinue}
    >
      {currentSectionData.type === 'content' ? (
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed">
          {currentSectionData.content}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💡</span>
            <span className="text-sm font-semibold text-burgundy-700 uppercase tracking-wide">Quick Check</span>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-6">{currentSectionData.question}</p>
          <div className="space-y-3">
            {currentSectionData.options?.map((option: string) => {
              const selected = quickCheckAnswers[currentSectionData.id] === option;
              const correct = option === currentSectionData.correct;
              const showResult = showAnswers.includes(currentSectionData.id);
              return (
                <button
                  key={option}
                  onClick={() => !showResult && handleQuickCheck(currentSectionData.id, option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    showResult
                      ? correct
                        ? 'bg-green-50 border-green-500'
                        : selected
                          ? 'bg-red-50 border-red-500'
                          : 'border-gray-200'
                      : selected
                        ? 'bg-burgundy-50 border-burgundy-500'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      showResult && correct
                        ? 'bg-green-500 border-green-500 text-white'
                        : showResult && selected && !correct
                          ? 'bg-red-500 border-red-500 text-white'
                          : selected && !showResult
                            ? 'bg-burgundy-500 border-burgundy-500 text-white'
                            : 'border-gray-300'
                    }`}>
                      {showResult && correct && '✓'}
                      {showResult && selected && !correct && '✗'}
                    </span>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (
            <button
              onClick={() => handleCheckAnswer(currentSectionData.id)}
              className="mt-6 w-full py-4 bg-burgundy-700 text-white rounded-xl font-semibold hover:bg-burgundy-800 transition-colors"
            >
              Check Answer
            </button>
          )}
          {showAnswers.includes(currentSectionData.id) && (
            <div className={`mt-6 p-4 rounded-xl ${
              quickCheckAnswers[currentSectionData.id] === currentSectionData.correct
                ? 'bg-green-50 border border-green-200'
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span>
                <strong className={quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'text-green-700' : 'text-amber-700'}>
                  {quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}
                </strong>
              </div>
              <p className="text-gray-700">{currentSectionData.explanation}</p>
            </div>
          )}
        </div>
      )}
    </RootsLearningClient>
  );
}
