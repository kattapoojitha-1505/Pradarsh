import { useState } from 'react'
import { motion } from 'framer-motion'

const faqs = [
  {
    question: "What is Pradarsh?",
    answer: "Pradarsh is a developer showcase platform where creators can publish projects, share live demos, highlight their tech stack and gain visibility within the developer community."
  },
  {
    question: "How do I publish a project?",
    answer: "Simply create an account, navigate to the Publish page, upload a project banner, add your project details, technology stack and live demo URL, then submit it for display on the platform."
  },
  {
    question: "Can I edit my project after publishing?",
    answer: "Yes. Developers can update project information, descriptions, banners and technology details from their dashboard whenever needed."
  },
  {
    question: "Is there a limit on how many projects I can publish?",
    answer: "No. You can publish multiple projects and build a complete showcase portfolio to demonstrate your skills and experience."
  },
  {
    question: "Why should I use Pradarsh?",
    answer: "Pradarsh helps developers gain visibility, showcase their work professionally, discover innovative projects and connect with fellow builders from different domains."
  }
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <div className="w-full bg-[#FAF9FD] py-24 border-t border-gray-150/40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Everything you need to know about publishing, discovering and showcasing projects on Pradarsh.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx
            return (
              <div
                key={idx}
                className={`group rounded-[24px] border backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden ${
                  isOpen
                    ? 'bg-white border-primary-300 shadow-[0_0_25px_rgba(139,92,246,0.06),_0_0_15px_rgba(236,72,153,0.03)]'
                    : 'bg-white/80 border-gray-200/80 hover:bg-white hover:-translate-y-0.5 hover:border-primary-200/85 hover:shadow-[0_8px_25px_rgba(139,92,246,0.02)]'
                }`}
                onClick={() => setActiveIndex(isOpen ? null : idx)}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between p-6 sm:p-7 select-none">
                  <span className={`text-base sm:text-lg font-bold transition-colors duration-250 ${
                    isOpen ? 'text-[#0F172A]' : 'text-gray-700 group-hover:text-[#0F172A]'
                  }`}>
                    {faq.question}
                  </span>
                  
                  {/* Custom morphing plus-minus icon */}
                  <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0 ml-4">
                    <div className={`absolute w-3.5 h-0.5 rounded transition-all duration-300 ${isOpen ? 'bg-primary-500 rotate-180' : 'bg-gray-400'}`} />
                    <div className={`absolute w-0.5 h-3.5 rounded transition-all duration-300 ${isOpen ? 'bg-primary-500 rotate-90 scale-0' : 'bg-gray-400'}`} />
                  </div>
                </div>

                {/* Answer Expandable container */}
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 border-t border-gray-100/50">
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
