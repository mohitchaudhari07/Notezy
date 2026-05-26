import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FAQ_ITEMS } from "../../utils/mockData";
import { cn } from "../../utils/cn";

export default function FAQSection() {
  const [openId, setOpenId] = useState(FAQ_ITEMS[0]?.id);

  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-center text-gray-500">
          Everything you need to know about Notezy.
        </p>

        <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-5 text-left"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 font-semibold text-gray-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-gray-400 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-relaxed text-gray-500">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
