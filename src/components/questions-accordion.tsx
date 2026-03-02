import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { questionsAccordion } from "@/constants/questions";

interface QuestionsAccordionProps {
  layout: "landing" | "product-details";
}

export function QuestionsAccordion({ layout }: QuestionsAccordionProps) {
  return (
    <section
      className={`${layout === "landing" ? "container mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8" : "mt-12"}`}
      id="questions"
    >
      <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:gap-6">
        <div
          className={`${layout === "landing" ? "lg:order-1" : "lg:order-2"} w-full lg:flex-1`}
        >
          {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
          <img
            alt="Frequently asked questions"
            className="h-64 w-full rounded-2xl object-cover lg:h-full"
            src="https://images.unsplash.com/photo-1577467014570-02e2cb105b7b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>

        <div
          className={`${layout === "landing" ? "lg:order-2" : "lg:order-1"} w-full lg:flex-1`}
        >
          <Accordion className="w-full" collapsible type="single">
            {questionsAccordion.map((question) => (
              <AccordionItem
                className="py-2"
                key={question.id}
                value={`item-${question.id}`}
              >
                <AccordionTrigger className="cursor-pointer items-center border border-gray-200 bg-white px-6 font-semibold text-black text-xl">
                  {question.question}
                </AccordionTrigger>
                <AccordionContent className="bg-white px-6 text-base text-black/80">
                  <p>{question.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
