import { FC } from "react";
import { motion } from "framer-motion";

interface HelpCategory {
  title: string;
  description: string;
  icon: string;
}

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

const HelpCategories: FC<HelpCategoriesProps> = ({ categories }) => {
  return (
    <section
      id="help-categories"
      className="scroll-mt-28 transition-colors duration-300"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 mb-4">
          <i className="fa-solid fa-layer-group"></i>
          <span className="text-sm font-semibold">HELP CATEGORIES</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Explore by Category
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Browse support topics designed to help you quickly understand
          StorySparkAI features, workflows, and troubleshooting steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14">
        {categories.map((category) => (
          <HelpCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </motion.section>
      {!categories || categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-magnifying-glass text-3xl text-slate-500"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Categories Found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-14">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
              }}
              className="
                group relative overflow-hidden
                rounded-3xl
                border border-slate-200 dark:border-white/10
                bg-white dark:bg-white/[0.04]
                backdrop-blur-2xl
                hover:border-blue-500/40
                transition-all duration-300
                shadow-lg hover:shadow-2xl
                p-7
              "
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div
                  className="
                    w-16 h-16 rounded-2xl
                    bg-gradient-to-br from-blue-500/20 to-indigo-500/20
                    border border-blue-500/20
                    flex items-center justify-center
                    text-2xl text-blue-400
                    mb-6
                    group-hover:scale-110
                    transition-transform duration-300
                  "
                >
                  <i className={`fa-solid ${category.icon}`}></i>
                </div>

        <p className="mt-3 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Jump into the topic you need — from your first story to contributing code.
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <HelpCategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default HelpCategories;